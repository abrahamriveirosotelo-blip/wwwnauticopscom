/**
 * Helpers para enriquecer escalas con datos estáticos de buque desde
 * vesselfinder.com (solo HTML público: IMO, GT, eslora, bandera, tipo, año).
 *
 * Pure functions (parse + match); el fetch/throttle/caché vive en
 * scripts/enrich-marin.mjs. Matching CONSERVADOR: solo se acepta un buque
 * cuando hay un único candidato de tipo comercial o el destino lo confirma;
 * ante la duda se deja sin enriquecer (la demo degrada a '—').
 */

export const SEARCH_URL = name =>
  `https://www.vesselfinder.com/vessels?name=${encodeURIComponent(name)}`;
export const DETAIL_URL = id => `https://www.vesselfinder.com/vessels/details/${id}`;

// Tipos que consideramos buque mercante (los que escalan en Marín).
const COMMERCIAL_TYPE =
  /bulk carrier|general cargo|deck cargo|container|cargo|vehicles? carrier|ro-?ro|reefer|refrigerated|tanker|chemical|lpg|lng|cement|wood ?chip|self.?discharg/i;
// Tipos que descartamos de plano (mismo nombre, otro barco).
const NONCOMMERCIAL_TYPE =
  /pleasure|sailing|yacht|tug|fishing|pilot|dredg|unknown|high speed|dive|research|law enforce|search and rescue|buoy|tender|supply|passenger|ferry|sar\b/i;

const ENTITIES = {
  '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ',
  '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
  '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í', '&Oacute;': 'Ó', '&Uacute;': 'Ú',
  '&ntilde;': 'ñ', '&Ntilde;': 'Ñ', '&uuml;': 'ü', '&ouml;': 'ö', '&auml;': 'ä',
};

function decodeEntities(str) {
  return str.replace(/&#x([0-9a-fA-F]+);|&#(\d+);|&[a-zA-Z]+;/g, m => {
    if (ENTITIES[m] !== undefined) return ENTITIES[m];
    const hex = m.match(/&#x([0-9a-fA-F]+);/);
    if (hex) return String.fromCharCode(parseInt(hex[1], 16));
    const dec = m.match(/&#(\d+);/);
    if (dec) return String.fromCharCode(parseInt(dec[1], 10));
    return m;
  });
}

const clean = s => decodeEntities((s || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const toInt = s => {
  const n = parseInt(String(s).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};

/** Normaliza un nombre de buque para comparar (mayúsculas, sin puntos/acentos). */
export function normName(s) {
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

/** ¿Es un tipo de buque mercante (candidato válido para una escala de Marín)? */
export function isCommercialType(type) {
  if (!type) return false;
  if (NONCOMMERCIAL_TYPE.test(type)) return false;
  return COMMERCIAL_TYPE.test(type);
}

/**
 * Parsea la tabla de resultados de la búsqueda por nombre.
 * Cada fila: id de ficha (IMO si son 7 dígitos), nombre, tipo, bandera,
 * año, GT, DWT y eslora/manga (columna "200 / 32").
 */
export function parseSearchResults(html) {
  const table = html.match(/<table[^>]*class="results"[\s\S]*?<\/table>/i);
  if (!table) return [];
  const rows = table[0].match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const out = [];
  for (const r of rows) {
    const a = r.match(/href="\/vessels\/details\/([A-Za-z0-9]+)"/i);
    if (!a) continue;
    const detailId = a[1];
    const name = clean((r.match(/<div class="slna">([\s\S]*?)<\/div>/i) || [])[1]);
    const type = clean((r.match(/<div class="slty">([\s\S]*?)<\/div>/i) || [])[1]);
    const flag = clean((r.match(/flag-icon[^>]*title="([^"]*)"/i) || [])[1]);
    const flagCode = (r.match(/flags\/4x3\/([a-z]{2})\.svg/i) || [])[1] || '';
    const cells = [...r.matchAll(/<td class="v[3-6][^"]*">([\s\S]*?)<\/td>/gi)].map(m => clean(m[1]));
    const [built, gt, dwt, size] = cells;
    const sizeParts = (size || '').split('/').map(x => toInt(x));
    out.push({
      detailId,
      imo: /^\d{7}$/.test(detailId) ? detailId : null,
      name,
      type,
      flag,
      flagCode,
      built: toInt(built),
      gt: toInt(gt),
      dwt: toInt(dwt),
      length: sizeParts[0] || 0,
      beam: sizeParts[1] || 0,
    });
  }
  return out;
}

/** Parsea la ficha de detalle: IMO, bandera, callsign, GT, LOA, año, destino, tipo. */
export function parseDetail(html) {
  const pairs = {};
  const re =
    /<td class="(?:tpc1|n3)">([^<]+?)\s*(?:<small>[^<]*<\/small>\s*)?<\/td>\s*<td class="(?:tpc2|v3[^"]*)">([^<]*)<\/td>/gi;
  let m;
  while ((m = re.exec(html))) pairs[clean(m[1])] = clean(m[2]);

  // El destino usa otro marcado (vilabel + valor en el siguiente bloque).
  const dest =
    (html.match(/Destination<\/[^>]+>\s*<[^>]+>([^<]{2,60})</i) || [])[1] ||
    (html.match(/"vilabel">Destination[\s\S]{0,40}?>([^<]{2,60})</i) || [])[1] ||
    '';

  const imo = pairs['IMO number'];
  return {
    imo: imo && /^\d{7}$/.test(imo) ? imo : null,
    name: pairs['Vessel Name'] || '',
    flag: pairs['AIS Flag'] || pairs['Flag'] || '',
    callsign: pairs['Callsign'] || '',
    gt: toInt(pairs['Gross Tonnage']),
    loa: parseFloat(pairs['Length Overall']) || 0,
    built: toInt(pairs['Year of Build']),
    type: pairs['AIS Type'] || pairs['Ship type'] || '',
    destination: clean(dest),
  };
}

/** ¿El destino de VesselFinder confirma esta escala (entra a Marín o sale hacia `to`)? */
export function destinationConfirms(vfDestination, call) {
  const d = normName(vfDestination);
  if (!d) return false;
  if (d.includes('MARIN')) return true; // entrante
  const to = normName(call.to);
  if (to && to !== '—' && d.split(' ').some(tok => tok.length > 3 && to.includes(tok))) return true;
  return false;
}

/**
 * Elige conservadoramente el buque correcto entre los candidatos de búsqueda.
 * Devuelve { candidate, confidence } o null si no hay match fiable.
 *
 * @param call            escala de Marín ({name, to, op, ...})
 * @param candidates      resultado de parseSearchResults
 * @param fetchDetail     async (detailId) => parseDetail(...)  (para confirmar destino)
 */
export async function matchVessel(call, candidates, fetchDetail) {
  const wanted = normName(call.name);
  // 1) nombre exacto (normalizado) + tipo comercial + con IMO.
  const viable = candidates.filter(
    c => c.imo && normName(c.name) === wanted && isCommercialType(c.type)
  );
  if (viable.length === 0) return null;
  if (viable.length === 1) return { candidate: viable[0], confidence: 'single-commercial' };

  // 2) varios candidatos comerciales con el mismo nombre → desambiguar por destino.
  for (const c of viable) {
    let detail = null;
    try { detail = await fetchDetail(c.detailId); } catch { /* sigue */ }
    // Conservador: exige IMO verificado en la ficha (el id de búsqueda de 7
    // dígitos no garantiza un IMO real) Y un destino que confirme la escala.
    if (detail && detail.imo && destinationConfirms(detail.destination, call)) {
      return { candidate: { ...c, ...pickDetailFields(detail) }, confidence: 'destination-confirmed' };
    }
  }
  // 3) ambiguo y sin confirmación → no enriquecer (conservador).
  return null;
}

/** Combina los campos más precisos de la ficha sobre los de la búsqueda. */
export function pickDetailFields(detail) {
  const out = {};
  if (detail.imo) out.imo = detail.imo;
  if (detail.gt) out.gt = detail.gt;
  if (detail.loa) out.length = Math.round(detail.loa);
  if (detail.flag) out.flag = detail.flag;
  if (detail.callsign) out.callsign = detail.callsign;
  if (detail.built) out.built = detail.built;
  // El tipo de la búsqueda ("Bulk Carrier") es más específico que el AIS Type
  // de la ficha ("Cargo ship") → no se sobrescribe aquí.
  if (detail.destination) out.destination = detail.destination;
  return out;
}
