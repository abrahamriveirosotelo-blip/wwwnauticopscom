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
 * UI necesita: `aisAtMarin` (el destino AIS es Marín, por token) y `aisToFinal`
 * (el destino AIS coincide con el `to` de la AP → Marín es escala intermedia).
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

/** Estado AIS (inglés) → etiqueta en español. Cubre todos los estados AIS estándar. */
function mapStatus(navStatus) {
  const s = (navStatus || '').toLowerCase();
  if (!s) return '';
  if (s.includes('under way') || s.includes('underway') || s.includes('sailing')) return 'Navegando';
  if (s.includes('moor')) return 'Atracado';
  if (s.includes('anchor')) return 'Fondeado';
  if (s.includes('not under command')) return 'Sin gobierno';
  if (s.includes('restricted')) return 'Maniobra restringida';
  if (s.includes('constrained') || s.includes('draught')) return 'Restringido por calado';
  if (s.includes('aground')) return 'Varado';
  if (s.includes('fishing')) return 'Pescando';
  return navStatus; // estado desconocido: se conserva el texto crudo
}

/** Cualquier Date → ISO naive en hora de España (Europe/Madrid, con DST). */
function toSpainIso(date) {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
  const hh = p.hour === '24' ? '00' : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hh}:${p.minute}`;
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
  call.aisAtMarin = destIsMarin(live.destination);            // el AIS lo sitúa en/hacia Marín
  call.aisToFinal = !call.aisAtMarin && destMatchesPort(live.destination, call.to); // Marín es escala intermedia
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
  const seen = new Map();
  let navegando = 0;

  for (const imo of [...new Set(targets.map(c => c.imo))]) {
    try {
      const liveData = parseLiveData(await fetchText(DETAIL_URL(imo)));
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
