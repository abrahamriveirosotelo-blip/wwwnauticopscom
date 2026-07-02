import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Mapa global de la flota. Cada buque de la lista (ya filtrada) se pinta según:
 *  - AIS reciente (posición ≤ 1 h respecto a la más nueva del snapshot) → en su lat/lon,
 *    flecha orientada al rumbo, coloreada por estado.
 *  - Atracado en Marín (en puerto según la AP) sin AIS reciente → EN EL PUERTO (dato AP),
 *    disperso en un anillo. En vista alejada, los atracados se agrupan en la boya del
 *    puerto con una insignia (nº de barcos); al clicar, el mapa hace zoom y se separan.
 *  - Sin posición fiable → no se pinta.
 * Posiciones AIS obsoletas (> 1 h) se descartan (podrían mostrar ubicaciones erróneas). */

// Puerto de Marín (Ría de Pontevedra).
const MARIN = { lat: 42.4053, lon: -8.7020, label: "Puerto de Marín" };
const AIS_FRESH_MS = 60 * 60 * 1000; // 1 h: descarta posiciones AIS más viejas
const BERTH_RADIUS = 0.005;          // 0.005° ≈ 550 m: anillo de atracados alrededor del puerto
const CLUSTER_MIN_ZOOM = 13;         // a partir de este zoom los atracados se ven separados

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
    ? `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px">
         <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid ${C.white};box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></div>
       </div>`
    : `<svg width="26" height="26" viewBox="0 0 26 26" style="transform:rotate(${deg}deg);filter:drop-shadow(0 1px 1px rgba(0,0,0,0.35))">
         <path d="M13 2 L20 22 L13 17 L6 22 Z" fill="${color}" stroke="${C.white}" stroke-width="1.5" stroke-linejoin="round"/>
       </svg>`;
  return L.divIcon({ html, className: "", iconSize: [26, 26], iconAnchor: [13, 13] });
}

/** Boya del puerto de Marín. Con `n>0` añade una insignia verde con el nº de atracados. */
function marinIcon(n = 0) {
  const badge = n > 0
    ? `<div style="position:absolute;top:-7px;right:-7px;min-width:17px;height:17px;padding:0 3px;border-radius:9px;background:${C.success};color:${C.white};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid ${C.white};box-sizing:border-box">${n}</div>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;width:26px;height:26px">
      <div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:${C.navy};color:${C.white};font-size:14px;border:2px solid ${C.white};box-shadow:0 1px 3px rgba(0,0,0,0.4)">⚓</div>
      ${badge}
    </div>`,
    className: "", iconSize: [26, 26], iconAnchor: [13, 13],
  });
}

export default function FleetMap({ calls, fmt, onSelect, height = 440, aisRef = 0 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  // Tarjeta de hover: { x, y, item? , marin? } en píxeles del contenedor del mapa.
  const [hover, setHover] = useState(null);
  const [zoom, setZoom] = useState(8);

  // Ítems del mapa: { call, lat, lon, kind }. Dedupe por MMSI (o nombre).
  const items = useMemo(() => {
    // Dedupe por MMSI (o nombre): un buque puede tener varias escalas; se queda con la
    // MÁS relevante para el mapa de forma determinista (en puerto > con posición > resto),
    // no la primera que aparezca en el array.
    const score = c => (c.status === "Iniciado" || c.status === "Alerta") ? 3
      : (c.aisLat != null && c.aisLon != null && c.aisPosAt) ? 2 : 1;
    const byKey = new Map();
    for (const c of calls) {
      const k = c.mmsi || c.name;
      const prev = byKey.get(k);
      if (!prev || score(c) > score(prev)) byKey.set(k, c);
    }
    const out = [];
    const berth = [];
    for (const c of byKey.values()) {
      const t = c.aisPosAt ? new Date(c.aisPosAt).getTime() : NaN;
      const hasPos = c.aisLat != null && c.aisLon != null && !Number.isNaN(t);
      const age = aisRef - t; // ms respecto a la posición más nueva del conjunto
      // Fresca si 0 ≤ edad ≤ 1 h (una marca futura o incoherente no cuenta). Sin
      // referencia (aisRef===0, no hay posiciones) no se juzga: se muestran todas.
      const freshAis = hasPos && (aisRef === 0 || (age >= 0 && age <= AIS_FRESH_MS));
      const inPortAP = c.status === "Iniciado" || c.status === "Alerta";
      // La AP manda para los atracados: si dice "en puerto", el buque va AL PUERTO,
      // aunque el AIS traiga una posición (a menudo obsoleta/contradictoria: p. ej.
      // "Atracado" a 6.8 kn lejos de Marín). El AIS solo posiciona a los que NO están
      // en puerto (Prevista en ruta). Un Prevista ya en Marín por AIS se pinta en su
      // posición AIS (cerca del puerto) como "planificado vs ejecutado".
      if (inPortAP) berth.push(c);
      else if (freshAis) out.push({ call: c, lat: c.aisLat, lon: c.aisLon, kind: "ais" });
    }
    const n = berth.length;
    berth.forEach((c, i) => {
      const ang = (i / Math.max(n, 1)) * 2 * Math.PI;
      const lat = MARIN.lat + BERTH_RADIUS * Math.cos(ang);
      const lon = MARIN.lon + (BERTH_RADIUS * Math.sin(ang)) / Math.cos((MARIN.lat * Math.PI) / 180);
      out.push({ call: c, lat, lon, kind: "berth" });
    });
    return out;
  }, [calls, aisRef]);

  const aisItems = useMemo(() => items.filter(i => i.kind === "ais"), [items]);
  const berthItems = useMemo(() => items.filter(i => i.kind === "berth"), [items]);
  // Agrupar atracados en la boya cuando hay >1 y el zoom no los separa.
  const clusterBerth = berthItems.length > 1 && zoom < CLUSTER_MIN_ZOOM;

  // Inicializa el mapa una vez.
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([MARIN.lat, MARIN.lon], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    map.on("movestart", () => setHover(null));
    map.on("zoomstart", () => setHover(null)); // el hover en píxeles deja de ser válido al hacer zoom
    map.on("zoomend", () => setZoom(map.getZoom()));
    mapRef.current = map;
    setZoom(map.getZoom());
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Reajusta Leaflet cuando cambia la altura del contenedor (p. ej. 440→300 en móvil).
  useEffect(() => { mapRef.current?.invalidateSize(); }, [height]);

  // Encuadre: solo cuando cambian los ítems (NO con el zoom → evita bucle con zoomend).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const pts = [[MARIN.lat, MARIN.lon], ...aisItems.map(i => [i.lat, i.lon]), ...berthItems.map(i => [i.lat, i.lon])];
    if (pts.length <= 1) map.setView([MARIN.lat, MARIN.lon], 8);
    else map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 12 });
  }, [aisItems, berthItems]);

  // (Re)pinta marcadores cuando cambian los ítems o el modo clúster (zoom).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    const pt = ll => map.latLngToContainerPoint(ll);

    // Boya del puerto (con insignia si se agrupan los atracados).
    const port = L.marker([MARIN.lat, MARIN.lon],
      { icon: marinIcon(clusterBerth ? berthItems.length : 0), zIndexOffset: 1000 }).addTo(layer);
    port.on("mouseover", () => { const p = pt([MARIN.lat, MARIN.lon]); setHover({ x: p.x, y: p.y, marin: true }); });
    port.on("mouseout", () => setHover(null));
    if (clusterBerth) port.on("click", () => { setHover(null); map.flyTo([MARIN.lat, MARIN.lon], CLUSTER_MIN_ZOOM, { duration: 0.8 }); });

    // Buques con AIS (siempre individuales).
    for (const it of aisItems) {
      const c = it.call;
      const ll = [it.lat, it.lon];
      const m = L.marker(ll, { icon: vesselIcon(c.aisHeading ?? c.aisCog ?? null, statusColor(c.aisStatus)) }).addTo(layer);
      m.on("mouseover", () => { const p = pt(ll); setHover({ x: p.x, y: p.y, item: it }); });
      m.on("mouseout", () => setHover(null));
      if (onSelect) m.on("click", () => { setHover(null); onSelect(c); });
    }

    // Atracados individuales solo si NO se agrupan (zoom suficiente o solo 1).
    if (!clusterBerth) {
      for (const it of berthItems) {
        const c = it.call;
        const ll = [it.lat, it.lon];
        const m = L.marker(ll, { icon: vesselIcon(null, C.success) }).addTo(layer);
        m.on("mouseover", () => { const p = pt(ll); setHover({ x: p.x, y: p.y, item: it }); });
        m.on("mouseout", () => setHover(null));
        if (onSelect) m.on("click", () => { setHover(null); onSelect(c); });
      }
    }

    return () => { layer.remove(); };
  }, [aisItems, berthItems, clusterBerth, onSelect]);

  const it = hover?.item;
  const c = it?.call;
  const below = hover ? hover.y < 96 : false;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, letterSpacing: "0.02em" }}>
          POSICIÓN DE LA FLOTA
        </div>
        <div style={{ fontSize: 11, color: C.gray }}>
          {items.length
            ? `${items.length} buque${items.length === 1 ? "" : "s"} · AIS en vivo + atracados (AP)`
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
              <>
                <div style={{ fontWeight: 800, color: C.navy, fontSize: 12 }}>{MARIN.label}</div>
                {clusterBerth && (
                  <>
                    <div style={{ fontSize: 11, color: C.success, fontWeight: 700, marginTop: 2 }}>
                      {berthItems.length} buques atracados
                    </div>
                    {berthItems.slice(0, 6).map(b => (
                      <div key={b.call.id} style={{ fontSize: 10, color: C.gray }}>• {b.call.name}</div>
                    ))}
                    {berthItems.length > 6 && <div style={{ fontSize: 10, color: C.gray }}>… y {berthItems.length - 6} más</div>}
                    <div style={{ fontSize: 10, color: C.cyan, fontWeight: 700, marginTop: 3 }}>clic para desplegar →</div>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={{ fontWeight: 800, color: C.navy, fontSize: 12 }}>{c.name}</div>
                {it.kind === "berth" ? (
                  <>
                    <div style={{ fontSize: 11, color: C.success, fontWeight: 700, marginTop: 2 }}>En puerto (Marín)</div>
                    {c.berth && c.berth !== "—" && <div style={{ fontSize: 10, color: C.gray }}>Muelle {c.berth}</div>}
                    <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>posición según la AP (muelle)</div>
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
