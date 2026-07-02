import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Mapa global de la flota: pinta la posición AIS en vivo (aisstream) de cada buque
 * con posición conocida, más el puerto de Marín. Cinemática (lat/lon/rumbo/velocidad)
 * viene de enrich-marin-ais.mjs; los buques sin posición no se pintan. Clic en un
 * buque → onSelect(call) (mismo drawer que la tabla).
 *
 * Leaflet a pelo (BSD-2-Clause), sin react-leaflet, para no arrastrar su licencia
 * Hippocratic-2.1. La tarjeta de hover se renderiza FUERA del contenedor Leaflet
 * (que tiene overflow:hidden), para que no se corte cerca de los bordes del mapa. */

// Puerto de Marín (Ría de Pontevedra).
const MARIN = { lat: 42.4053, lon: -8.7020, label: "Puerto de Marín" };

const C = {
  navy: "#0A1F3D", cyan: "#079FE6", success: "#00C896",
  warning: "#F59E0B", gray: "#64748B", white: "#FFFFFF",
};

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
    // Punto centrado en un contenedor 26×26 para que cuadre con iconAnchor [13,13].
    ? `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px">
         <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid ${C.white};box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></div>
       </div>`
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

export default function FleetMap({ calls, fmt, onSelect, height = 440 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  // Tarjeta de hover: { x, y, vessel? , marin? } en píxeles del contenedor del mapa.
  const [hover, setHover] = useState(null);

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
    map.on("movestart", () => setHover(null)); // el hover en píxeles deja de ser válido al mover
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Reajusta Leaflet cuando cambia la altura del contenedor (p. ej. 440→300 en móvil):
  // sin esto el mapa conserva el tamaño viejo y tiles/marcadores quedan desalineados.
  useEffect(() => { mapRef.current?.invalidateSize(); }, [height]);

  // (Re)pinta marcadores cuando cambian los buques.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    const pt = ll => map.latLngToContainerPoint(ll); // píxeles dentro del contenedor

    const marin = L.marker([MARIN.lat, MARIN.lon], { icon: marinIcon }).addTo(layer);
    marin.on("mouseover", () => { const p = pt([MARIN.lat, MARIN.lon]); setHover({ x: p.x, y: p.y, marin: true }); });
    marin.on("mouseout", () => setHover(null));

    const pts = [[MARIN.lat, MARIN.lon]];
    for (const v of vessels) {
      const deg = v.aisHeading ?? v.aisCog ?? null;
      const ll = [v.aisLat, v.aisLon];
      const m = L.marker(ll, { icon: vesselIcon(deg, statusColor(v.aisStatus)) }).addTo(layer);
      m.on("mouseover", () => { const p = pt(ll); setHover({ x: p.x, y: p.y, vessel: v }); });
      m.on("mouseout", () => setHover(null));
      if (onSelect) m.on("click", () => { setHover(null); onSelect(v); });
      pts.push(ll);
    }

    if (pts.length <= 1) map.setView([MARIN.lat, MARIN.lon], 8);
    else map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 11 });

    return () => { layer.remove(); };
  }, [vessels, onSelect]);

  const v = hover?.vessel;
  // Si el hover está cerca del borde superior, la tarjeta se abre HACIA ABAJO.
  const below = hover ? hover.y < 96 : false;

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

      {/* Wrapper SIN overflow:hidden e isolation:isolate: la tarjeta de hover (hija de
          este div) puede salirse del mapa sin cortarse, y los z-index de Leaflet quedan
          contenidos por debajo del drawer de la escala. */}
      <div style={{ position: "relative", isolation: "isolate" }}>
        {/* Capa de recorte: redondea las esquinas del mapa (tiles). isolation:isolate crea
            su propio contexto de apilamiento, así los z-index internos de Leaflet (200–700)
            quedan CONTENIDOS aquí y no tapan la tarjeta de hover ni la nota (que son
            hermanas de este div, con z-index por encima). */}
        <div style={{ isolation: "isolate", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gray}22` }}>
          <div ref={containerRef} style={{ height, width: "100%" }} />
        </div>

        {hover && (
          <div style={{
            position: "absolute", left: hover.x, top: hover.y, zIndex: 10, pointerEvents: "none",
            transform: below ? "translate(-50%, 22px)" : "translate(-50%, calc(-100% - 16px))",
            background: C.white, border: `1px solid ${C.gray}33`, borderRadius: 8,
            padding: "6px 10px", boxShadow: "0 2px 12px rgba(1,11,36,0.2)", whiteSpace: "nowrap",
          }}>
            {hover.marin ? (
              <div style={{ fontWeight: 800, color: C.navy, fontSize: 12 }}>{MARIN.label}</div>
            ) : (
              <>
                <div style={{ fontWeight: 800, color: C.navy, fontSize: 12 }}>{v.name}</div>
                <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
                  {v.aisStatus || "—"}
                  {v.aisSog != null && ` · ${v.aisSog} kn`}
                  {v.aisCog != null && ` · rumbo ${Math.round(v.aisCog)}°`}
                </div>
                {v.aisDestination && <div style={{ fontSize: 11, color: C.gray }}>→ {v.aisDestination}</div>}
                {v.aisPosAt && (
                  <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>
                    posición: {fmt ? fmt(v.aisPosAt) : v.aisPosAt}
                  </div>
                )}
                {onSelect && (
                  <div style={{ fontSize: 10, color: C.cyan, fontWeight: 700, marginTop: 3 }}>clic para ver la escala →</div>
                )}
              </>
            )}
          </div>
        )}

        {!vessels.length && (
          <div style={{
            position: "absolute", left: 12, bottom: 12, zIndex: 10,
            background: "rgba(255,255,255,0.94)", border: `1px solid ${C.gray}33`,
            borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.gray, maxWidth: 320,
          }}>
            Aún no hay posiciones AIS en el snapshot. Se poblarán cuando ejecutes{" "}
            <code style={{ fontSize: 10.5, fontWeight: 700 }}>npm run enrich-demo:marin:ais</code> en local con la clave de aisstream.
          </div>
        )}
      </div>
    </div>
  );
}
