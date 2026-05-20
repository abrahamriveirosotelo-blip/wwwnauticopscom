/** Helpers solo para scripts/update-huelva.mjs (demo Puerto de Huelva). */

export const ALERT_DELAY = '+4h 30min';

export function parseDate(str) {
  if (!str || !str.trim()) return null;
  const s = str.trim();
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}T${m[4].padStart(2, '0')}:${m[5]}`;
  return null;
}

export function parseDateParts(dateStr, timeStr) {
  if (!dateStr?.trim()) return null;
  const d = dateStr.trim();
  const t = (timeStr || '00:00').trim();
  return parseDate(`${d} ${t}`);
}

export function isStillActive(etd) {
  if (!etd) return true;
  return new Date(etd).getTime() > Date.now();
}

function fmtMilestoneTime(ms) {
  const d = new Date(ms);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function buildAlertScenario(calls) {
  let alertCall = null;
  let affectedCall = null;
  for (const c of calls.filter(c => c.status === 'Iniciado')) {
    if (c.berth === '—') continue;
    const next = calls.find(x => x.status === 'Prevista' && x.berth === c.berth);
    if (next) { alertCall = c; affectedCall = next; break; }
  }
  if (!alertCall) alertCall = calls.find(c => c.status === 'Iniciado');
  if (!alertCall) return null;

  const op = alertCall.op || '';
  const opCtx = op.startsWith('D/') ? 'descarga'
    : op.startsWith('C/') ? 'carga'
    : op.toLowerCase().includes('bunker') ? 'operaciones'
    : 'operaciones';

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
      { label: 'Atracado',              status: 'done',        time: fmtMilestoneTime(etaMs + 25 * 60000), by: 'Práctico (Huelva)' },
      { label: 'Inicio de operaciones', status: 'done',        time: fmtMilestoneTime(etaMs + 90 * 60000), by: `Agente: ${alertCall.agent}` },
      { label: 'Fin de operaciones',    status: 'in_progress', time: 'En curso — con incidencia',           by: null },
      { label: 'Desatracado',           status: 'pending',     time: null,                                  by: null },
    ],
  };

  return { alertId: alertCall.id, alertName: alertCall.name, affectedName: affectedCall?.name, milestones };
}
