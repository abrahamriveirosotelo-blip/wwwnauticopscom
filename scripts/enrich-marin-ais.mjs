#!/usr/bin/env node
/**
 * Enriquece las escalas de Marín con la POSICIÓN EN VIVO de los buques desde
 * aisstream.io (posición/rumbo/velocidad que VesselFinder no expone): conecta al
 * stream WebSocket, se suscribe filtrando por los MMSI de nuestra flota, escucha
 * una ventana corta y guarda la última posición de cada buque en data.json.
 *
 * Complementa a los otros dos enriquecedores (identidad/estado desde VesselFinder);
 * aquí SOLO tratamos cinemática de posición: lat/lon, rumbo (COG), velocidad (SOG),
 * proa (heading) e instante de la posición. El estado (aisStatus) y la ETA siguen
 * viniendo de enrich-marin-live.mjs — no se tocan aquí, para no competir con ellos.
 *
 * Requiere el MMSI ya persistido (lo rellena enrich-marin.mjs) y una API key
 * gratuita de aisstream (https://aisstream.io/apikeys) en AISSTREAM_KEY.
 *
 * Best-effort: sin key, sin WebSocket o si un buque no emite en la ventana, NO se
 * escribe basura — se conserva lo anterior (buildCalls arrastra los campos aisX).
 *
 * PENSADO PARA EJECUTARSE EN LOCAL: los buques (sobre todo atracados) emiten posición
 * cada varios minutos, así que hace falta una ventana LARGA. Déjalo corriendo un rato
 * (p. ej. antes de una demo) y ve commiteando data.json. Reconecta si aisstream cierra
 * el socket, vuelca a disco cada `--flush` s (para commitear sin parar el proceso) y
 * corta limpio con Ctrl-C conservando lo captado. En cada pasada las posiciones se
 * ACUMULAN (los no captados conservan su última posición). No corre en CI: sin un
 * servidor con el WebSocket abierto 24/7, una ventana de cron es demasiado corta.
 *
 * Uso:
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs                    # ventana 90 s
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs --seconds 3600     # 1 h, volcando cada 60 s
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs --seconds 3600 --flush 120
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs --dry-run          # sin escribir
 *   (Ctrl-C en cualquier momento: guarda lo captado y sale)
 */

import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/marin/data.json');

const STREAM_URL = 'wss://stream.aisstream.io/v0/stream';
const DEFAULT_SECONDS = 90;
const DEFAULT_FLUSH_SECONDS = 60; // en runs largos, vuelca data.json cada 60 s
const MMSI_LIMIT = 50; // límite de FiltersShipMMSI de aisstream

/** Instante (Date) → ISO naive en hora de España (Europe/Madrid, con DST). */
function toSpainIso(date) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** aisstream marca "no disponible" con estos centinelas; los normalizamos a null. */
const num = (v, sentinel) => (v == null || v === sentinel ? null : v);

const round = (n, d) => (n == null ? null : Math.round(n * 10 ** d) / 10 ** d);

/** time_utc de aisstream ("2026-07-01 12:34:56.789 +0000 UTC") → Date, o null. */
function parseAisTime(timeUtc) {
  if (!timeUtc) return null;
  // Formato de Go: fecha<space>hora<fracción opcional><space>+0000<space>UTC.
  const iso = timeUtc.replace(' ', 'T').replace(/(\.\d+)?\s*\+?0000.*$/, 'Z');
  const t = new Date(iso);
  return Number.isNaN(t.getTime()) ? null : t;
}

/**
 * Escucha el stream hasta `sec` segundos y devuelve Map<mmsi, posición> con la ÚLTIMA
 * posición de cada buque. RECONECTA si aisstream cierra el socket antes del deadline
 * (habitual en ventanas largas), para no perder el resto de la ventana. Resuelve
 * siempre (nunca rechaza): lo captado hasta el corte es el resultado (best-effort).
 */
function collectPositions(WS, key, mmsis, sec, { onFlush, flushSeconds = 0 } = {}) {
  return new Promise(resolve => {
    const positions = new Map();
    const endAt = Date.now() + sec * 1000;
    let ws = null;
    let stopped = false;
    let deadlineTimer = null;
    let flushTimer = null;
    let reconnectTimer = null;

    const finish = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(deadlineTimer);
      clearInterval(flushTimer);
      clearTimeout(reconnectTimer); // no reabrir el socket tras terminar
      process.off('SIGINT', onSigint);
      try { ws && ws.close(); } catch { /* noop */ }
      resolve(positions);
    };
    // Ctrl-C: cortar limpio conservando lo captado (para runs largos que se paran a mano).
    const onSigint = () => { console.log('\n⏹  Ctrl-C: guardo lo captado y salgo…'); finish(); };

    const onMessage = ev => {
      let msg;
      try { msg = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8')); }
      catch { return; }
      // Error del protocolo (p. ej. API key inválida): es fatal → parar, no reconectar en bucle.
      if (msg.error) { console.error('aisstream error:', msg.error); finish(); return; }
      if (msg.MessageType !== 'PositionReport') return;
      const meta = msg.MetaData || {};
      const pr = msg.Message.PositionReport;
      const mmsi = String(meta.MMSI ?? '');
      if (!mmsi) return;
      const first = !positions.has(mmsi);
      positions.set(mmsi, {
        lat: pr.Latitude,
        lon: pr.Longitude,
        // aisstream ya viene decodificado: Sog en nudos (102.3 = no disponible),
        // Cog en grados (360.0 = no disponible), TrueHeading en grados (511 = no disponible).
        sog: num(pr.Sog, 102.3),
        cog: num(pr.Cog, 360),
        heading: num(pr.TrueHeading, 511),
        navCode: pr.NavigationalStatus,
        timeUtc: meta.time_utc || null,
      });
      if (first) {
        console.log(`  ✓ MMSI ${mmsi}: ${pr.Latitude.toFixed(3)}, ${pr.Longitude.toFixed(3)} · ${pr.Sog} kn · COG ${pr.Cog}° · ${positions.size}/${mmsis.length}`);
      }
    };

    const connect = () => {
      if (stopped) return; // finish() pudo dispararse durante el backoff de reconexión
      ws = new WS(STREAM_URL);
      ws.binaryType = 'arraybuffer'; // aisstream envía frames binarios
      ws.addEventListener('open', () => ws.send(JSON.stringify({
        APIKey: key,
        BoundingBoxes: [[[-90, -180], [90, 180]]], // todo el globo; acotamos por MMSI
        FiltersShipMMSI: mmsis,
        FilterMessageTypes: ['PositionReport'],
      })));
      ws.addEventListener('message', onMessage);
      ws.addEventListener('error', e => console.error('WS error:', e?.message || e));
      ws.addEventListener('close', () => {
        if (stopped) return;
        const leftMs = endAt - Date.now();
        if (leftMs <= 1500) { finish(); return; } // ya casi en el deadline: no reconectar
        console.log(`  … socket cerrado; reconectando (${Math.round(leftMs / 1000)}s restantes, ${positions.size}/${mmsis.length} captados)`);
        reconnectTimer = setTimeout(connect, 1000);
      });
    };

    deadlineTimer = setTimeout(finish, sec * 1000);
    // Vuelca a disco cada `flushSeconds` (runs largos): permite commitear progresivamente
    // sin parar el proceso, y que un corte no planificado no pierda más de una ventana.
    // Guarda `stopped`: un tick ya encolado no se cancela con clearInterval, así que
    // sin esto podría colarse un volcado extra tras finish() (Ctrl-C/deadline).
    if (onFlush && flushSeconds > 0) flushTimer = setInterval(() => { if (!stopped) onFlush(positions); }, flushSeconds * 1000);
    process.once('SIGINT', onSigint);
    connect();
    console.log(`aisstream · ${mmsis.length} MMSI · ventana ${sec}s (reconecta si el socket se cae${onFlush && flushSeconds > 0 ? `; vuelca cada ${flushSeconds}s` : ''})…`);
  });
}

/** Aplica una posición a la escala (solo cinemática; no toca estado/ETA de VF). */
function applyPosition(call, p, scrapedAt) {
  call.aisLat = round(p.lat, 5);
  call.aisLon = round(p.lon, 5);
  call.aisSog = p.sog;         // nudos o null
  call.aisCog = p.cog;         // grados (rumbo sobre el fondo) o null
  call.aisHeading = p.heading; // grados (proa) o null
  // Instante de la posición según AIS (time_utc), convertido a hora España; si no
  // viene, el instante del scrape. Sirve para mostrar la frescura en la UI.
  const t = parseAisTime(p.timeUtc);
  call.aisPosAt = t ? toSpainIso(t) : scrapedAt;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const sIdx = args.indexOf('--seconds');
  const seconds = sIdx !== -1 ? (parseInt(args[sIdx + 1], 10) || DEFAULT_SECONDS) : DEFAULT_SECONDS;
  const fIdx = args.indexOf('--flush');
  const flushSeconds = fIdx !== -1 ? (parseInt(args[fIdx + 1], 10) || 0) : DEFAULT_FLUSH_SECONDS;

  const key = process.env.AISSTREAM_KEY;
  if (!key) {
    console.warn('⚠️  Falta AISSTREAM_KEY — se omite el enriquecimiento de posición (best-effort). ' +
      'Genera una gratis en https://aisstream.io/apikeys');
    return; // salir 0: paso opcional
  }
  // WebSocket global llegó en Node 22; en Node 20 (permitido por engines) usa undici.
  let WS = globalThis.WebSocket;
  if (!WS) {
    try { ({ WebSocket: WS } = await import('undici')); }
    catch { /* undici no instalado */ }
  }
  if (!WS) {
    console.warn('⚠️  Sin WebSocket (ni global ni undici) — se omite. Usa Node ≥ 22 o instala undici.');
    return;
  }

  const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  // Un MMSI puede repetirse en varias escalas del mismo buque: se consulta una vez.
  const mmsis = [...new Set(data.calls.map(c => c.mmsi).filter(Boolean).map(String))];
  console.log(`Buques con MMSI a localizar: ${mmsis.length}`);
  if (!mmsis.length) {
    console.warn('⚠️  Ninguna escala tiene MMSI — ejecuta antes enrich-marin.mjs (rellena el mmsi).');
    return;
  }
  if (mmsis.length > MMSI_LIMIT) {
    // aisstream ignora los MMSI por encima del límite; avísalo en vez de fallar en silencio.
    console.warn(`⚠️  ${mmsis.length} MMSI > límite ${MMSI_LIMIT} de aisstream; solo se localizarán los primeros ${MMSI_LIMIT}.`);
  }
  // Solo se consultan los primeros MMSI_LIMIT; el resto ni se pide (no cuenta como "sin posición").
  const queried = mmsis.slice(0, MMSI_LIMIT);

  // Aplica las posiciones captadas y (salvo dry-run) escribe data.json. Se usa tanto
  // en los volcados progresivos como en el resumen final.
  //
  // En runs largos (ventanas de una hora, volcando cada N s) el data.json puede cambiar en
  // disco DURANTE la ventana: el cron / otros pasos (update-marin, enrich-marin-meteo) o una
  // edición manual pueden actualizar meta (avisos, frescura), escalas nuevas, etc. Este
  // proceso solo es dueño de las POSICIONES en calls[], así que en cada volcado parte del
  // data.json ACTUAL en disco (no del snapshot de arranque) y le re-aplica las posiciones
  // acumuladas. Así no pisa esos cambios externos. Si la relectura falla (fichero a medias por
  // un write concurrente), pospone ESE volcado en vez de escribir un snapshot viejo (ver dentro).
  const write = (pos, label) => {
    const scrapedAt = toSpainIso(new Date());
    let disk = data;
    if (!isDryRun) {
      // Si el data.json actual no se puede parsear (p. ej. se lee justo mientras otro proceso
      // lo está escribiendo), NO se vuelca en este flush: las posiciones siguen acumuladas en
      // memoria y se aplican en el siguiente, cuando el fichero vuelva a ser legible. Caer al
      // snapshot de arranque volvería a pisar los cambios externos que se quieren respetar.
      try {
        disk = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
      } catch (e) {
        console.warn(`${label}: data.json no legible ahora (${e?.message ?? e}); se pospone el volcado, las posiciones quedan en memoria.`);
        return;
      }
    }
    let located = 0;
    for (const call of disk.calls) {
      const p = call.mmsi ? pos.get(String(call.mmsi)) : null;
      if (p) { applyPosition(call, p, scrapedAt); located++; }
    }
    if (!isDryRun) {
      // Escritura atómica: se escribe a un temporal y se renombra (rename es atómico en POSIX).
      // Así un lector concurrente nunca ve el fichero a medias ni a 0 bytes.
      const tmp = DATA_PATH + '.tmp';
      writeFileSync(tmp, JSON.stringify(disk, null, 2) + '\n', 'utf-8');
      renameSync(tmp, DATA_PATH);
    }
    console.log(`${label}: ${located}/${disk.calls.length} escalas con posición · ${pos.size}/${queried.length} MMSI · ${scrapedAt}${isDryRun ? ' · DRY RUN (no escrito)' : ' · data.json escrito'}`);
  };

  const positions = await collectPositions(WS, key, queried, seconds, {
    onFlush: isDryRun ? null : pos => write(pos, '  💾 volcado parcial'),
    flushSeconds,
  });

  write(positions, '\nResumen final');
  const missing = queried.filter(m => !positions.has(m));
  if (missing.length) console.log(`Sin posición (se conserva la anterior): ${missing.join(', ')}`);
}

main().catch(err => {
  console.error('Error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
