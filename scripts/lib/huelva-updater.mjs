/** Helpers solo para scripts/update-huelva.mjs (demo Puerto de Huelva). */

export function parseDate(str) {
  if (!str || !str.trim()) return null;
  const s = str.trim();
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}T${m[4].padStart(2, "0")}:${m[5]}`;
  return null;
}

export function parseDateParts(dateStr, timeStr) {
  if (!dateStr?.trim()) return null;
  const d = dateStr.trim();
  const t = (timeStr || "00:00").trim();
  return parseDate(`${d} ${t}`);
}

export function isStillActive(etd) {
  if (!etd) return true;
  return new Date(etd).getTime() > Date.now();
}
