import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Mapa global de la flota. Cada buque de la lista (ya filtrada) se pinta según:
 *  - AIS reciente (posición ≤ 1 h respecto a la más nueva del snapshot) → en su lat/lon,
 *    flecha orientada al rumbo, coloreada por estado.
 *  - Atracado en Marín (en puerto según la AP) sin AIS reciente → se coloca EN EL PUERTO
 *    (dato de la AP, no AIS), disperso en un anillo para no solaparse.
 *  - Sin posición fiable → no se pinta.
 * Posiciones AIS obsoletas (> 1 h) se descartan: podrían mostrar ubicaciones erróneas.
 * Leaflet a pelo (BSD-2-Clause), sin react-leaflet. La tarjeta de hover se renderiza
 * FUERA del contenedor Leaflet (overflow:hidden) para que no se corte en los bordes. */

// Puerto de Marín (Ría de Pontevedra).
const MARIN = { lat: 42.4053, lon: -8.7020, label: "Puerto de Marín" };
const AIS_FRESH_MS = 60 * 60 * 1000; // 1 h: descarta posiciones AIS más viejas
const BERTH_RADIUS = 0.0035;         // ~350 m: dispersa los atracados alrededor del puerto

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

export default function FleetMap({ calls, fmt, onSelect, height = 440, aisRef = 0 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  // Tarjeta de hover: { x, y, item? , marin? } en píxeles del contenedor del mapa.
  const [hover, setHover] = useState(null);

  // Ítems del mapa: { call, lat, lon, kind }. Dedupe por MMSI (o nombre).
  const items = useMemo(() => {
    const byKey = new Map();
    for (const c of calls) { const k = c.mmsi || c.name; if (!byKey.has(k)) byKey.set(k, c); }
    const out = [];
    const berth = [];
    for (const c of byKey.values()) {
      const t = c.aisPosAt ? new Date(c.aisPosAt).getTime() : NaN;
      const freshAis = c.aisLat != null && c.aisLon != null && !Number.isNaN(t) && aisRef - t <= AIS_FRESH_MS;
      if (freshAis) out.push({ call: c, lat: c.aisLat, lon: c.aisLon, kind: "ais" });
      else if (c.status === "Iniciado" || c.aisArrivedMarin) berth.push(c); // atracado en Marín, sin AIS reciente
      // resto → sin posición fiable, no se pinta
    }
    // Atracados: en un anillo alrededor del puerto (dato AP), para que no se solapen.
    const n = berth.length;
    berth.forEach((c, i) => {
      const ang = (i / Math.max(n, 1)) * 2 * Math.PI;
      const lat = MARIN.lat + BERTH_RADIUS * Math.cos(ang);
      const lon = MARIN.lon + (BERTH_RADIUS * Math.sin(ang)) / Math.cos((MARIN.lat * Math.PI) / 180);
      out.push({ call: c, lat, lon, kind: "berth" });
    });
    return out;
  }, [calls, aisRef]);

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

  // Reajusta Leaflet cuando cambia la altura del contenedor (p. ej. 440→300 en móvil).
  useEffect(() => { mapRef.current?.invalidateSize(); }, [height]);

  // (Re)pinta marcadores cuando cambian los ítems.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    const pt = ll => map.latLngToContainerPoint(ll);

    const marin = L.marker([MARIN.lat, MARIN.lon], { icon: marinIcon }).addTo(layer);
    marin.on("mouseover", () => { const p = pt([MARIN.lat, MARIN.lon]); setHover({ x: p.x, y: p.y, marin: true }); });
    marin.on("mouseout", () => setHover(null));

    const pts = [[MARIN.lat, MARIN.lon]];
    for (const it of items) {
      const c = it.call;
      const ll = [it.lat, it.lon];
      const icon = it.kind === "berth"
        ? vesselIcon(null, C.success)                                          // atracado: punto verde en el puerto
        : vesselIcon(c.aisHeading ?? c.aisCog ?? null, statusColor(c.aisStatus));
      const m = L.marker(ll, { icon }).addTo(layer);
      m.on("mouseover", () => { const p = pt(ll); setHover({ x: p.x, y: p.y, item: it }); });
      m.on("mouseout", () => setHover(null));
      if (onSelect) m.on("click", () => { setHover(null); onSelect(c); });
      pts.push(ll);
    }

    if (pts.length <= 1) map.setView([MARIN.lat, MARIN.lon], 8);
    else map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 12 });

    return () => { layer.remove(); };
  }, [items, onSelect]);

  const it = hover?.item;
  const c = it?.call;
  // Si el hover está cerca del borde superior, la tarjeta se abre HACIA ABAJO.
  const below = hover ? hover.y < 96 : false;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, letterSpacing: "0.02em" }}>
          POSICIÓN DE LA FLOTA · AIS EN VIVO
        </div>
        <div style={{ fontSize: 11, color: C.gray }}>
          {items.length
            ? `${items.length} buque${items.length === 1 ? "" : "s"} en el mapa`
            : "sin buques que mostrar"}
        </div>
      </div>

      {/* Wrapper SIN overflow:hidden e isolation:isolate: la tarjeta de hover (hija de este
          div) puede salirse del mapa sin cortarse, y los z-index de Leaflet quedan contenidos. */}
      <div style={{ position: "relative", isolation: "isolate" }}>
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
                <div style={{ fontWeight: 800, color: C.navy, fontSize: 12 }}>{c.name}</div>
                {it.kind === "berth" ? (
                  <>
                    <div style={{ fontSize: 11, color: C.success, fontWeight: 700, marginTop: 2 }}>Atracado en Marín</div>
                    {c.berth && c.berth !== "—" && <div style={{ fontSize: 10, color: C.gray }}>Muelle {c.berth}</div>}
                    <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>ubicación por dato AP (sin AIS reciente)</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
                      {c.aisStatus || "—"}
                      {c.aisSog != null && ` · ${c.aisSog} kn`}
                      {c.aisCog != null && ` · rumbo ${Math.round(c.aisCog)}°`}
                    </div>
                    {c.aisDestination && <div style={{ fontSize: 11, color: C.gray }}>→ {c.aisDestination}</div>}
                    {c.aisPosAt && (
                      <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>
                        posición: {fmt ? fmt(c.aisPosAt) : c.aisPosAt}
                      </div>
                    )}
                  </>
                )}
                {onSelect && (
                  <div style={{ fontSize: 10, color: C.cyan, fontWeight: 700, marginTop: 3 }}>clic para ver la escala →</div>
                )}
              </>
            )}
          </div>
        )}

        {!items.length && (
          <div style={{
            position: "absolute", left: 12, bottom: 12, zIndex: 10,
            background: "rgba(255,255,255,0.94)", border: `1px solid ${C.gray}33`,
            borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.gray, maxWidth: 320,
          }}>
            Sin buques que mostrar en el mapa con el filtro actual (posiciones AIS obsoletas
            se descartan; los atracados aparecen en el puerto).
          </div>
        )}
      </div>
    </div>
  );
}
