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
// Si el script falla con "columna no encontrada", ejecuta --print-headers
// para ver los nombres reales y actualiza este objeto.
const COL = {
  id:    ['ID_ESCALA', 'ESCALA', 'ID_ESCALA_GEN'],
  imo:   ['IMO', 'N_IMO', 'NUM_IMO'],
  name:  ['NOMBRE_BUQUE', 'BUQUE', 'NOMBRE', 'NOM_BUQUE'],
  gt:    ['GT', 'ARQUEO_BRUTO', 'ARQUEO', 'TRB'],
  len:   ['ESLORA', 'LOA', 'ESLORA_M', 'ESLORA_PP'],
  berth: ['MUELLE', 'ATRAQUE', 'COD_MUELLE', 'NOMBRE_MUELLE', 'DESC_MUELLE'],
  agent: ['CONSIGNATARIO', 'AGENTE', 'CONSIG', 'NOM_CONSIG'],
  op:    ['TIPO_OPERACION', 'OPERACION', 'TIPO_OP', 'DESC_OPERACION', 'OP'],
  eta:   ['ETA', 'FECHA_ENTRADA', 'F_ENTRADA', 'F_ETA', 'FECHA_ETA'],
  etd:   ['ETD', 'FECHA_SALIDA', 'F_SALIDA', 'F_ETD', 'FECHA_ETD'],
  from:  ['PROCEDENCIA', 'PUERTO_ORIGEN', 'ORIGEN', 'PROC'],
  to:    ['DESTINO', 'PUERTO_DESTINO', 'DEST'],
};

// --- Helpers ---

function parseDate(str) {
  if (!str || !str.trim()) return null;
  const s = str.trim();
  // DD/MM/YYYY HH:MM  o  DD/MM/YYYY H:MM
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}T${m[4].padStart(2, '0')}:${m[5]}`;
  // YYYY-MM-DD HH:MM
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4].padStart(2, '0')}:${m[5]}`;
  return null;
}

function determineStatus(eta, etd) {
  const now = Date.now();
  const etaMs = eta ? new Date(eta).getTime() : null;
  const etdMs = etd ? new Date(etd).getTime() : null;
  if (etdMs && etdMs < now) return null; // ya salió — excluir
  if (etaMs && etaMs <= now) return 'Iniciado';
  return 'Prevista';
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
  const lines = text.split(/\r?\n/).filter(l => l.trim());
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
    const eta = parseDate(getVal(row, resolved.eta));
    const etd = parseDate(getVal(row, resolved.etd));
    const status = determineStatus(eta, etd);
    if (!status) continue; // escala ya terminada

    const id = getVal(row, resolved.id);
    if (!id) continue;

    const gt = parseFloat(getVal(row, resolved.gt)) || 0;
    const len = parseFloat(getVal(row, resolved.len)) || 0;

    calls.push({
      id,
      status,
      imo:   getVal(row, resolved.imo)   || '0000000',
      name:  getVal(row, resolved.name)  || '—',
      gt:    isNaN(gt) ? 0 : gt,
      len:   isNaN(len) ? 0 : len,
      berth: getVal(row, resolved.berth) || '—',
      agent: getVal(row, resolved.agent) || '—',
      op:    getVal(row, resolved.op)    || '—',
      eta:   eta || '',
      etd:   etd || '',
      from:  getVal(row, resolved.from)  || '—',
      to:    getVal(row, resolved.to)    || '—',
    });
  }

  // Ordenar por ETA
  calls.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());

  console.log(`✓ ${calls.length} escalas activas/previstas encontradas`);

  // Leer data.json actual para preservar campos manuales
  const existing = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const updated = {
    meta: {
      ...existing.meta,
      date: dateStr,
    },
    calls,
    // Preservar datos manuales de la demo
    tugService: existing.tugService,
    milestones: existing.milestones,
  };

  const json = JSON.stringify(updated, null, 2);

  if (isDryRun) {
    console.log('\n--- DRY RUN: data.json no modificado ---');
    console.log(`Escalas: ${calls.length}`);
    console.log(`Fecha meta: ${dateStr}`);
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
