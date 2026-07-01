/** Helpers solo para scripts/update-marin.mjs (demo Puerto de Marín). */

export const ALERT_DELAY = '+3h 45min';

/* ------------------------------------------------------------------ *
 * Parsing de las tablas HTML de apmarin.com
 *  - buques_esperados → última columna ETA
 *  - buques_puerto    → última columna ETD
 * Ambas tablas tienen la misma estructura: una <table class="estilo1">
 * con 9 <td> por fila en orden fijo:
 *   0 Buque · 1 Origen · 2 Destino · 3 Escala · 4 Consignatario
 *   5 Muelle · 6 Norays · 7 Mercancía · 8 ETA|ETD
 * ------------------------------------------------------------------ */

const ENTITIES = {
  '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
  '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í', '&Oacute;': 'Ó', '&Uacute;': 'Ú',
  '&ntilde;': 'ñ', '&Ntilde;': 'Ñ', '&uuml;': 'ü', '&Uuml;': 'Ü',
  '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ',
};

function decodeEntities(str) {
  return str
    .replace(/&[a-zA-Z]+;|&#\d+;/g, m => {
      if (ENTITIES[m]) return ENTITIES[m];
      const num = m.match(/&#(\d+);/);
      return num ? String.fromCharCode(parseInt(num[1], 10)) : m;
    });
}

function cellText(td) {
  return decodeEntities(td.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

/** "ceferino nogueira, s.a." → "Ceferino Nogueira, S.A." (idempotente). */
export function titleCase(str) {
  if (!str || !str.trim()) return '—';
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).trim();
}

/** Año tomado del código de escala (M2026… → 2026); fallback al año dado. */
export function yearFromEscala(escala, fallbackYear) {
  const m = (escala || '').match(/^[A-Z](\d{4})/);
  return m ? parseInt(m[1], 10) : fallbackYear;
}

/** "25/06 20:00" + año → ISO local "2026-06-25T20:00". */
export function parseMarinDate(ddmmHHmm, year) {
  if (!ddmmHHmm) return null;
  const m = ddmmHHmm.trim().match(/^(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const [, d, mo, h, mi] = m;
  return `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${mi}`;
}

/** Normaliza el muelle para comparar (sin acentos/caso/espacios extra). */
export function normBerth(b) {
  return (b || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Extrae las filas de datos de la tabla `class="estilo1"` de una página.
 * Devuelve { kind: 'eta'|'etd', rows: [{name, from, to, escala, agent, berth, norays, op, when}] }
 */
export function parseMarinPage(html) {
  const table = html.match(/<table[^>]*class="estilo1"[\s\S]*?<\/table>/i);
  if (!table) throw new Error('No se encontró la tabla class="estilo1" en la página');

  const trs = table[0].match(/<tr[\s\S]*?<\/tr>/gi) || [];
  if (!trs.length) throw new Error('La tabla no contiene filas');

  // La cabecera es la fila con <span class="label">…</span>; su última celda dice ETA o ETD.
  const headerLabels = (trs[0].match(/<span class="label">([^<]*)<\/span>/gi) || [])
    .map(s => cellText(s));
  const lastLabel = (headerLabels[headerLabels.length - 1] || '').toUpperCase();
  const kind = lastLabel.includes('ETD') ? 'etd' : 'eta';

  const rows = [];
  for (const tr of trs) {
    if (/class="columnas"/i.test(tr) || /<span class="label">/i.test(tr)) continue; // cabecera
    const tds = (tr.match(/<td[\s\S]*?<\/td>/gi) || []).map(cellText);
    if (tds.length < 9) continue;
    const [name, from, to, escala, agent, berth, norays, op, when] = tds;
    if (!escala || !name) continue;
    rows.push({
      name: name.replace(/\.+$/, '').trim(),
      from: from || '—',
      to: to || '—',
      escala,
      agent: titleCase(agent),
      berth: berth || '—',
      norays: norays || '—',
      op: op || '—',
      when,
    });
  }

  return { kind, rows };
}

/* ------------------------------------------------------------------ *
 * Merge esperados + en puerto por código de escala, con persistencia
 * de ETA/ETD a partir del data.json anterior (un buque está en una
 * lista o en la otra, nunca en ambas en el mismo instante).
 * ------------------------------------------------------------------ */

function bumpYearIfRollover(etaIso, etdIso) {
  if (!etaIso || !etdIso) return etdIso;
  if (new Date(etdIso).getTime() >= new Date(etaIso).getTime()) return etdIso;
  // ETD anterior a ETA → cruza fin de año.
  const y = parseInt(etdIso.slice(0, 4), 10) + 1;
  return `${y}${etdIso.slice(4)}`;
}

export function buildCalls(esperados, puerto, prevCalls = [], fallbackYear) {
  const prevById = new Map(prevCalls.map(c => [c.id, c]));
  const byId = new Map();

  const ingest = (rows, kind) => {
    for (const r of rows) {
      const year = yearFromEscala(r.escala, fallbackYear);
      const when = parseMarinDate(r.when, year) || '';
      let call = byId.get(r.escala);
      if (!call) {
        call = {
          id: r.escala,
          status: 'Prevista',
          imo: '—',
          name: r.name,
          gt: 0,
          len: 0,
          berth: r.berth,
          agent: r.agent,
          op: r.op,
          eta: '',
          etd: '',
          from: r.from,
          to: r.to,
        };
        byId.set(r.escala, call);
      } else {
        // La fila de "en puerto" trae datos más actuales (muelle/norays reales).
        call.name = r.name; call.berth = r.berth; call.agent = r.agent;
        call.op = r.op; call.from = r.from; call.to = r.to;
      }
      if (kind === 'eta') call.eta = when;
      if (kind === 'etd') { call.etd = when; call.status = 'Iniciado'; }
    }
  };

  // Primero esperados (ETA), luego puerto (ETD) — puerto marca "Iniciado".
  ingest(esperados.rows, 'eta');
  ingest(puerto.rows, 'etd');

  // Campos añadidos por los scripts de enriquecimiento (no por el scrape de la AP).
  // Se conservan del JSON anterior para que NO se borren en cada run: si un paso de
  // enrich se salta o falla, la escala mantiene su último enriquecimiento conocido
  // (los scripts de enrich lo refrescan cuando sí corren). Sin esto, update-marin
  // dejaría imo/gt/dwt y todos los aisX en blanco hasta el siguiente enrich exitoso.
  const ENRICH_FIELDS = [
    'imo', 'mmsi', 'detailId', 'gt', 'dwt', 'len', 'beam', 'flag', 'vesselType', 'built', 'callsign',
    'aisStatus', 'aisEta', 'aisSpeed', 'aisDraught', 'aisDestination', 'aisAt',
    'aisAtMarin', 'aisToFinal', 'aisArrivedMarin',
    // Posición en vivo (aisstream, enrich-marin-ais.mjs): se arrastra para que un
    // buque que no emitió en la última ventana conserve su última posición conocida.
    'aisLat', 'aisLon', 'aisSog', 'aisCog', 'aisHeading', 'aisPosAt',
  ];

  // Persistencia: recupera del JSON anterior la ETA/ETD que ya no aparece
  // en la tabla actual (p. ej. un buque que pasó de "esperado" a "en puerto"),
  // y arrastra el enriquecimiento previo.
  for (const call of byId.values()) {
    const prev = prevById.get(call.id);
    if (prev) {
      if (!call.eta && prev.eta) call.eta = prev.eta;
      if (!call.etd && prev.etd) call.etd = prev.etd;
      for (const f of ENRICH_FIELDS) {
        // Conserva cualquier valor previo definido, incluidos los 0 válidos
        // (p. ej. aisSpeed 0 = atracado); los pasos de enrich lo refrescan.
        if (prev[f] != null) call[f] = prev[f];
      }
    }
    call.etd = bumpYearIfRollover(call.eta, call.etd);
  }

  const calls = [...byId.values()];
  calls.sort((a, b) => {
    const ka = a.eta || a.etd || '';
    const kb = b.eta || b.etd || '';
    return new Date(ka || 0).getTime() - new Date(kb || 0).getTime();
  });
  return calls;
}

/* ------------------------------------------------------------------ *
 * Escenario de alerta de demo: un buque "en puerto" (Iniciado) que
 * comparte muelle con otro "Prevista" → retraso + impacto en cascada.
 * ------------------------------------------------------------------ */

function opContext(op) {
  const s = (op || '').trim().toUpperCase();
  if (s.startsWith('D.') || s.startsWith('D/')) return 'descarga';
  if (s.startsWith('C.') || s.startsWith('C/')) return 'carga';
  return 'operaciones';
}

export function buildAlertScenario(calls) {
  let alertCall = null;
  let affectedCall = null;
  for (const c of calls.filter(c => c.status === 'Iniciado' && c.berth !== '—')) {
    const next = calls.find(
      x => x.status === 'Prevista' && normBerth(x.berth) === normBerth(c.berth)
    );
    if (next) { alertCall = c; affectedCall = next; break; }
  }
  if (!alertCall) alertCall = calls.find(c => c.status === 'Iniciado');
  if (!alertCall) return null;

  alertCall.status = 'Alerta';
  alertCall.delay = ALERT_DELAY;
  alertCall.alertNote =
    `Incidencia en ${opContext(alertCall.op)}. El buque no liberará el muelle ${alertCall.berth} según lo previsto.`;

  if (affectedCall) {
    affectedCall.affectedBy = alertCall.id;
    affectedCall.affectRisk = 'ALTO';
  }

  return { alertId: alertCall.id, alertName: alertCall.name, affectedName: affectedCall?.name };
}
