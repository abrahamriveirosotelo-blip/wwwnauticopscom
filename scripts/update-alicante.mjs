#!/usr/bin/env node
/**
 * Descarga el CSV de la APA y actualiza src/pages/demos/alicante/data.json.
 * Preserva tugService y milestones (datos manuales de la demo).
 *
 * Uso:
 *   node scripts/update-alicante.mjs              # actualiza data.json
 *   node scripts/update-alicante.mjs --dry-run    # muestra qué cambiaría sin escribir
 *   node scripts/update-alicante.mjs --print-headers  # imprime las columnas del CSV
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/alicante/data.json');
const CSV_URL = 'https://www.puertoalicante.com/wp-content/uploads/buques/V_TC_ESCALAS.csv';

// --- Mapeo de columnas del CSV ---
// Columnas reales verificadas contra V_TC_ESCALAS.csv (mayo 2026).
// Si el script falla con "columna no encontrada", ejecuta --print-headers
// para ver los nombres actuales y actualiza este objeto.
const COL = {
  id:     ['portcallid'],
  status: ['status'],
  imo:    ['vessel.imo'],
  name:   ['vessel.name'],
  gt:     ['vessel.grossTonnage'],
  len:    ['vessel.lengthOverallMeters'],
  berth:  ['operations[0].berth'],
  agent:  ['operations[0].agent'],
  op:     ['operations[0].operationType'],
  eta:    ['timeStamps.plannedArrivalDate'],
  etd:    ['timeStamps.plannedDepartureDate'],
  from:   ['voyages.previousPort'],
  to:     ['voyages.nextPort'],
};

// --- Helpers ---

function parseDate(str) {
  if (!str || !str.trim()) return null;
  const s = str.trim();
  // YYYY-MM-DD HH:MM:SS  (formato del CSV de la APA)
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4].padStart(2, '0')}:${m[5]}`;
  // DD/MM/YYYY HH:MM  (fallback por si cambia el formato)
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}T${m[4].padStart(2, '0')}:${m[5]}`;
  return null;
}

function isStillActive(etd) {
  if (!etd) return true;
  return new Date(etd).getTime() > Date.now();
}

function resolveCol(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.indexOf(c.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function parseCsv(text) {
  // Eliminar BOM si existe
  const clean = text.replace(/^﻿/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) throw new Error('CSV vacío');

  // Detectar separador: si la primera línea tiene más ";" que "," usamos ";"
  const sep = (lines[0].split(';').length > lines[0].split(',').length) ? ';' : ',';

  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line =>
    line.split(sep).reduce((obj, val, i) => {
      obj[headers[i]] = val.trim().replace(/^"|"$/g, '');
      return obj;
    }, {})
  );
  return { headers, rows };
}

function getVal(row, colName) {
  return colName ? (row[colName] ?? '') : '';
}

function fmtMilestoneTime(ms) {
  const d = new Date(ms);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// --- Escenario de alerta dinámico ---
// Cada vez que se actualiza el JSON, elige el mejor barco "en puerto" para simular
// una incidencia real: preferiblemente uno que comparta muelle con otro barco previsto
// (así se puede mostrar el impacto en cascada durante la demo).
// No depende de IDs fijos: siempre funciona con los barcos que haya en el CSV.
const ALERT_DELAY = '+4h 30min';

function buildAlertScenario(calls) {
  // Buscar par: Iniciado con muelle compartido por un Prevista (cascada de impacto)
  let alertCall = null;
  let affectedCall = null;
  for (const c of calls.filter(c => c.status === 'Iniciado')) {
    if (c.berth === '—') continue;
    const next = calls.find(x => x.status === 'Prevista' && x.berth === c.berth);
    if (next) { alertCall = c; affectedCall = next; break; }
  }
  // Fallback: primer Iniciado sin cascada
  if (!alertCall) alertCall = calls.find(c => c.status === 'Iniciado');
  if (!alertCall) return null;

  const op = alertCall.op || '';
  const opCtx = op.startsWith('D/') ? 'descarga' : op.startsWith('C/') ? 'carga' : 'operaciones';

  alertCall.status = 'Alerta';
  alertCall.delay = ALERT_DELAY;
  alertCall.alertNote = `Incidencia en ${opCtx}. El buque no liberará el Muelle ${alertCall.berth} según lo previsto.`;

  if (affectedCall) {
    affectedCall.affectedBy = alertCall.id;
    affectedCall.affectRisk = 'ALTO';
  }

  const etaMs = new Date(alertCall.eta).getTime();
  const milestones = {
    [alertCall.id]: [
      { label: 'Atracado',              status: 'done',        time: fmtMilestoneTime(etaMs + 25 * 60000), by: 'Práctico (APA)' },
      { label: 'Inicio de operaciones', status: 'done',        time: fmtMilestoneTime(etaMs + 90 * 60000), by: `Agente: ${alertCall.agent}` },
      { label: 'Fin de operaciones',    status: 'in_progress', time: 'En curso — con incidencia',           by: null },
      { label: 'Desatracado',           status: 'pending',     time: null,                                  by: null },
    ],
  };

  return { alertId: alertCall.id, alertName: alertCall.name, affectedName: affectedCall?.name, milestones };
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const printHeaders = args.includes('--print-headers');

  console.log(`Descargando CSV desde ${CSV_URL} …`);
  const res = await fetch(CSV_URL, {
    headers: { 'User-Agent': 'NauticOps-DemoUpdater/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar el CSV`);

  // Intentar decodificar como latin-1 si el CSV viene en ese encoding
  const buf = await res.arrayBuffer();
  let text;
  try {
    text = new TextDecoder('utf-8').decode(buf);
    // Heurística: si hay muchos ? donde deberían ir tildes, reintentar con latin-1
    if ((text.match(/\?/g) || []).length > 10) {
      text = new TextDecoder('iso-8859-1').decode(buf);
    }
  } catch {
    text = new TextDecoder('iso-8859-1').decode(buf);
  }

  const { headers, rows } = parseCsv(text);

  if (printHeaders) {
    console.log('\nColumnas detectadas en el CSV:');
    headers.forEach((h, i) => console.log(`  [${i}] ${h}`));
    console.log('\nPrimera fila de datos:');
    const first = rows[0] || {};
    headers.forEach(h => console.log(`  ${h}: ${first[h]}`));
    return;
  }

  // Resolver nombres de columna
  const resolved = {};
  const missing = [];
  for (const [key, candidates] of Object.entries(COL)) {
    const col = resolveCol(headers, candidates);
    if (col) {
      resolved[key] = col;
    } else {
      missing.push(key);
    }
  }

  if (missing.length) {
    console.warn(`\n⚠️  Columnas no encontradas: ${missing.join(', ')}`);
    console.warn('   Ejecuta --print-headers para ver los nombres reales del CSV');
    console.warn('   y actualiza el objeto COL en scripts/update-alicante.mjs\n');
    // Continuar solo si quedan los campos mínimos
    const required = ['id', 'name', 'eta'];
    const stillMissing = required.filter(k => missing.includes(k));
    if (stillMissing.length) {
      throw new Error(`Campos obligatorios no resueltos: ${stillMissing.join(', ')}`);
    }
  }

  // Construir calls
  const calls = [];
  for (const row of rows) {
    const id = getVal(row, resolved.id);
    if (!id) continue;

    const eta = parseDate(getVal(row, resolved.eta));
    const etd = parseDate(getVal(row, resolved.etd));
    if (!isStillActive(etd)) continue; // escala ya finalizada

    // Derivar status de las fechas, no del CSV.
    // El portal de la APA tiene lag frecuente actualizando el status:
    // un barco puede llevar horas en puerto y seguir marcado como "Prevista".
    // ETA pasado + ETD futuro = en puerto = Iniciado.
    const etaMs = eta ? new Date(eta).getTime() : null;
    const status = (etaMs && etaMs <= Date.now()) ? 'Iniciado' : 'Prevista';

    // GT y eslora: el CSV usa coma como decimal en algunos campos
    const gt  = parseFloat(getVal(row, resolved.gt).replace(',', '.'))  || 0;
    const len = parseFloat(getVal(row, resolved.len).replace(',', '.')) || 0;

    calls.push({
      id,
      status,
      imo:   getVal(row, resolved.imo)   || '0000000',
      name:  getVal(row, resolved.name).trim() || '—',
      gt:    isNaN(gt)  ? 0 : gt,
      len:   isNaN(len) ? 0 : len,
      berth: getVal(row, resolved.berth) || '—',
      agent: getVal(row, resolved.agent) || '—',
      op:    getVal(row, resolved.op)    || '—',
      eta:   eta || '',
      etd:   etd || '',
      from:  getVal(row, resolved.from).trim()  || '—',
      to:    getVal(row, resolved.to).trim()    || '—',
    });
  }

  // Ordenar por ETA
  calls.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());

  console.log(`✓ ${calls.length} escalas activas/previstas encontradas`);

  // Escenario de alerta dinámico (modifica calls[] en el lugar)
  const alert = buildAlertScenario(calls);
  if (alert) {
    const ac = calls.find(c => c.id === alert.alertId);
    console.log(`✓ Alerta de demo → ${alert.alertName} · Muelle ${ac?.berth}`);
    if (alert.affectedName) console.log(`  → Impacto ALTO en ${alert.affectedName} (mismo muelle)`);
  } else {
    console.warn('⚠️  No hay barcos en puerto — escenario de alerta no aplicado');
  }

  // Leer data.json actual para preservar los datos manuales del tugService (tripulación, tiempos)
  const existing = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const updated = {
    meta: { ...existing.meta, date: dateStr },
    calls,
    // callId apunta siempre al barco elegido para la alerta; el resto del tugService es manual
    tugService: alert
      ? { ...existing.tugService, callId: alert.alertId }
      : existing.tugService,
    // Hitos generados dinámicamente para el barco en alerta
    milestones: alert ? alert.milestones : existing.milestones,
  };

  const json = JSON.stringify(updated, null, 2);

  if (isDryRun) {
    console.log('\n--- DRY RUN: data.json no modificado ---');
    console.log(`Escalas: ${calls.length}  |  Fecha: ${dateStr}`);
    calls.slice(0, 3).forEach(c =>
      console.log(`  ${c.id} | ${c.name} | ${c.status} | ETA ${c.eta} | Muelle ${c.berth}`)
    );
    if (calls.length > 3) console.log(`  … y ${calls.length - 3} más`);
    return;
  }

  writeFileSync(DATA_PATH, json, 'utf-8');
  console.log(`✓ data.json actualizado (${dateStr})`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
