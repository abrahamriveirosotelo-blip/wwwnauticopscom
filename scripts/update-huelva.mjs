#!/usr/bin/env node
/**
 * Descarga el PDF de previsiones de Huelva Pilots y actualiza
 * src/pages/demos/huelva/data.json.
 * Preserva tugService (tripulación, tiempos, remolcador) y aplica alerta dinámica.
 *
 * Uso:
 *   node scripts/update-huelva.mjs
 *   node scripts/update-huelva.mjs --dry-run
 *   node scripts/update-huelva.mjs --print-rows
 *   node scripts/update-huelva.mjs --file scripts/fixtures/huelva-previsiones.pdf
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';
import {
  parseDateParts,
  isStillActive,
  buildAlertScenario,
} from './lib/huelva-updater.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/pages/demos/huelva/data.json');
const PDF_URL = 'https://intranet.huelvapilots.com/informes/previsiones';
const DEFAULT_FIXTURE = join(__dirname, 'fixtures/huelva-previsiones.pdf');

const AGENT_RE = /\b(E\.CIA|ERS|IBM|PCIA|LAM|PAM|MM|TER|BAL)\b/;

// num  E|S  [F|-]  [-]  NAME  DD/MM/YYYY  HH:MM  BAN  GT  esl  cal  MUELLE  …
const ROW_RE =
  /^(\d+)\s+([ES])\s+(?:(F|-)\s+)?(?:-\s+)?(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2})\s+(\S+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+(\S+)\s*(.*)$/;

function normalizeVesselName(name) {
  return name
    .trim()
    .replace(/\.+$/, '')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function extractAgent(tail) {
  const m = tail.match(AGENT_RE);
  return m ? m[1] : '—';
}

function extractOp(mov, subMov, tail) {
  const obs = tail.trim();
  if (/bunkering/i.test(obs)) return 'BUNKERING';
  if (subMov === 'F') return 'Fondo';
  if (mov === 'S') return 'Salida';
  if (mov === 'E') return 'Entrada';
  return mov;
}

function parseMetaDate(text) {
  const m = text.match(/actualizada a\s+(\d{2}\/\d{2}\/\d{4})/i);
  return m ? m[1] : null;
}

function parsePdfText(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const rows = [];
  let pending = null;

  for (const line of lines) {
    if (/^Página \d+ de \d+$/i.test(line)) continue;
    if (/^-- \d+ of \d+ --$/.test(line)) continue;
    if (/^CORPORACIÓN DE PRÁCTICOS/i.test(line)) continue;
    if (/^Estación de /i.test(line)) continue;
    if (/^Tel\.:/i.test(line)) continue;
    if (/^\d{5} HUELVA/i.test(line)) continue;
    if (/^Práctico Encargado:/i.test(line)) continue;
    if (/^Previsión de movimientos/i.test(line)) continue;
    if (/^A B C NOMBRE/i.test(line)) continue;

    const m = line.match(ROW_RE);
    if (m) {
      if (pending) rows.push(pending);
      const [, num, mov, subMov, name, date, time, ban, gt, len, cal, berth, tail] = m;
      pending = {
        num: parseInt(num, 10),
        mov,
        subMov: subMov || '',
        name: name.trim().replace(/\.+$/, '').trim(),
        date,
        time,
        ban,
        gt: parseFloat(gt) || 0,
        len: parseFloat(len) || 0,
        cal: parseFloat(cal) || 0,
        berth: berth || '—',
        agent: extractAgent(tail),
        op: extractOp(mov, subMov || '', tail),
        observations: tail.trim(),
      };
    } else if (pending) {
      pending.observations = [pending.observations, line].filter(Boolean).join(' ');
      if (pending.observations.length > 120) {
        pending.op = pending.observations.slice(0, 80);
      }
    }
  }
  if (pending) rows.push(pending);
  return rows;
}

function groupMovements(rows) {
  const groups = new Map();

  for (const row of rows) {
    const key = normalizeVesselName(row.name);
    if (!groups.has(key)) {
      groups.set(key, { name: row.name, entries: [], salidas: [], fondo: false });
    }
    const g = groups.get(key);
    if (row.subMov === 'F') g.fondo = true;
    if (row.mov === 'E') g.entries.push(row);
    else if (row.mov === 'S') g.salidas.push(row);
  }

  return groups;
}

function pickPrimaryEntry(entries) {
  if (!entries.length) return null;
  const sorted = [...entries].sort((a, b) => {
    const da = parseDateParts(a.date, a.time);
    const db = parseDateParts(b.date, b.time);
    return new Date(da) - new Date(db);
  });
  const future = sorted.find(e => {
    const eta = parseDateParts(e.date, e.time);
    return eta && new Date(eta).getTime() > Date.now();
  });
  return future || sorted[sorted.length - 1];
}

function pickEtd(salidas, etaIso) {
  if (!salidas.length) return '';
  const etaMs = etaIso ? new Date(etaIso).getTime() : 0;
  const sorted = [...salidas].sort((a, b) => {
    const da = parseDateParts(a.date, a.time);
    const db = parseDateParts(b.date, b.time);
    return new Date(da) - new Date(db);
  });
  const afterEta = sorted.find(s => {
    const etd = parseDateParts(s.date, s.time);
    return etd && new Date(etd).getTime() >= etaMs;
  });
  const pick = afterEta || sorted[0];
  return parseDateParts(pick.date, pick.time) || '';
}

function buildCallId(entry) {
  const [d, m, y] = entry.date.split('/');
  return `H${y}${m}${d}${String(entry.num).padStart(3, '0')}`;
}

function movementsToCalls(groups) {
  const calls = [];

  for (const g of groups.values()) {
    const entry = pickPrimaryEntry(g.entries);
    // Salidas sin entrada en el informe no son escalas de llegada — se omiten.
    if (!entry) continue;

    const eta = parseDateParts(entry.date, entry.time);
    const etd = pickEtd(g.salidas, eta);
    if (!isStillActive(etd)) continue;

    const etaMs = eta ? new Date(eta).getTime() : null;
    let status = (g.fondo || entry.subMov === 'F' || (etaMs && etaMs <= Date.now()))
      ? 'Iniciado'
      : 'Prevista';

    calls.push({
      id: buildCallId(entry),
      status,
      imo: '0000000',
      name: g.name,
      gt: entry.gt,
      len: entry.len,
      berth: entry.berth,
      agent: entry.agent,
      op: entry.op,
      eta: eta || '',
      etd: etd || '',
      from: '—',
      to: '—',
    });
  }

  calls.sort((a, b) => new Date(a.eta || 0).getTime() - new Date(b.eta || 0).getTime());
  return calls;
}

async function loadPdfBuffer(args) {
  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1) {
    const filePath = args[fileIdx + 1];
    if (!filePath) throw new Error('Uso: --file <ruta-al-pdf>');
    console.log(`Leyendo PDF local: ${filePath}`);
    return readFileSync(filePath);
  }

  console.log(`Descargando PDF desde ${PDF_URL} …`);
  const res = await fetch(PDF_URL, {
    headers: { 'User-Agent': 'NauticOps-DemoUpdater/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar el PDF`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('pdf') && !ct.includes('octet-stream')) {
    console.warn(`⚠️  Content-Type inesperado: ${ct}`);
  }
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

async function extractTextFromPdf(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const printRows = args.includes('--print-rows');

  const buffer = await loadPdfBuffer(args);
  const header = buffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    throw new Error('El fichero no parece un PDF válido');
  }

  const text = await extractTextFromPdf(buffer);
  if (!text.includes('Previsión de movimientos') && !text.includes('NOMBRE')) {
    throw new Error(
      'No se encontró la tabla de previsiones en el PDF. ¿Requiere login? Prueba --file con un PDF descargado manualmente.'
    );
  }

  const metaDateFromPdf = parseMetaDate(text);
  const rows = parsePdfText(text);

  if (printRows) {
    console.log(`\nFilas parseadas: ${rows.length}`);
    if (metaDateFromPdf) console.log(`Fecha informe: ${metaDateFromPdf}`);
    rows.forEach(r => {
      console.log(
        `  ${r.num} ${r.mov}${r.subMov ? ' ' + r.subMov : ''} | ${r.name} | ${r.date} ${r.time} | ${r.berth} | ${r.agent}`
      );
    });
    return;
  }

  const groups = groupMovements(rows);
  const calls = movementsToCalls(groups);

  console.log(`✓ ${rows.length} movimientos → ${calls.length} escalas activas/previstas`);

  const alert = buildAlertScenario(calls);
  if (alert) {
    const ac = calls.find(c => c.id === alert.alertId);
    console.log(`✓ Alerta de demo → ${alert.alertName} · Muelle ${ac?.berth}`);
    if (alert.affectedName) console.log(`  → Impacto ALTO en ${alert.affectedName} (mismo muelle)`);
  } else {
    console.warn('⚠️  No hay barcos en puerto — escenario de alerta no aplicado');
  }

  const existing = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  const now = new Date();
  const dateStr = metaDateFromPdf ||
    `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const updated = {
    meta: {
      ...existing.meta,
      source: 'huelvapilots.com · previsiones',
      date: dateStr,
    },
    calls,
    tugService: alert
      ? { ...existing.tugService, callId: alert.alertId }
      : existing.tugService,
    milestones: alert ? alert.milestones : existing.milestones,
  };

  if (isDryRun) {
    console.log('\n--- DRY RUN: data.json no modificado ---');
    console.log(`Escalas: ${calls.length}  |  Fecha: ${dateStr}`);
    calls.slice(0, 5).forEach(c =>
      console.log(`  ${c.id} | ${c.name} | ${c.status} | ETA ${c.eta} | Muelle ${c.berth}`)
    );
    if (calls.length > 5) console.log(`  … y ${calls.length - 5} más`);
    return;
  }

  writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`✓ data.json actualizado (${dateStr})`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
