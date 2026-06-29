#!/usr/bin/env node
/**
 * Enriquece las escalas de Marín con datos AIS EN VIVO de vesselfinder.com:
 * estado de navegación (atracado/navegando), velocidad y ETA reportada por AIS.
 *
 * A diferencia de enrich-marin.mjs (datos estáticos cacheables), estos datos son
 * DINÁMICOS y NO se cachean: se vuelven a pedir en cada ejecución, una petición
 * por buque ya identificado con IMO (no hace falta búsqueda). Pensado para
 * ejecutarse DESPUÉS de enrich-marin.mjs (que es quien rellena el `imo`).
 *
 * La ETA del AIS se publica en UTC; aquí se convierte a hora de España para que
 * sea comparable con la ETA de la Autoridad Portuaria (que ya está en local).
 * Solo los buques en navegación traen ETA/velocidad; los atracados no.
 *
 * Uso:
 *   node scripts/enrich-marin-live.mjs
 *   node scripts/enrich-marin-live.mjs --dry-run
 *   node scripts/enrich-marin-live.mjs --vessel 9420796
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DETAIL_URL, parseLiveData } from './lib/vesselfinder.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/marin/data.json');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const THROTTLE_MS = 1500;
const REQUEST_TIMEOUT_MS = 15000;
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Estado AIS en inglés → etiqueta corta en español. */
function mapStatus(navStatus) {
  const s = (navStatus || '').toLowerCase();
  if (s.includes('under way') || s.includes('underway')) return 'Navegando';
  if (s.includes('moor')) return 'Atracado';
  if (s.includes('anchor')) return 'Fondeado';
  return navStatus || '';
}

/** "Jul 1, 06:00" (UTC) → ISO naive en hora de España, comparable con la ETA de la AP. */
function aisEtaToSpainIso(text) {
  const m = (text || '').match(/^([A-Z][a-z]{2})\s+(\d{1,2}),\s*(\d{1,2}):(\d{2})$/);
  if (!m) return '';
  const mo = MONTHS[m[1]];
  if (!mo) return '';
  const day = +m[2], h = +m[3], mi = +m[4];
  const year = new Date().getUTCFullYear();
  const mk = y => new Date(Date.UTC(y, mo - 1, day, h, mi));
  let utc = mk(year);
  // Si cae muy en el pasado, cruza fin de año (Dic → Ene).
  if (utc.getTime() < Date.now() - 30 * 86400 * 1000) utc = mk(year + 1);
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(utc).reduce((a, x) => (a[x.type] = x.value, a), {});
  const hh = p.hour === '24' ? '00' : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hh}:${p.minute}`;
}

function applyLive(call, live) {
  call.aisStatus = mapStatus(live.navStatus);
  call.aisEta = aisEtaToSpainIso(live.aisEta);
  call.aisSpeed = live.speed || 0;
  call.aisDraught = live.draught || 0;
  call.aisDestination = live.destination || '';
  call.aisAt = live.positionReceived || '';
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
    console.log('→ estado:', mapStatus(live.navStatus), '| ETA España:', aisEtaToSpainIso(live.aisEta) || '—');
    return;
  }

  const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  const targets = data.calls.filter(c => c.imo && c.imo !== '—');
  console.log(`Buques con IMO a consultar: ${targets.length}`);

  // Un buque (mismo IMO) puede tener varias escalas: se consulta una vez y se aplica a todas.
  const seen = new Map();
  let live = 0, navegando = 0;

  for (const imo of [...new Set(targets.map(c => c.imo))]) {
    try {
      const data_ = parseLiveData(await fetchText(DETAIL_URL(imo)));
      await sleep(THROTTLE_MS);
      seen.set(imo, data_);
      const st = mapStatus(data_.navStatus);
      if (st === 'Navegando') navegando++;
      console.log(`✓ ${imo} → ${st || '—'}${data_.speed ? ` · ${data_.speed} kn` : ''}${data_.aisEta ? ` · ETA AIS ${data_.aisEta}` : ''} (${data_.positionReceived || 'sin posición'})`);
    } catch (err) {
      console.warn(`⚠️  ${imo}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  for (const call of data.calls) {
    const l = seen.get(call.imo);
    if (l) { applyLive(call, l); live++; }
  }

  console.log(`\nResumen: ${live} escalas con datos AIS · ${navegando} navegando`);

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
