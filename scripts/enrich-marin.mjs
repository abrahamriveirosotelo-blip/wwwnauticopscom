#!/usr/bin/env node
/**
 * Enriquece las escalas de la demo de Marín con datos ESTÁTICOS de buque
 * (IMO, GT, eslora, bandera, tipo, año, callsign) desde vesselfinder.com.
 *
 * Pensado para ejecutarse DESPUÉS de scripts/update-marin.mjs: este reescribe
 * data.json dejando imo='—'/gt=0/len=0; aquí se rellenan a partir del nombre
 * del buque, con matching conservador (ver scripts/lib/vesselfinder.mjs).
 *
 * Caché: src/pages/demos/marin/vessel-cache.json. Los particulares de un buque
 * son inmutables (IMO/GT/eslora/bandera) → se resuelven una vez por nombre y no
 * se vuelven a pedir; minimiza peticiones (rate-limit / ToS de VesselFinder).
 * Si el matching no es fiable, la escala se deja SIN enriquecer (degrada a '—').
 *
 * Uso:
 *   node scripts/enrich-marin.mjs
 *   node scripts/enrich-marin.mjs --dry-run
 *   node scripts/enrich-marin.mjs --force          # reintenta lo cacheado
 *   node scripts/enrich-marin.mjs --vessel "GLORIOUS"   # prueba un nombre
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  SEARCH_URL, DETAIL_URL, parseSearchResults, parseDetail,
  matchVessel, pickDetailFields, normName,
} from './lib/vesselfinder.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/marin/data.json');
const CACHE_PATH = join(__dirname, '../src/pages/demos/marin/vessel-cache.json');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const THROTTLE_MS = 1500;          // cortesía entre peticiones
const REQUEST_TIMEOUT_MS = 15000;  // aborta si VesselFinder se cuelga (CI predecible)
const UNRESOLVED_TTL_DAYS = 7;     // reintentar "sin match" estable pasada 1 semana
const ERROR_RETRY_HOURS = 6;       // reintentar fallos de red mucho antes (no en cada cron)

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'es,en' },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

const fetchDetail = async id => parseDetail(await fetchText(DETAIL_URL(id)));

/** Resuelve un buque por nombre: search → match conservador → detalle. */
async function resolveVessel(call, searchHtml = null) {
  // Reutiliza el HTML de búsqueda si se pasa (p. ej. desde --vessel) para no
  // repetir la misma petición a vesselfinder.com.
  const search = searchHtml ?? await fetchText(SEARCH_URL(call.name));
  if (!searchHtml) await sleep(THROTTLE_MS);
  const candidates = parseSearchResults(search);
  const match = await matchVessel(call, candidates, async id => {
    const d = await fetchDetail(id);
    await sleep(THROTTLE_MS);
    return d;
  });
  if (!match) {
    const n = candidates.length;
    const reason = n === 0
      ? 'sin resultados en VesselFinder'
      : `${n} resultado${n === 1 ? '' : 's'} pero ninguno aceptable (nombre/tipo comercial/IMO)`;
    return { resolved: false, reason };
  }

  // Verificar el IMO en la ficha de detalle (el id de búsqueda de 7 dígitos no
  // garantiza un IMO real). Si la ficha no se puede leer o no trae IMO → NO
  // resuelto, para no escribir ids internos de VesselFinder como si fueran IMO.
  // Si el match es 'destination-confirmed', matchVessel ya descargó la ficha y
  // verificó el IMO → evitamos una petición (y un throttle) redundantes.
  let merged = { ...match.candidate };
  if (match.confidence !== 'destination-confirmed') {
    let detail;
    try {
      detail = await fetchDetail(match.candidate.detailId);
      await sleep(THROTTLE_MS);
    } catch {
      return { resolved: false, reason: 'no se pudo verificar la ficha (IMO sin confirmar)' };
    }
    if (!detail.imo) return { resolved: false, reason: 'ficha sin IMO verificable' };
    merged = { ...merged, ...pickDetailFields(detail) };
  }

  if (!merged.imo) return { resolved: false, reason: 'IMO no verificado' };
  return {
    resolved: true,
    imo: merged.imo,
    gt: merged.gt || 0,
    len: merged.length || 0,
    beam: merged.beam || 0,
    flag: merged.flag || '',
    vesselType: merged.type || '',
    built: merged.built || 0,
    callsign: merged.callsign || '',
    destination: merged.destination || '',
    confidence: match.confidence,
    source: 'vesselfinder.com',
  };
}

function nowIso() {
  // ISO en UTC conservando la 'Z' para que new Date(checkedAt) reparse en UTC
  // (sin la Z se interpretaría como hora local y desplazaría el TTL).
  return new Date().toISOString().slice(0, 19) + 'Z';
}

/** Clave de caché/agrupación: nombre + destino normalizados (los nombres no son únicos). */
function cacheKey(call) {
  return `${normName(call.name)}::${normName(call.to)}`;
}

function applyToCall(call, e) {
  // Refleja fielmente la entrada (resuelta) de caché, también cuando un valor
  // numérico es 0; si no, data.json podría quedar desincronizado con la caché.
  call.imo = e.imo;
  call.gt = e.gt ?? 0;
  call.len = e.len ?? 0;
  call.flag = e.flag || '';
  call.vesselType = e.vesselType || '';
  call.built = e.built ?? 0;
  call.callsign = e.callsign || '';
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const vIdx = args.indexOf('--vessel');

  // Modo prueba: un solo nombre, imprime candidatos y resultado.
  if (vIdx !== -1) {
    const name = args[vIdx + 1];
    if (!name) throw new Error('Uso: --vessel "NOMBRE"');
    const html = await fetchText(SEARCH_URL(name));
    const candidates = parseSearchResults(html);
    console.log(`\nCandidatos para "${name}": ${candidates.length}`);
    candidates.forEach(c =>
      console.log(`  ${c.imo || c.detailId} | ${c.name} | ${c.type} | ${c.flag} | ${c.gt} GT | ${c.length}m`)
    );
    const r = await resolveVessel({ name, to: '—', op: '' }, html);
    console.log('\nResultado:', JSON.stringify(r, null, 2));
    return;
  }

  const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) : {};

  // Clave de caché = nombre + destino (`to`): los nombres NO son únicos, así que
  // dos buques distintos con el mismo nombre pero diferente destino se resuelven
  // por separado y no se propaga el enriquecimiento de uno al otro.
  const byKey = new Map();
  for (const call of data.calls) {
    const key = cacheKey(call);
    if (!byKey.has(key)) byKey.set(key, call);
  }

  let enriched = 0, resolvedNow = 0, unresolved = 0, fromCache = 0;
  const ttlMs = UNRESOLVED_TTL_DAYS * 86400 * 1000;
  const errorMs = ERROR_RETRY_HOURS * 3600 * 1000;

  for (const [key, call] of byKey) {
    let entry = cache[key];
    // checkedAt no parseable (NaN) → tratar como stale para que se reintente.
    const checkedMs = entry ? new Date(entry.checkedAt || 0).getTime() : 0;
    // Los fallos de red (entry.error) se reintentan mucho antes que un "sin match" estable.
    const maxAge = entry?.error ? errorMs : ttlMs;
    const stale = entry && entry.resolved === false &&
      (!Number.isFinite(checkedMs) || Date.now() - checkedMs > maxAge);

    if (!entry || (entry.resolved === false && (force || stale)) || (force && entry.resolved)) {
      try {
        const r = await resolveVessel(call);
        entry = r.resolved ? { ...r, resolvedAt: nowIso() } : { resolved: false, reason: r.reason, checkedAt: nowIso() };
        cache[key] = entry;
        if (r.resolved) { resolvedNow++; console.log(`✓ ${call.name} → IMO ${r.imo} · ${r.vesselType} · ${r.flag} · ${r.gt} GT · ${r.len}m (${r.confidence})`); }
        else { console.log(`· ${call.name} → ${r.reason}`); }
      } catch (err) {
        // Normaliza el error (puede no ser un Error con .message).
        const msg = err instanceof Error ? err.message : String(err);
        // No usar `continue`: si había una entrada cacheada previa (resuelta),
        // se re-aplica más abajo. Así un error transitorio (sobre todo en
        // --force) no descarta el enriquecimiento ya guardado en data.json.
        console.warn(`⚠️  ${call.name}: ${msg}${entry?.resolved ? ' — se conserva la caché previa' : ''}`);
        // Persistir el fallo (con checkedAt + TTL corto) para no reintentar en
        // CADA ejecución del cron si es persistente. No pisa una entrada resuelta.
        if (!entry?.resolved) {
          entry = { resolved: false, error: true, reason: `error: ${msg}`, checkedAt: nowIso() };
          cache[key] = entry;
        }
      }
    } else {
      fromCache++;
    }

    if (entry?.resolved) {
      for (const c of data.calls) if (cacheKey(c) === key) applyToCall(c, entry);
      enriched++;
    } else {
      unresolved++;
    }
  }

  console.log(`\nResumen: ${enriched} buques enriquecidos · ${resolvedNow} resueltos ahora · ${fromCache} de caché · ${unresolved} sin match`);

  if (isDryRun) {
    console.log('\n--- DRY RUN: no se escribe data.json ni cache ---');
    return;
  }
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf-8');
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log('✓ data.json y vessel-cache.json actualizados');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
