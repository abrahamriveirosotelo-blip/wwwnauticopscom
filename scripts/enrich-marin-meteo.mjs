/**
 * enrich-marin-meteo.mjs — añade meteo operativa al data.json de la demo de Marín.
 *
 * Fuentes oficiales (fetch SERVER-SIDE: ninguna envía CORS, no valen desde el navegador):
 *  - MeteoGalicia, estación 14005 "Porto de Marín" (en el propio puerto): viento (racha +
 *    dirección), temperatura, presión, lluvia, humedad. JSON REST.
 *  - AEMET, avisos de fenómenos adversos de Galicia (CAP ATOM): se filtran los de la zona
 *    COSTERA de Marín — Rías Baixas-Costa (713601C). El título/summary del feed ya traen
 *    nivel, fenómeno y ventana. (Ampliable a la comarca 713601 si se quisieran viento/tormentas.)
 *
 * Escribe todo en data.meta.meteo. Igual que el AIS: se corre en local y se commitea el JSON.
 * Uso: node scripts/enrich-marin-meteo.mjs [--dry-run]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "src", "pages", "demos", "marin", "data.json");
const DRY = process.argv.includes("--dry-run");

const MG_URL = "https://servizos.meteogalicia.gal/mgrss/observacion/ultimosHorariosEstacions.action?idEst=14005";
const AEMET_URL = "https://www.aemet.es/documentos_d/eltiempo/prediccion/avisos/rss/CAP_AFAC71_ATOM.xml";
const MARIN_ZONES = new Set(["713601C"]); // Rías Baixas - Costa (solo avisos costeros por ahora)

/** "2026-07-02T16:00:00" UTC → "2026-07-02T18:00" hora local de Marín (CEST, UTC+2 en verano). */
function utcToLocal(isoUtc) {
  const d = new Date(isoUtc + (isoUtc.endsWith("Z") ? "" : "Z"));
  const l = new Date(d.getTime() + 2 * 3600 * 1000); // CEST = UTC+2 (dato de verano)
  return l.toISOString().slice(0, 16);
}

/** Observación de MeteoGalicia (último instante válido). */
async function fetchObs() {
  const r = await fetch(MG_URL);
  if (!r.ok) throw new Error(`MeteoGalicia HTTP ${r.status}`);
  const j = await r.json();
  const est = j.listHorarios?.[0];
  if (!est?.listaInstantes?.length) throw new Error("MeteoGalicia sin datos");
  const inst = est.listaInstantes[est.listaInstantes.length - 1];
  const val = {};
  for (const m of inst.listaMedidas) if (m.valor > -9000) val[m.codigoParametro] = m.valor;
  const kn = ms => (ms == null ? null : Math.round(ms * 1.94384)); // m/s → nudos (uso marítimo)
  return {
    estacion: est.estacion,
    instante: utcToLocal(inst.instanteLecturaUTC),
    vientoRachaKn: kn(val.VV_RACHA_10m),
    vientoMediaKn: kn(val.VV_AVG_10m),      // puede no venir en el feed horario
    vientoDirDeg: val.DV_AVG_10m ?? null,
    tempC: val.TA_AVG_1_5m ?? val["TA_AVG_1.5m"] ?? null,
    presionHpa: val["PR_AVG_1.5m"] ?? null,
    lluviaMm: val["PP_SUM_1.5m"] ?? null,
    humedadPct: val["HR_AVG_1.5m"] ?? null,
  };
}

/** Avisos AEMET de la zona de Marín (Rías Baixas comarca + costa). */
async function fetchAvisos() {
  const r = await fetch(AEMET_URL);
  if (!r.ok) throw new Error(`AEMET HTTP ${r.status}`);
  const xml = await r.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  const avisos = [];
  for (const e of entries) {
    const href = (e.match(/href="([^"]+)"/) || [])[1] || "";
    const zona = (href.match(/AFAZ(\d+C?)[A-Z]{2}/) || [])[1]; // código de zona del nombre del CAP
    if (!zona || !MARIN_ZONES.has(zona)) continue;
    const title = ((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").trim();
    const summ = ((e.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1] || "").trim();
    const tm = title.match(/Nivel (\w+)\.\s*(.+?)\.\s*(.+)$/i);
    // "de 13:00 03-07-2026 CEST (UTC+2) a 20:59 03-07-2026 CEST"
    const wm = summ.match(/de (\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4}) CEST[\s\S]*? a (\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4}) CEST/);
    if (!tm || !wm) continue;
    const iso = (h, mi, d, mo, y) => `${y}-${mo}-${d}T${h}:${mi}`;
    avisos.push({
      nivel: tm[1].toLowerCase(),                 // amarillo | naranja | rojo
      fenomeno: tm[2].trim(),                     // Costeros | Viento | Temperaturas máximas | …
      zona: tm[3].trim(),                         // Rias Baixas | Rias Baixas - Costa
      costa: zona.endsWith("C"),
      desde: iso(wm[1], wm[2], wm[3], wm[4], wm[5]),
      hasta: iso(wm[6], wm[7], wm[8], wm[9], wm[10]),
    });
  }
  avisos.sort((a, b) => a.desde.localeCompare(b.desde));
  return avisos;
}

async function main() {
  const [obs, avisos] = await Promise.all([fetchObs(), fetchAvisos()]);
  const nowLocal = utcToLocal(new Date().toISOString());
  const meteo = { updatedAt: nowLocal, obs, avisos };

  console.log("Observación (Porto de Marín):", JSON.stringify(obs));
  console.log(`Avisos Rías Baixas (${avisos.length}):`);
  for (const a of avisos) console.log(`  ${a.nivel.padEnd(8)} ${a.fenomeno.padEnd(24)} ${a.desde} → ${a.hasta}${a.costa ? " (costa)" : ""}`);

  if (DRY) { console.log("\n--dry-run: no se escribe data.json"); return; }
  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  data.meta = data.meta || {};
  data.meta.meteo = meteo;
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + "\n");
  console.log("\n✓ data.json → meta.meteo actualizado");
}

main().catch(e => { console.error("✗", e.message); process.exit(1); });
