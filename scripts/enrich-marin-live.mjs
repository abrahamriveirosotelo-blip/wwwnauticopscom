#!/usr/bin/env node
/**
 * Enriquece las escalas de Marín con datos AIS EN VIVO de vesselfinder.com:
 * estado de navegación (atracado/navegando), velocidad, calado y ETA reportada.
 *
 * A diferencia de enrich-marin.mjs (datos estáticos cacheables), estos datos son
 * DINÁMICOS y NO se cachean: se vuelven a pedir en cada ejecución, una petición
 * por buque ya identificado con IMO (no hace falta búsqueda). Pensado para
 * ejecutarse DESPUÉS de enrich-marin.mjs (que es quien rellena el `imo`).
 *
 * Además calcula, en el script (no en la vista), los booleanos derivados que la
 * UI necesita: `aisAtMarin` (el destino AIS es Marín, por token), `aisToFinal`
 * (el destino AIS coincide con el `to` de la AP → Marín es escala intermedia) y
 * `aisArrivedMarin` (atracado/fondeado en Marín y SIN ETA pendiente → ya ha llegado).
 *
 * La ETA del AIS se publica en UTC; aquí se convierte a hora de España para que
 * sea comparable con la ETA de la Autoridad Portuaria (que ya está en local).
 * `aisAt` se guarda como instante absoluto del scrape (hora España), no como
 * "X min ago", que sería engañoso una vez commiteado en un snapshot estático.
 *
 * Uso:
 *   node scripts/enrich-marin-live.mjs
 *   node scripts/enrich-marin-live.mjs --dry-run
 *   node scripts/enrich-marin-live.mjs --vessel 9420796
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  DETAIL_URL, parseLiveData, fetchText, sleep, THROTTLE_MS,
  destIsMarin, destMatchesPort,
} from './lib/vesselfinder.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/marin/data.json');
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

/** Estado AIS (inglés) → etiqueta en español para los estados más comunes
 *  (en marcha, atracado, fondeado, sin gobierno, maniobra restringida, restringido
 *  por calado, varado, pesca). Cualquier otro estado se devuelve tal cual (en inglés);
 *  la UI le pone un icono neutral. */
function mapStatus(navStatus) {
  const s = (navStatus || '').toLowerCase();
  if (!s) return '';
  if (s.includes('under way') || s.includes('underway') || s.includes('sailing')) return 'Navegando';
  if (s.includes('moor')) return 'Atracado';
  if (s.includes('anchor')) return 'Fondeado';
  if (s.includes('not under command')) return 'Sin gobierno';
  // "Constrained by draught" antes que "restricted": un texto tipo "restricted by
  // draught" debe caer en calado, no en maniobra (el caso de calado tiene prioridad).
  if (s.includes('constrained') || s.includes('draught')) return 'Restringido por calado';
  if (s.includes('restricted')) return 'Maniobra restringida';
  if (s.includes('aground')) return 'Varado';
  if (s.includes('fishing')) return 'Pescando';
  return navStatus; // estado desconocido: se conserva el texto crudo
}

/** Cualquier Date → ISO naive en hora de España (Europe/Madrid, con DST). */
function toSpainIso(date) {
  // hourCycle 'h23' garantiza horas 00–23 (evita el "24:00" que desplazaría el día).
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** "Jul 1, 06:00" (UTC, con o sin año/sufijo) → ISO naive en hora de España. */
function aisEtaToSpainIso(text) {
  const m = (text || '').match(/([A-Z][a-z]{2})\s+(\d{1,2}),?\s+(?:(\d{4})\s+)?(\d{1,2}):(\d{2})/);
  if (!m) return '';
  const mo = MONTHS[m[1]];
  if (!mo) return '';
  const day = +m[2], explicitYear = m[3] ? +m[3] : null, h = +m[4], mi = +m[5];
  const mk = y => new Date(Date.UTC(y, mo - 1, day, h, mi));
  let utc;
  if (explicitYear) {
    utc = mk(explicitYear);
  } else {
    const y = new Date().getUTCFullYear();
    utc = mk(y);
    if (utc.getTime() < Date.now() - 30 * 86400 * 1000) utc = mk(y + 1); // cruza fin de año
  }
  return toSpainIso(utc);
}

function applyLive(call, live, scrapedAt) {
  call.aisStatus = mapStatus(live.navStatus);
  call.aisEta = aisEtaToSpainIso(live.aisEta);
  call.aisSpeed = live.speed || 0;
  call.aisDraught = live.draught || 0;
  call.aisDestination = live.destination || '';
  call.aisAt = scrapedAt; // instante del snapshot (hora España), no "X min ago"
  // Booleanos derivados (matching en el script, no en la vista):
  call.aisAtMarin = destIsMarin(live.destination);            // destino AIS = Marín (rumbo o ya en Marín)
  call.aisToFinal = !call.aisAtMarin && destMatchesPort(live.destination, call.to); // Marín es escala intermedia
  // ¿YA ha llegado a Marín? Atracado/fondeado con destino Marín y SIN ETA pendiente:
  // un buque parado con ETA futura está en otro punto camino de Marín, no en Marín.
  call.aisArrivedMarin =
    call.aisAtMarin && (call.aisStatus === 'Atracado' || call.aisStatus === 'Fondeado') && !call.aisEta;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const vIdx = args.indexOf('--vessel');

  if (vIdx !== -1) {
    const imo = args[vIdx + 1];
    if (!imo) throw new Error('Uso: --vessel <IMO>');
    const live = parseLiveData(await fetchText(DETAIL_URL(imo)));
    console.log('Live:', JSON.stringify(live, null, 2));
    console.log('→ estado:', mapStatus(live.navStatus), '| ETA España:', aisEtaToSpainIso(live.aisEta) || '—',
      '| atMarin:', destIsMarin(live.destination));
    return;
  }

  const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  const targets = data.calls.filter(c => c.imo && c.imo !== '—');
  console.log(`Buques con IMO a consultar: ${targets.length}`);
  if (!targets.length) {
    console.warn('⚠️  Ninguna escala tiene IMO — ejecuta antes enrich-marin.mjs (rellena el imo).');
  }

  // Un buque (mismo IMO) puede tener varias escalas: se consulta una vez y se aplica a todas.
  // Se usa el `detailId` de la ficha (que el enrich estático persiste) por si no coincide
  // con el IMO; si no está, se cae al IMO (VesselFinder resuelve la ficha por IMO).
  const seen = new Map();
  const idByImo = new Map();
  for (const c of targets) if (!idByImo.has(c.imo)) idByImo.set(c.imo, c.detailId || c.imo);
  let navegando = 0;

  for (const [imo, detailId] of idByImo) {
    try {
      const liveData = parseLiveData(await fetchText(DETAIL_URL(detailId)));
      // Parse vacío (p. ej. cambio de layout) → tratar como fallo y NO aplicar:
      // no sobrescribir el AIS previo bueno con blancos (enfoque best-effort).
      if (!liveData.navStatus && !liveData.destination) {
        console.warn(`⚠️  ${imo}: ficha sin datos AIS legibles (¿cambio de layout?) — no se aplica`);
        continue;
      }
      seen.set(imo, liveData);
      const st = mapStatus(liveData.navStatus);
      if (st === 'Navegando') navegando++;
      console.log(`✓ ${imo} → ${st || '—'}${liveData.speed ? ` · ${liveData.speed} kn` : ''}${liveData.draught ? ` · calado ${liveData.draught} m` : ''}${liveData.aisEta ? ` · ETA AIS ${liveData.aisEta}` : ''}`);
    } catch (err) {
      console.warn(`⚠️  ${imo}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      await sleep(THROTTLE_MS); // cortesía SIEMPRE, también tras un fallo (no hostigar en rate-limit)
    }
  }

  const scrapedAt = toSpainIso(new Date());
  let applied = 0;
  for (const call of data.calls) {
    const l = seen.get(call.imo);
    if (l) { applyLive(call, l, scrapedAt); applied++; }
  }

  console.log(`\nResumen: ${applied} escalas con datos AIS · ${navegando} navegando · snapshot ${scrapedAt}`);

  if (isDryRun) {
    console.log('\n--- DRY RUN: data.json no modificado ---');
    return;
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log('✓ data.json actualizado con datos AIS en vivo');
}

main().catch(err => {
  console.error('Error:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
