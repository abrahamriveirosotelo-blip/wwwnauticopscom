import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Mapa global de la flota: pinta la posición AIS en vivo (aisstream) de cada buque
 * con posición conocida, más el puerto de Marín. Cinemática (lat/lon/rumbo/velocidad)
 * viene de enrich-marin-ais.mjs; los buques sin posición no se pintan. */

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

/** Encuadra el mapa a todos los puntos; con un solo punto (solo Marín) fija una vista regional. */
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length <= 1) { map.setView([MARIN.lat, MARIN.lon], 8); return; }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 11 });
  }, [points, map]);
  return null;
}

export default function FleetMap({ calls, fmt, onSelect }) {
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

  const points = useMemo(
    () => [[MARIN.lat, MARIN.lon], ...vessels.map(v => [v.aisLat, v.aisLon])],
    [vessels]
  );

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

      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gray}22` }}>
        <MapContainer
          style={{ height: 440, width: "100%" }}
          center={[MARIN.lat, MARIN.lon]}
          zoom={8}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[MARIN.lat, MARIN.lon]} icon={marinIcon}>
            <Tooltip direction="top" offset={[0, -12]}>{MARIN.label}</Tooltip>
          </Marker>

          {vessels.map(v => {
            const deg = v.aisHeading ?? v.aisCog ?? null;
            const color = statusColor(v.aisStatus);
            return (
              <Marker
                key={v.mmsi || v.name}
                position={[v.aisLat, v.aisLon]}
                icon={vesselIcon(deg, color)}
                eventHandlers={onSelect ? { click: () => onSelect(v) } : undefined}
              >
                <Tooltip direction="top" offset={[0, -12]}>
                  <div style={{ fontWeight: 800, color: C.navy }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
                    {v.aisStatus || "—"}
                    {v.aisSog != null && ` · ${v.aisSog} kn`}
                    {v.aisCog != null && ` · rumbo ${Math.round(v.aisCog)}°`}
                  </div>
                  {v.aisDestination && (
                    <div style={{ fontSize: 11, color: C.gray }}>→ {v.aisDestination}</div>
                  )}
                  {v.aisPosAt && (
                    <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>
                      posición: {fmt ? fmt(v.aisPosAt) : v.aisPosAt}
                    </div>
                  )}
                  {onSelect && (
                    <div style={{ fontSize: 10, color: C.cyan, fontWeight: 700, marginTop: 3 }}>
                      clic para ver la escala →
                    </div>
                  )}
                </Tooltip>
              </Marker>
            );
          })}

          <FitBounds points={points} />
        </MapContainer>

        {!vessels.length && (
          <div style={{
            position: "absolute", left: 12, bottom: 12, zIndex: 500,
            background: "rgba(255,255,255,0.94)", border: `1px solid ${C.gray}33`,
            borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.gray, maxWidth: 320,
          }}>
            Aún no hay posiciones AIS en el snapshot. Se poblarán cuando el pipeline
            ejecute <b>enrich-marin-ais</b> con la clave de aisstream.
          </div>
        )}
      </div>
    </div>
  );
}
