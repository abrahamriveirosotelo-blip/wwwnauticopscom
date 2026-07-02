import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Simulación de planificación (vista Cronología). El mapa se centra en Marín y anima la
 * entrada/salida de buques según su ETA/ETD: cada buque ENTRA deslizándose desde la bocana
 * de la ría hasta su atraque, PERMANECE atracado durante su estancia, y SALE por el mismo
 * corredor. Un control tipo reproductor (play/pausa + barra con hitos por día + reloj y
 * contador "en puerto" en vivo) recorre en bucle todo el horizonte planificado.
 *   Movimiento ESQUEMÁTICO: no hay trayectorias reales por buque; representa el "cuándo"
 *   (planificado), no el "por dónde". */

const MARIN = { lat: 42.4053, lon: -8.7020, label: "Puerto de Marín" };
const APPROACH = { lat: 42.400, lon: -8.752 };  // aproximación por la ría (O): por aquí entran/salen
const BERTH_RADIUS = 0.0045;                     // anillo de atraque alrededor del puerto
const GLIDE_MS = 4 * 60 * 60 * 1000;             // maniobra de entrada/salida (4 h de deslizamiento)
const LOOP_SECONDS = 44;                          // duración de un bucle completo

const C = {
  navy: "#0A1F3D", cyan: "#079FE6", success: "#00C896", warning: "#F59E0B",
  gray: "#64748B", grayLight: "#E2EBF4", white: "#FFFFFF", offWhite: "#F7FAFD",
};

const fmtClock = ms => {
  const d = new Date(ms);
  return d.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short" }).replace(/\./g, "")
    + " · " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
};
/** Escapa texto antes de interpolarlo en el innerHTML de un divIcon: los nombres vienen de
 *  datos scrapeados de la AP, así que caracteres HTML romperían el markup (o serían XSS). */
const escapeHtml = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Día/noche: altitud del sol (radianes) para una fecha (ms) en lat/lon.
 * Portado de SunCalc (https://github.com/mourner/suncalc), © 2014 Vladimir Agafonkin,
 * licencia BSD 2-Clause. Aviso completo en THIRD_PARTY_NOTICES.md (raíz del proyecto).
 * Se inlinea para no añadir dependencia ni llamadas de red por día. */
const RAD = Math.PI / 180;
function sunAltitude(dateMs, lat, lon) {
  const d = dateMs / 86400000 - 0.5 + 2440588 - 2451545;                    // días desde J2000
  const M = RAD * (357.5291 + 0.98560028 * d);                             // anomalía media solar
  const L = M + RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) + RAD * 102.9372 + Math.PI; // long. eclíptica
  const e = RAD * 23.4397;                                                  // oblicuidad
  const dec = Math.asin(Math.sin(e) * Math.sin(L));                         // declinación
  const ra = Math.atan2(Math.sin(L) * Math.cos(e), Math.cos(L));            // ascensión recta
  const H = RAD * (280.16 + 360.9856235 * d) + RAD * lon - ra;              // ángulo horario
  const phi = RAD * lat;
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
}
/** Oscuridad 0..1 en Marín para una fecha: 0 con el sol sobre el horizonte, 1 por debajo de
 *  −8° (crepúsculo), con transición lineal para simular el amanecer/atardecer. */
const nightFactor = dateMs => {
  const altDeg = sunAltitude(dateMs, MARIN.lat, MARIN.lon) / RAD;
  return Math.min(1, Math.max(0, -altDeg / 8));
};

/** Marcador de buque: silueta de barco (vista cenital) orientada al rumbo (proa hacia `deg`).
 *  Coloreada por fase: verde atracado, cian entrando, naranja saliendo. */
function playIcon(color, deg, highlighted, label) {
  const boat = `<svg width="22" height="22" viewBox="0 0 24 24" style="transform:rotate(${deg || 0}deg);filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.4))">
      <path d="M12 1.5 C 14.6 4, 15.6 7.5, 15.6 11.5 L 15.6 18 C 15.6 20.6, 13.9 21.8, 12 21.8 C 10.1 21.8, 8.4 20.6, 8.4 18 L 8.4 11.5 C 8.4 7.5, 9.4 4, 12 1.5 Z"
        fill="${color}" stroke="${C.white}" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="10.2" y="10" width="3.6" height="5.5" rx="1" fill="${C.white}" opacity="0.85"/>
    </svg>`;
  const halo = highlighted
    ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:34px;height:34px;border-radius:50%;background:${C.cyan}22;border:2.5px solid ${C.cyan};box-shadow:0 0 12px ${C.cyan};z-index:0"></div>`
    : "";
  // Nombre a la derecha del barco: texto blanco con halo oscuro → legible sobre tiles claros
  // y oscuros (día/noche). No rota con el barco.
  const name = label
    ? `<div style="position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:5px;white-space:nowrap;font-size:10px;font-weight:800;color:${C.white};text-shadow:0 0 3px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.95),0 0 4px rgba(0,0,0,.95),0 1px 2px rgba(0,0,0,.95);pointer-events:none">${escapeHtml(label)}</div>`
    : "";
  const size = highlighted ? 40 : 24;
  return L.divIcon({
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">${halo}<div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center">${boat}</div>${name}</div>`,
    className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2],
  });
}

function marinDot() {
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:${C.navy};color:${C.white};font-size:14px;border:2px solid ${C.white};box-shadow:0 1px 3px rgba(0,0,0,.4)">⚓</div>`,
    className: "", iconSize: [26, 26], iconAnchor: [13, 13],
  });
}

export default function SchedulePlayback({ calls, onSelect, selectedId = null, isMobile = false, dateRef = NaN }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const darkLayerRef = useRef(null); // capa de tiles oscura (opacidad = oscuridad del cielo)
  const darknessRef = useRef(0);     // última oscuridad calculada, para fijar la opacidad inicial
  const markersRef = useRef(new Map()); // id -> { marker, phaseKey }
  const [playing, setPlaying] = useState(false);

  // Horizonte y buques (deterministas). Cada buque: arr (ETA), dep (ETD), atraque en anillo.
  const { tStart, tEnd, ships, dayTicks } = useMemo(() => {
    const withT = calls.filter(c => c.eta || c.etd).map(c => ({
      call: c,
      // Sin ETA (p. ej. escalas "en puerto" en arranque en frío, con eta:'') NO se anima la
      // entrada: arr = null → ya atracada desde el inicio del horizonte; solo se anima su
      // salida en el ETD. Usar el ETD como llegada haría que "entre" justo antes de zarpar.
      arr: c.eta ? new Date(c.eta).getTime() : null,
      dep: c.etd ? new Date(c.etd).getTime() : null,
    }));
    const times = [];
    for (const s of withT) { if (s.arr != null) times.push(s.arr); if (s.dep != null) times.push(s.dep); }
    if (!times.length) return { tStart: 0, tEnd: 0, ships: [], dayTicks: [] };
    const tEnd = Math.max(...times);
    // Empieza en la fecha de referencia (hoy) o, si no hay, en el primer evento.
    const tStart = Number.isFinite(dateRef) ? Math.min(dateRef, tEnd) : Math.min(...times);
    // Atraque en anillo, determinista por índice.
    const n = withT.length;
    withT.forEach((s, i) => {
      const ang = (i / Math.max(n, 1)) * 2 * Math.PI;
      s.berth = {
        lat: MARIN.lat + BERTH_RADIUS * Math.cos(ang),
        lon: MARIN.lon + (BERTH_RADIUS * Math.sin(ang)) / Math.cos(MARIN.lat * Math.PI / 180),
      };
    });
    // Hitos por día (medianoche local de cada día del horizonte).
    const ticks = [];
    let d = new Date(tStart); d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (d.getTime() < tStart) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    while (d.getTime() <= tEnd) { ticks.push(d.getTime()); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); }
    return { tStart, tEnd, ships: withT, dayTicks: ticks };
  }, [calls, dateRef]);

  const span = Math.max(1, tEnd - tStart);
  const [t, setT] = useState(tStart);
  // Reinicia el reloj (y pausa) si cambia el horizonte, p. ej. al filtrar.
  useEffect(() => { setT(tStart); setPlaying(false); }, [tStart, tEnd]);

  // Estado de un buque en el instante T: visibilidad, posición, fase (in/dock/out) y rumbo.
  const shipStateAt = (s, T) => {
    const { arr, dep, berth } = s;
    if (arr != null && T < arr - GLIDE_MS) return { visible: false };
    if (dep != null && T > dep + GLIDE_MS) return { visible: false };
    const lerp = (a, b, f) => a + (b - a) * f;
    const bearing = (from, to) => Math.atan2((to.lon - from.lon) * Math.cos(MARIN.lat * Math.PI / 180), to.lat - from.lat) * 180 / Math.PI;
    const easeOut = f => 1 - Math.pow(1 - f, 3); // desacelera al final (atracar)
    const easeIn = f => f * f * f;                // acelera despacio al principio (zarpar)
    if (arr != null && T < arr) { // entrando (bocana → atraque): desacelera al llegar
      const e = easeOut(Math.min(1, Math.max(0, (T - (arr - GLIDE_MS)) / GLIDE_MS)));
      return { visible: true, lat: lerp(APPROACH.lat, berth.lat, e), lon: lerp(APPROACH.lon, berth.lon, e), phase: "in", deg: bearing(APPROACH, berth), color: C.cyan };
    }
    if (dep != null && T > dep) { // saliendo (atraque → bocana): arranca lento y acelera
      const e = easeIn(Math.min(1, Math.max(0, (T - dep) / GLIDE_MS)));
      return { visible: true, lat: lerp(berth.lat, APPROACH.lat, e), lon: lerp(berth.lon, APPROACH.lon, e), phase: "out", deg: bearing(berth, APPROACH), color: C.warning };
    }
    return { visible: true, lat: berth.lat, lon: berth.lon, phase: "dock", deg: bearing(berth, MARIN), color: C.success }; // atracado (proa hacia el puerto)
  };

  // Inicializa el mapa una vez, centrado en Marín + bocana (para ver entrar/salir).
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([MARIN.lat, MARIN.lon], 12);
    // Par claro/oscuro coherente (CARTO): Positron de día, Dark Matter de noche. La capa
    // oscura va encima con opacidad = oscuridad del cielo → crossfade en amanecer/atardecer.
    const cartoAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", { attribution: cartoAttr, subdomains: "abcd" }).addTo(map);
    // Opacidad inicial ya según la oscuridad del instante actual (darknessRef, fijado en el
    // render previo): así, si la sim arranca de noche y en pausa, el mapa ya sale oscuro sin
    // depender de que el efecto de sincronía se dispare después.
    darkLayerRef.current = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", { attribution: cartoAttr, subdomains: "abcd", opacity: darknessRef.current }).addTo(map);
    // Encuadre centrado EN Marín: caja simétrica (aproximación al O + su reflejo al E) →
    // el puerto queda en el centro y el corredor de entrada/salida se ve a la izquierda.
    const mirror = [2 * MARIN.lat - APPROACH.lat, 2 * MARIN.lon - APPROACH.lon];
    map.fitBounds(L.latLngBounds([[APPROACH.lat, APPROACH.lon], mirror]), { padding: [40, 40], maxZoom: 14 });
    L.marker([MARIN.lat, MARIN.lon], { icon: marinDot(), zIndexOffset: 500 }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => { mapRef.current?.invalidateSize(); }, [isMobile]);

  // (Re)crea un marcador por buque cuando cambia el conjunto (empiezan invisibles).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    layerRef.current?.remove();
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    markersRef.current.clear();
    for (const s of ships) {
      const m = L.marker([s.berth.lat, s.berth.lon], { icon: playIcon(C.success, null, false, s.call.name), opacity: 0 }).addTo(layer);
      if (onSelect) m.on("click", () => onSelect(s.call));
      markersRef.current.set(s.call.id, { marker: m, phaseKey: null });
    }
    return () => { layer.remove(); };
  }, [ships, onSelect]);

  // Pinta las posiciones en cada frame (cambia t) y al cambiar la selección.
  useEffect(() => {
    for (const s of ships) {
      const entry = markersRef.current.get(s.call.id);
      if (!entry) continue;
      const st = shipStateAt(s, t);
      if (!st.visible) { entry.marker.setOpacity(0); continue; }
      entry.marker.setLatLng([st.lat, st.lon]);
      entry.marker.setOpacity(1);
      // Aquí cada marcador es UNA escala (no se deduplica por buque como en FleetMap), así
      // que el destacado se compara por id de escala → 1:1 con la escala seleccionada
      // (un buque con varias escalas no resalta todas a la vez).
      const isSel = selectedId != null && s.call.id === selectedId;
      // El rumbo es constante durante cada deslizamiento (recta), así que solo re-creo el
      // icono cuando cambia la fase, el rumbo o el estado de selección (no en cada frame).
      const key = `${st.phase}|${Math.round(st.deg ?? 0)}|${isSel}`;
      if (entry.phaseKey !== key) {
        entry.marker.setIcon(playIcon(st.color, st.deg, isSel, s.call.name));
        entry.marker.setZIndexOffset(isSel ? 2000 : 0);
        entry.phaseKey = key;
      }
    }
  }, [t, ships, selectedId]);

  // Bucle de reproducción (requestAnimationFrame → suave, independiente del framerate).
  useEffect(() => {
    if (!playing) return;
    let raf, last = null;
    const step = ts => {
      if (last == null) last = ts;
      const dReal = ts - last; last = ts;
      setT(prev => {
        const next = prev + dReal * (span / (LOOP_SECONDS * 1000));
        return next >= tEnd ? tStart + ((next - tStart) % span) : next; // bucle
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, span, tStart, tEnd]);

  const pct = Math.min(1, Math.max(0, (t - tStart) / span));
  const docked = ships.filter(s => shipStateAt(s, t).phase === "dock").length;

  // Día/noche: la opacidad de la capa oscura sigue la oscuridad del cielo en Marín para el
  // instante virtual. El efecto solo se dispara cuando `darkness` cambia (constante de día/noche
  // plenos → sin trabajo; suave en el crepúsculo). Redondeo para no re-pintar cada frame.
  const darkness = Math.round(nightFactor(t) * 100) / 100;
  darknessRef.current = darkness; // para que el init de la capa oscura use la opacidad correcta
  useEffect(() => { darkLayerRef.current?.setOpacity(darkness); }, [darkness]);
  const isNight = darkness >= 0.5;

  // Seek al pinchar/arrastrar en la barra. Uso una bandera de arrastre (no `e.buttons`),
  // porque en eventos de puntero táctiles `buttons` suele ser 0 y bloquearía el scrub.
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const seekFromEvent = e => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setT(tStart + Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * span);
  };
  // Seek por teclado (patrón APG slider): flechas ±1 h, Re/Av Pág ±1 día, Inicio/Fin extremos.
  const HOUR = 60 * 60 * 1000;
  const onSliderKey = e => {
    let next;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = t - HOUR;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = t + HOUR;
    else if (e.key === "PageDown") next = t - 24 * HOUR;
    else if (e.key === "PageUp") next = t + 24 * HOUR;
    else if (e.key === "Home") next = tStart;
    else if (e.key === "End") next = tEnd;
    else return;
    e.preventDefault();
    setT(Math.min(tEnd, Math.max(tStart, next)));
  };

  // Nota: NO se hace early-return con 0 escalas. El contenedor del mapa debe permanecer
  // siempre montado para que el useEffect de inicialización (deps []) pueda enlazar Leaflet
  // de forma estable; si se desmontara al filtrar a 0 y luego volvieran escalas, el mapa
  // quedaría sin inicializar. Con 0 escalas se muestra un overlay y se ocultan los controles.
  return (
    <div style={{ marginBottom: 16 }}>
      <style>{`.marin-slider:focus-visible{outline:3px solid ${C.cyan};outline-offset:3px;border-radius:4px}`}</style>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, letterSpacing: "0.02em" }}>SIMULACIÓN DE PLANIFICACIÓN</div>
        <div style={{ fontSize: 11, color: C.gray }}>entrada / salida según ETA · ETD · movimiento esquemático</div>
      </div>

      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.gray}22` }}>
        <div ref={containerRef} style={{ height: isMobile ? 300 : 420, width: "100%" }} />
        {!ships.length && (
          <div style={{ position: "absolute", inset: 0, zIndex: 500, display: "flex", alignItems: "center",
            justifyContent: "center", textAlign: "center", padding: 24, color: C.gray, fontSize: 12,
            fontWeight: 600, background: "rgba(247,250,253,0.82)" }}>
            Sin escalas con ETA o ETD que simular con el filtro actual.
          </div>
        )}
      </div>

      {ships.length > 0 && (<>
      {/* Controles tipo reproductor */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
        <button type="button" onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pausar" : "Reproducir"}
          style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 999, border: "none", cursor: "pointer",
            background: C.navy, color: C.white, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
          {playing ? "⏸" : "▶"}
        </button>
        <div ref={trackRef} className="marin-slider"
          role="slider" tabIndex={0}
          aria-label="Línea de tiempo de la simulación"
          aria-valuemin={Math.round(tStart)} aria-valuemax={Math.round(tEnd)}
          aria-valuenow={Math.round(t)} aria-valuetext={fmtClock(t)}
          onKeyDown={onSliderKey}
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); draggingRef.current = true; seekFromEvent(e); }}
          onPointerMove={e => { if (draggingRef.current) seekFromEvent(e); }}
          onPointerUp={() => { draggingRef.current = false; }}
          onPointerCancel={() => { draggingRef.current = false; }}
          style={{ flex: 1, minWidth: 0, position: "relative", height: 28, cursor: "pointer", touchAction: "none" }}>
          <div style={{ position: "absolute", top: 13, left: 0, right: 0, height: 5, borderRadius: 3, background: C.grayLight }} />
          <div style={{ position: "absolute", top: 13, left: 0, width: `${pct * 100}%`, height: 5, borderRadius: 3, background: C.cyan }} />
          {dayTicks.map(tk => {
            const p = (tk - tStart) / span * 100;
            return (
              <div key={tk} style={{ position: "absolute", top: 6, left: `${p}%`, transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
                <div style={{ width: 1, height: 9, background: C.gray, opacity: 0.55 }} />
                <span style={{ fontSize: 9, color: C.gray, marginTop: 1 }}>{new Date(tk).getDate()}</span>
              </div>
            );
          })}
          <div style={{ position: "absolute", top: 8, left: `${pct * 100}%`, transform: "translateX(-50%)",
            width: 15, height: 15, borderRadius: 999, background: C.white, border: `3px solid ${C.cyan}`,
            boxShadow: "0 1px 4px rgba(0,0,0,.3)", pointerEvents: "none" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: C.navy, fontFamily: "'Courier New',monospace" }}>
          <span aria-hidden="true" style={{ marginRight: 5 }}>{isNight ? "🌙" : "☀️"}</span>{fmtClock(t)}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: docked ? C.success : C.gray }}>⚓ {docked} en puerto</span>
      </div>
      </>)}
    </div>
  );
}
