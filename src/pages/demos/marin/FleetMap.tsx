import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Mapa global de la flota: pinta la posición AIS en vivo (aisstream) de cada buque
 * con posición conocida, más el puerto de Marín. Cinemática (lat/lon/rumbo/velocidad)
 * viene de enrich-marin-ais.mjs; los buques sin posición no se pintan. Clic en un
 * buque → onSelect(call) (mismo drawer que la tabla).
 *
 * Leaflet a pelo (BSD-2-Clause), sin react-leaflet, para no arrastrar su licencia
 * Hippocratic-2.1. */

// Puerto de Marín (Ría de Pontevedra).
const MARIN = { lat: 42.4053, lon: -8.7020, label: "Puerto de Marín" };

const C = {
  navy: "#0A1F3D", cyan: "#079FE6", success: "#00C896",
  warning: "#F59E0B", gray: "#64748B", white: "#FFFFFF",
};

const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/** Color del marcador según el estado AIS (o gris si desconocido). */
function statusColor(aisStatus) {
  const s = (aisStatus || "").toLowerCase();
  if (s.includes("naveg")) return C.cyan;      // en marcha
  if (s.includes("atrac")) return C.success;   // atracado
  if (s.includes("fonde")) return C.warning;   // fondeado
  return C.gray;
}

/** Icono de buque: flecha orientada al rumbo (heading/COG) o círculo si no hay rumbo. */
function vesselIcon(deg, color) {
  const html = deg == null
    ? `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid ${C.white};box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></div>`
    : `<svg width="26" height="26" viewBox="0 0 26 26" style="transform:rotate(${deg}deg);filter:drop-shadow(0 1px 1px rgba(0,0,0,0.35))">
         <path d="M13 2 L20 22 L13 17 L6 22 Z" fill="${color}" stroke="${C.white}" stroke-width="1.5" stroke-linejoin="round"/>
       </svg>`;
  return L.divIcon({ html, className: "", iconSize: [26, 26], iconAnchor: [13, 13] });
}

/** Icono del puerto de Marín. */
const marinIcon = L.divIcon({
  html: `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:${C.navy};color:${C.white};font-size:14px;border:2px solid ${C.white};box-shadow:0 1px 3px rgba(0,0,0,0.4)">⚓</div>`,
  className: "", iconSize: [26, 26], iconAnchor: [13, 13],
});

/** HTML del tooltip de un buque (Leaflet acepta strings en bindTooltip). */
function vesselTooltip(v, fmt, clickable) {
  const rows = [
    `<div style="font-weight:800;color:${C.navy}">${esc(v.name)}</div>`,
    `<div style="font-size:11px;color:${C.gray};margin-top:2px">${esc(v.aisStatus || "—")}` +
      `${v.aisSog != null ? ` · ${v.aisSog} kn` : ""}${v.aisCog != null ? ` · rumbo ${Math.round(v.aisCog)}°` : ""}</div>`,
  ];
  if (v.aisDestination) rows.push(`<div style="font-size:11px;color:${C.gray}">→ ${esc(v.aisDestination)}</div>`);
  if (v.aisPosAt) rows.push(`<div style="font-size:10px;color:${C.gray};margin-top:2px">posición: ${esc(fmt ? fmt(v.aisPosAt) : v.aisPosAt)}</div>`);
  if (clickable) rows.push(`<div style="font-size:10px;color:${C.cyan};font-weight:700;margin-top:3px">clic para ver la escala →</div>`);
  return rows.join("");
}

export default function FleetMap({ calls, fmt, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  // Un buque puede tener varias escalas: dedupe por MMSI (o nombre) quedándonos con
  // la que tenga posición. Solo se pintan los que tienen lat/lon.
  const vessels = useMemo(() => {
    const byKey = new Map();
    for (const c of calls) {
      if (c.aisLat == null || c.aisLon == null) continue;
      const key = c.mmsi || c.name;
      if (!byKey.has(key)) byKey.set(key, c);
    }
    return [...byKey.values()];
  }, [calls]);

  // Inicializa el mapa una vez.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([MARIN.lat, MARIN.lon], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // (Re)pinta marcadores cuando cambian los buques.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);

    L.marker([MARIN.lat, MARIN.lon], { icon: marinIcon })
      .bindTooltip(esc(MARIN.label), { direction: "top", offset: [0, -12] })
      .addTo(layer);

    const pts = [[MARIN.lat, MARIN.lon]];
    for (const v of vessels) {
      const deg = v.aisHeading ?? v.aisCog ?? null;
      const m = L.marker([v.aisLat, v.aisLon], { icon: vesselIcon(deg, statusColor(v.aisStatus)) })
        .bindTooltip(vesselTooltip(v, fmt, !!onSelect), { direction: "top", offset: [0, -12] })
        .addTo(layer);
      // Cierra el tooltip al clicar para que no quede flotando sobre el drawer.
      if (onSelect) m.on("click", () => { m.closeTooltip(); onSelect(v); });
      pts.push([v.aisLat, v.aisLon]);
    }

    if (pts.length <= 1) map.setView([MARIN.lat, MARIN.lon], 8);
    else map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 11 });

    return () => { layer.remove(); };
  }, [vessels, fmt, onSelect]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, letterSpacing: "0.02em" }}>
          POSICIÓN DE LA FLOTA · AIS EN VIVO
        </div>
        <div style={{ fontSize: 11, color: C.gray }}>
          {vessels.length
            ? `${vessels.length} buque${vessels.length === 1 ? "" : "s"} con posición`
            : "sin posiciones AIS todavía"}
        </div>
      </div>

      {/* isolation:isolate crea un contexto de apilamiento propio para el mapa, así los
          z-index internos de Leaflet (marcadores 600, tooltips 650, popups 700) no se
          superponen al drawer de la escala (que está por encima con su propio z-index). */}
      <div style={{ position: "relative", isolation: "isolate", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gray}22` }}>
        <div ref={containerRef} style={{ height: 440, width: "100%" }} />

        {!vessels.length && (
          <div style={{
            position: "absolute", left: 12, bottom: 12, zIndex: 500,
            background: "rgba(255,255,255,0.94)", border: `1px solid ${C.gray}33`,
            borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.gray, maxWidth: 320,
          }}>
            Aún no hay posiciones AIS en el snapshot. Se poblarán cuando ejecutes
            <b> enrich-marin-ais</b> en local con la clave de aisstream.
          </div>
        )}
      </div>
    </div>
  );
}
