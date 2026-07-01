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
 * Por eso en CI el paso es continue-on-error.
 *
 * Uso:
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs --dry-run
 *   AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs --seconds 120
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/marin/data.json');

const STREAM_URL = 'wss://stream.aisstream.io/v0/stream';
const DEFAULT_SECONDS = 90;
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
 * Escucha el stream `sec` segundos y devuelve Map<mmsi, posición> con la ÚLTIMA
 * posición recibida de cada buque. Resuelve siempre (nunca rechaza): un fallo de
 * red deja el Map con lo que se haya recibido (best-effort).
 */
function collectPositions(key, mmsis, sec) {
  return new Promise(resolve => {
    const positions = new Map();
    const ws = new WebSocket(STREAM_URL);
    ws.binaryType = 'arraybuffer'; // aisstream envía frames binarios

    let timer;
    const done = () => { clearTimeout(timer); try { ws.close(); } catch { /* noop */ } resolve(positions); };

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        APIKey: key,
        BoundingBoxes: [[[-90, -180], [90, 180]]], // todo el globo; acotamos por MMSI
        FiltersShipMMSI: mmsis,
        FilterMessageTypes: ['PositionReport'],
      }));
      console.log(`Conectado a aisstream · ${mmsis.length} MMSI · ventana ${sec}s…`);
      timer = setTimeout(done, sec * 1000);
    });

    ws.addEventListener('message', ev => {
      let msg;
      try { msg = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8')); }
      catch { return; }
      if (msg.error) { console.error('aisstream error:', msg.error); return; }
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
        console.log(`  ✓ MMSI ${mmsi}: ${pr.Latitude.toFixed(3)}, ${pr.Longitude.toFixed(3)} · ${pr.Sog} kn · COG ${pr.Cog}°`);
      }
    });

    ws.addEventListener('error', e => console.error('WS error:', e?.message || e));
    ws.addEventListener('close', () => { /* done() ya resuelve; cierre limpio no hace nada */ });
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

  const key = process.env.AISSTREAM_KEY;
  if (!key) {
    console.warn('⚠️  Falta AISSTREAM_KEY — se omite el enriquecimiento de posición (best-effort). ' +
      'Genera una gratis en https://aisstream.io/apikeys');
    return; // salir 0: paso opcional
  }
  if (typeof WebSocket === 'undefined') {
    console.warn('⚠️  Este Node no tiene WebSocket nativo (hace falta Node ≥ 22) — se omite.');
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

  const positions = await collectPositions(key, mmsis.slice(0, MMSI_LIMIT), seconds);
  const scrapedAt = toSpainIso(new Date());

  let located = 0;
  for (const call of data.calls) {
    const p = call.mmsi ? positions.get(String(call.mmsi)) : null;
    if (p) { applyPosition(call, p, scrapedAt); located++; }
  }

  console.log(`\nResumen: ${located}/${data.calls.length} escalas con posición · ${positions.size}/${mmsis.length} MMSI emitieron · snapshot ${scrapedAt}`);
  const missing = mmsis.filter(m => !positions.has(m));
  if (missing.length) console.log(`Sin posición en la ventana (se conserva la anterior): ${missing.join(', ')}`);

  if (isDryRun) {
    console.log('\n--- DRY RUN: data.json no modificado ---');
    return;
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log('✓ data.json actualizado con posiciones AIS');
}

main().catch(err => {
  console.error('Error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
