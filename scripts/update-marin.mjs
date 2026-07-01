#!/usr/bin/env node
/**
 * Descarga las tablas públicas de la Autoridad Portuaria de Marín y actualiza
 * src/pages/demos/marin/data.json.
 *
 * Fuentes (HTML estático, una <table class="estilo1"> por página):
 *   - https://www.apmarin.com/es/paginas/buques_esperados  → ETA (llegadas)
 *   - https://www.apmarin.com/es/paginas/buques_puerto      → ETD (aún en puerto)
 *
 * Las dos tablas se cruzan por el código de Escala (M2026…). Un buque está en
 * una lista o en la otra, nunca en ambas a la vez: la ETA se captura cuando es
 * "esperado" y la ETD cuando ya está "en puerto"; el merge con el data.json
 * anterior conserva el dato que ya no aparece en la tabla actual.
 *
 * Preserva tugService (tripulación, tiempos, remolcador) y aplica alerta dinámica.
 *
 * Uso:
 *   node scripts/update-marin.mjs
 *   node scripts/update-marin.mjs --dry-run
 *   node scripts/update-marin.mjs --print-rows
 *   node scripts/update-marin.mjs --file <esperados.html> <puerto.html>
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseMarinPage, buildCalls, buildAlertScenario } from './lib/marin-updater.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/marin/data.json');

const URL_ESPERADOS = 'https://www.apmarin.com/es/paginas/buques_esperados';
const URL_PUERTO    = 'https://www.apmarin.com/es/paginas/buques_puerto';

const SEED = {
  meta: {
    port: 'Puerto de Marín',
    source: 'apmarin.com · buques esperados + en puerto',
    date: '',
    refreshHours: 12,
  },
  calls: [],
  tugService: {
    callId: '',
    reportNumber: '004821',
    tugboat: 'AMARE MARÍN',
    powerPct: 70,
    rope: true,
    shipEngine: false,
    status: 'en_curso',
    crew: { patron: 'X. Rodríguez', mecanico: 'B. Castro', marinero: 'A. Lago' },
    times: {
      requested_at: '08:30',
      ir_at_planned: '08:45',
      ir_at_real: '08:47',
      cos_at_planned: '09:05',
      cos_at_real: '11:40',
      rc_at_planned: '09:10',
      rc_at_real: null,
      sc_at_planned: '09:40',
      sc_at_real: null,
      fr_at_planned: '09:55',
      fr_at_real: null,
    },
  },
  milestones: {},
};

async function fetchHtml(url) {
  console.log(`Descargando ${url} …`);
  const res = await fetch(url, { headers: { 'User-Agent': 'NauticOps-DemoUpdater/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar ${url}`);
  return res.text();
}

async function loadPages(args) {
  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1) {
    const esp = args[fileIdx + 1];
    const pue = args[fileIdx + 2];
    if (!esp || !pue) throw new Error('Uso: --file <esperados.html> <puerto.html>');
    console.log(`Leyendo HTML local: ${esp} · ${pue}`);
    return { esperadosHtml: readFileSync(esp, 'utf-8'), puertoHtml: readFileSync(pue, 'utf-8') };
  }
  const [esperadosHtml, puertoHtml] = await Promise.all([
    fetchHtml(URL_ESPERADOS),
    fetchHtml(URL_PUERTO),
  ]);
  return { esperadosHtml, puertoHtml };
}

function todayStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const printRows = args.includes('--print-rows');

  const { esperadosHtml, puertoHtml } = await loadPages(args);

  const esperados = parseMarinPage(esperadosHtml);
  const puerto = parseMarinPage(puertoHtml);

  if (printRows) {
    console.log(`\nEsperados (${esperados.kind}): ${esperados.rows.length} filas`);
    esperados.rows.forEach(r => console.log(`  ${r.escala} | ${r.name} | ${r.berth} | ${r.when}`));
    console.log(`\nEn puerto (${puerto.kind}): ${puerto.rows.length} filas`);
    puerto.rows.forEach(r => console.log(`  ${r.escala} | ${r.name} | ${r.berth} | ${r.when}`));
    return;
  }

  // Si cambia la estructura de las tablas (otra cabecera/orden de columnas), fallar
  // explícitamente en vez de escribir un data.json incoherente (p. ej. todo "Prevista")
  // que el workflow commitearía sin que nadie lo revise. Usa --print-rows para diagnosticar.
  if (esperados.kind !== 'eta' || puerto.kind !== 'etd') {
    throw new Error(
      `Estructura inesperada en apmarin.com (esperados=${esperados.kind}, en-puerto=${puerto.kind}; ` +
      `se esperaba eta/etd). ¿Cambió la tabla? Revisa con --print-rows.`
    );
  }

  const existing = existsSync(DATA_PATH)
    ? JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
    : SEED;

  const fallbackYear = new Date().getFullYear();
  const calls = buildCalls(esperados, puerto, existing.calls || [], fallbackYear);

  console.log(
    `✓ ${esperados.rows.length} esperados + ${puerto.rows.length} en puerto → ${calls.length} escalas`
  );

  // Guard: en momentos sin barcos, apmarin devuelve las tablas vacías. No sobre-
  // escribir un data.json bueno con 0 escalas (dejaría la demo sin barcos); se
  // conserva el snapshot anterior hasta que el puerto vuelva a listar escalas.
  if (calls.length === 0 && (existing.calls?.length || 0) > 0) {
    console.warn(
      `⚠️  El scrape no devolvió escalas (puerto sin barcos ahora mismo); se conserva el data.json anterior (${existing.calls.length} escalas).`
    );
    return;
  }

  const alert = buildAlertScenario(calls);
  if (alert) {
    const ac = calls.find(c => c.id === alert.alertId);
    console.log(`✓ Alerta de demo → ${alert.alertName} · Muelle ${ac?.berth}`);
    if (alert.affectedName) console.log(`  → Impacto ALTO en ${alert.affectedName} (mismo muelle)`);
  } else {
    console.warn('⚠️  No hay barcos en puerto — escenario de alerta no aplicado');
  }

  const base = existing.meta ? existing : SEED;
  const updated = {
    meta: {
      ...base.meta,
      port: 'Puerto de Marín',
      source: 'apmarin.com · buques esperados + en puerto',
      date: todayStr(),
      refreshHours: base.meta?.refreshHours ?? 12,
    },
    calls,
    // Sin alerta no debe quedar un callId/milestones apuntando a una escala que
    // ya no existe en `calls`: se conservan tripulación/tiempos pero se limpian
    // el vínculo y los hitos para no dejar el drawer en estado incoherente.
    tugService: alert
      ? { ...base.tugService, callId: alert.alertId }
      : { ...base.tugService, callId: '' },
    milestones: alert ? alert.milestones : {},
  };

  if (isDryRun) {
    console.log('\n--- DRY RUN: data.json no modificado ---');
    console.log(`Escalas: ${calls.length}  |  Fecha: ${updated.meta.date}`);
    calls.slice(0, 8).forEach(c =>
      console.log(`  ${c.id} | ${c.name} | ${c.status} | ETA ${c.eta || '—'} | ETD ${c.etd || '—'} | ${c.berth}`)
    );
    if (calls.length > 8) console.log(`  … y ${calls.length - 8} más`);
    return;
  }

  writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
  console.log(`✓ data.json actualizado (${updated.meta.date})`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
