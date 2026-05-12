import { useState } from "react";

const B = {
  navyDeep: "#010B24",
  navy: "#0A1F3D",
  navyMid: "#0F3460",
  cyan: "#079FE6",
  cyanLight: "#29B6F6",
  cyanPale: "#E1F5FE",
  offWhite: "#F7FAFD",
  grayLight: "#E2EBF4",
  gray: "#64748B",
  dark: "#0D1B2A",
  success: "#00C896",
  warning: "#F59E0B",
  danger: "#EF4444",
  white: "#FFFFFF",
};

const CALLS = [
  { id: "A202600259", status: "Iniciado", imo: "8917869", name: "ARTVIN", gt: 1552, len: 74.96, berth: "15", agent: "ROMEU Y CIA. S.A.", op: "D/ CRISTAL", eta: "2026-04-16T20:00", etd: "2026-05-15T21:00", from: "ALGER", to: "BALIKESIR" },
  { id: "A202600317", status: "Iniciado", imo: "1111111", name: "SEMAC", gt: 73, len: 22.68, berth: "7", agent: "ROMEU Y CIA. S.A.", op: "D/C BOYAS PLAYA", eta: "2026-05-05T06:00", etd: "2026-05-15T06:00", from: "DENIA", to: "DENIA" },
  { id: "A202600329", status: "Iniciado", imo: "9588275", name: "IVER BEST", gt: 5948, len: 109, berth: "17", agent: "OCEAN PORTS & SHIPPING SL", op: "D/ BETÚN INST.ESP.", eta: "2026-05-09T06:00", etd: "2026-05-11T22:00", from: "TARRAGONA", to: "HUELVA" },
  { id: "A202600324", status: "Iniciado", imo: "8518297", name: "JUMBO", gt: 1998, len: 88, berth: "13", agent: "ROMEU Y CIA. S.A.", op: "D/ ABONO A TOLVA", eta: "2026-05-09T16:00", etd: "2026-05-12T14:00", from: "KLAIPEDA", to: "BARCELONA" },
  { id: "A202600333", status: "Iniciado", imo: "9338151", name: "SIDER BILBAO", gt: 9177, len: 136, berth: "21", agent: "TERMINALES MARTM. SURESTE S.A.", op: "D/ CEMENTO INST.ESP.", eta: "2026-05-09T20:00", etd: "2026-05-11T10:00", from: "RADES/TUNIS", to: "NADOR" },
  { id: "A202600322", status: "Alerta", imo: "9134153", name: "WEC MAJORELLE", gt: 6362, len: 121.35, berth: "23", agent: "A. PEREZ Y CIA. S.L.", op: "PORTACONTENEDORES", eta: "2026-05-11T01:00", etd: "2026-05-11T08:00", from: "ALGECIRAS", to: "BARCELONA", delay: "+4h 15min" },
  { id: "A202600334", status: "Iniciado", imo: "9237242", name: "CRACOVIA", gt: 25028, len: 180, berth: "25", agent: "OCEAN PORTS & SHIPPING SL", op: "PASAJE Y VEHÍCULOS", eta: "2026-05-11T08:00", etd: "2026-05-11T19:00", from: "ALGER", to: "LAS PALMAS" },
  { id: "A202600320", status: "Prevista", imo: "9641845", name: "BLUE CAPRAMAR", gt: 5357, len: 119, berth: "17", agent: "ROMEU Y CIA. S.A.", op: "D/ ABONO A TOLVA", eta: "2026-05-11T06:00", etd: "2026-05-13T10:00", from: "SAVONA", to: "LAS PALMAS" },
  { id: "A202600330", status: "Prevista", imo: "9558452", name: "AMIRA JOY", gt: 6881, len: 132, berth: "15", agent: "ROMEU Y CIA. S.A.", op: "C/ BLOQUES DE MÁRMOL", eta: "2026-05-13T08:00", etd: "2026-05-15T22:00", from: "TARRAGONA", to: "HUELVA" },
  { id: "A202600327", status: "Prevista", imo: "9483683", name: "NIEVES B", gt: 10318, len: 151.72, berth: "23", agent: "MILLER Y COMPAÑIA S.A.", op: "PORTACONTENEDORES", eta: "2026-05-13T08:00", etd: "2026-05-13T12:00", from: "STA. CRUZ", to: "LAS PALMAS" },
  { id: "A202600344", status: "Prevista", imo: "9216470", name: "KARRUCA", gt: 5214, len: 112, berth: "17", agent: "ROMEU Y CIA. S.A.", op: "D/ ABONO A TOLVA", eta: "2026-05-13T18:00", etd: "2026-05-14T12:00", from: "CARTAGENA", to: "SAFI" },
  { id: "A202600343", status: "Prevista", imo: "9800398", name: "SANTA CAROLINA", gt: 35035, len: 199, berth: "17", agent: "OCEAN PORTS & SHIPPING SL", op: "D/ ESCORIA A GRANEL", eta: "2026-05-13T17:00", etd: "2026-05-15T20:00", from: "ISDEMIR", to: "A ORDENES" },
  { id: "A202600335", status: "Prevista", imo: "9237242", name: "CRACOVIA", gt: 25028, len: 180, berth: "25", agent: "OCEAN PORTS & SHIPPING SL", op: "PASAJE Y VEHÍCULOS", eta: "2026-05-13T08:00", etd: "2026-05-13T18:00", from: "ORAN", to: "ALGER" },
  { id: "A202600319", status: "Prevista", imo: "9349227", name: "NJORD", gt: 7720, len: 141.58, berth: "11", agent: "EUROPEAN FORWARDING SL", op: "PORTACONTENEDORES", eta: "2026-05-14T07:00", etd: "2026-05-15T15:00", from: "DERINCE", to: "PORT SAYD" },
  { id: "A202600309", status: "Prevista", imo: "9302255", name: "SPIRIT", gt: 7713, len: 141.65, berth: "23", agent: "MAGHREB CONTAINER INT. SL", op: "PORTACONTENEDORES", eta: "2026-05-14T08:00", etd: "2026-05-14T14:00", from: "BARCELONA", to: "BARCELONA" },
  { id: "A202600328", status: "Prevista", imo: "9483358", name: "ISABELLA B", gt: 10585, len: 151, berth: "23", agent: "MILLER Y COMPAÑIA S.A.", op: "PORTACONTENEDORES", eta: "2026-05-15T08:00", etd: "2026-05-15T23:00", from: "LAS PALMAS", to: "ORAN" },
];

const TUG = {
  tugboat: "HÉRCULES APA",
  patron: "J. Martínez",
  mecanico: "R. Soler",
  marinero: "P. Ruiz",
  ir_at: "07:02",
  cos_at: "07:18",
  rc_at: "07:21",
  sc_at: "07:52",
  fr_at: "08:05",
  power_pct: 75,
};

function fmt(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function opColor(op) {
  if (op.includes("PORTACONTENEDORES")) return { bg: "#DBEAFE", text: "#1D4ED8" };
  if (op.includes("PASAJE")) return { bg: "#EDE9FE", text: "#6D28D9" };
  if (op.startsWith("D/")) return { bg: "#FEF3C7", text: "#92400E" };
  if (op.startsWith("C/")) return { bg: "#D1FAE5", text: "#065F46" };
  return { bg: B.grayLight, text: B.gray };
}

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="26" r="6" stroke={B.cyan} strokeWidth="5.5" fill="none" />
      <line x1="50" y1="32" x2="50" y2="78" stroke={B.cyan} strokeWidth="5.5" strokeLinecap="round" />
      <line x1="27" y1="52" x2="73" y2="52" stroke={B.cyan} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M27 52 Q20 68 35 73" stroke={B.cyan} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M73 52 Q80 68 65 73" stroke={B.cyan} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M24 32 Q16 16 50 10 Q84 16 76 32" stroke={B.cyan} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M32 37 Q26 24 50 18 Q74 24 68 37" stroke={B.cyan} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9" />
    </svg>
  );
}

function Badge({ status }) {
  const m = {
    Iniciado: { bg: "#DCFCE7", text: "#166534", dot: "#16A34A", label: "EN PUERTO" },
    Prevista: { bg: B.cyanPale, text: "#0369A1", dot: B.cyan, label: "PREVISTA" },
    Alerta: { bg: "#FEE2E2", text: "#DC2626", dot: B.danger, label: "⚠ ALERTA" },
  }[status] || { bg: B.grayLight, text: B.gray, dot: B.gray, label: status };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", background: m.bg, color: m.text }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, display: "inline-block", flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

function OpTag({ op }) {
  const { bg, text } = opColor(op);
  return <span style={{ padding: "2px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: bg, color: text }}>{op}</span>;
}

function TimeRow({ label, planned, real, warn }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", gap: 8, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${B.grayLight}` }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: B.gray, letterSpacing: "0.06em" }}>{label}</span>
      <div>
        <div style={{ fontSize: 9, color: B.gray, marginBottom: 2, fontWeight: 700 }}>PREVISTO</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: B.dark }}>{planned}</div>
      </div>
      <div>
        <div style={{ fontSize: 9, color: B.gray, marginBottom: 2, fontWeight: 700 }}>REAL</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: real ? (warn ? B.danger : B.success) : B.grayLight }}>{real || "—"}</div>
      </div>
    </div>
  );
}

function TugStep({ code, label, time, done, last }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 9, fontWeight: 800, background: done ? B.navy : B.grayLight, color: done ? B.cyan : B.gray }}>{code}</div>
        {!last && <div style={{ width: 2, height: 16, background: done ? B.cyan : B.grayLight, marginTop: 2, borderRadius: 1 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 6 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: done ? B.navy : B.gray }}>{label}</div>
        <div style={{ fontSize: 12, color: done ? B.dark : B.gray, fontWeight: done ? 600 : 400 }}>{time || "—"}</div>
      </div>
    </div>
  );
}

function Detail({ call, onClose }) {
  const hasTug = call.status !== "Prevista" && call.gt > 2000;
  const isAlert = call.status === "Alerta";
  const [tab, setTab] = useState("operacion");

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: 490,
        background: B.white,
        boxShadow: "-4px 0 40px rgba(1,11,36,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        fontFamily: "'Nunito',system-ui,sans-serif",
        overflowY: "auto",
      }}
    >
      <div style={{ background: isAlert ? "#7F1D1D" : B.navy, padding: "20px 24px", color: B.white, flexShrink: 0, borderBottom: isAlert ? `3px solid ${B.danger}` : "none" }}>
        {isAlert && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, background: "rgba(239,68,68,0.2)", borderRadius: 8, padding: "6px 12px" }}>
            <span style={{ fontSize: 14 }}>⚠</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FCA5A5", letterSpacing: "0.06em" }}>RETRASO CONFIRMADO · {call.delay}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 700 }}>{call.id}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 3, letterSpacing: "-0.01em" }}>{call.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>IMO {call.imo} · {call.gt.toLocaleString()} GT · {call.len} m</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.12)", border: "none", color: B.white, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge status={call.status} />
          <OpTag op={call.op} />
          <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.12)", color: B.white, letterSpacing: "0.05em" }}>MUELLE {call.berth}</span>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: `2px solid ${B.grayLight}`, background: B.offWhite, flexShrink: 0 }}>
        {["operacion", "servicios", "documentos"].map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              background: "transparent",
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontFamily: "inherit",
              color: tab === k ? B.cyan : B.gray,
              borderBottom: tab === k ? `2px solid ${B.cyan}` : "2px solid transparent",
              marginBottom: -2,
            }}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, flex: 1 }}>
        {tab === "operacion" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: B.offWhite, borderRadius: 12, padding: "14px 18px", marginBottom: 20, border: `1px solid ${B.grayLight}` }}>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: 9, color: B.gray, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 3 }}>ORIGEN</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.navy }}>{call.from}</div>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ flex: 1, height: 1, background: B.grayLight }} />
                <span style={{ fontSize: 18, color: B.cyan }}>⚓</span>
                <div style={{ flex: 1, height: 1, background: B.grayLight }} />
              </div>
              <div style={{ textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: 9, color: B.gray, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 3 }}>DESTINO</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.navy }}>{call.to}</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: B.gray, letterSpacing: "0.08em", marginBottom: 10 }}>TIEMPOS</div>
              <div style={{ background: B.offWhite, borderRadius: 12, padding: "0 16px", border: `1px solid ${B.grayLight}` }}>
                <TimeRow label="ETA" planned={fmt(call.eta)} real={call.status !== "Prevista" ? fmt(new Date(new Date(call.eta).getTime() + 12 * 60000)) : null} warn={isAlert} />
                <TimeRow label="ATA" planned="—" real={call.status !== "Prevista" ? fmt(new Date(new Date(call.eta).getTime() + 25 * 60000)) : null} warn={isAlert} />
                <TimeRow label="ETD" planned={fmt(call.etd)} real={null} />
                <TimeRow label="ATD" planned="—" real={null} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: B.gray, letterSpacing: "0.08em", marginBottom: 10 }}>CONSIGNATARIO</div>
              <div style={{ background: B.offWhite, borderRadius: 12, padding: "12px 16px", fontSize: 13, color: B.navy, fontWeight: 600, border: `1px solid ${B.grayLight}` }}>{call.agent}</div>
            </div>

            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: B.gray, letterSpacing: "0.08em", marginBottom: 10 }}>MOVIMIENTOS AUTORIZADOS</div>
              <div style={{ background: B.offWhite, borderRadius: 12, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, border: `1px solid ${B.grayLight}` }}>
                {[
                  { tipo: "E", label: "Entrada", from: "Mar", to: `Muelle ${call.berth}`, done: call.status !== "Prevista" },
                  { tipo: "S", label: "Salida", from: `Muelle ${call.berth}`, to: "Mar", done: false },
                ].map((m) => (
                  <div key={m.tipo} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: B.white, borderRadius: 8, border: `1px solid ${B.grayLight}` }}>
                    <span style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: m.tipo === "E" ? B.cyanPale : "#FEF3C7", color: m.tipo === "E" ? B.navy : "#92400E" }}>{m.tipo}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: B.navy }}>{m.label}</div>
                      <div style={{ fontSize: 10, color: B.gray }}>
                        {m.from} → {m.to}
                      </div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", color: m.done ? B.success : B.warning }}>{m.done ? "EJECUTADO" : "PREVISTO"}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "servicios" && (
          <>
            {hasTug ? (
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: B.gray, letterSpacing: "0.08em", marginBottom: 10 }}>REMOLQUE</div>
                <div style={{ background: B.offWhite, borderRadius: 12, padding: 18, border: `1px solid ${B.grayLight}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: B.navy }}>{TUG.tugboat}</div>
                      <div style={{ fontSize: 11, color: B.gray, marginTop: 2 }}>Parte nº 027892 · {TUG.power_pct}% potencia</div>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", background: "#DCFCE7", color: "#166534" }}>{isAlert ? "⚠ EN CURSO" : "COMPLETADO"}</span>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    {[
                      { code: "IR", label: "Salida base", time: TUG.ir_at, done: true },
                      { code: "COS", label: "Al costado", time: TUG.cos_at, done: true },
                      { code: "RC", label: "Recoge cabo", time: isAlert ? "—" : TUG.rc_at, done: !isAlert },
                      { code: "SC", label: "Sale costado", time: isAlert ? "—" : TUG.sc_at, done: !isAlert },
                      { code: "FR", label: "Llega a base", time: isAlert ? "—" : TUG.fr_at, done: !isAlert },
                    ].map((step, i, a) => (
                      <TugStep key={step.code} code={step.code} label={step.label} time={step.time} done={step.done} last={i === a.length - 1} />
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      ["Patrón", TUG.patron],
                      ["Mecánico", TUG.mecanico],
                      ["Marinero", TUG.marinero],
                    ].map(([r, n]) => (
                      <div key={r} style={{ background: B.white, borderRadius: 8, padding: "8px 10px", border: `1px solid ${B.grayLight}` }}>
                        <div style={{ fontSize: 9, color: B.gray, fontWeight: 800, letterSpacing: "0.05em" }}>{String(r).toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: B.navy, fontWeight: 700, marginTop: 2 }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: B.offWhite, borderRadius: 12, padding: 32, textAlign: "center", color: B.gray, border: `1px solid ${B.grayLight}` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Sin servicios registrados aún</div>
              </div>
            )}
          </>
        )}

        {tab === "documentos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {hasTug && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: B.offWhite, borderRadius: 10, border: `1px solid ${B.grayLight}` }}>
                <div style={{ width: 38, height: 38, background: B.cyanPale, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B.navy }}>Parte de remolque nº 027892</div>
                  <div style={{ fontSize: 11, color: B.gray }}>Recibido vía WhatsApp · 11/05/2026 · OCR completado</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: B.success, background: "#DCFCE7", padding: "3px 8px", borderRadius: 6, letterSpacing: "0.04em" }}>✓ OCR</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: B.offWhite, borderRadius: 10, border: `1px solid ${B.grayLight}` }}>
              <div style={{ width: 38, height: 38, background: "#EDE9FE", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📋</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.navy }}>NOA · {call.id}</div>
                <div style={{ fontSize: 11, color: B.gray }}>Notice of Arrival · AP Alicante</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlicanteDemoPage() {
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const counts = {
    total: CALLS.length,
    iniciado: CALLS.filter((c) => c.status === "Iniciado").length,
    prevista: CALLS.filter((c) => c.status === "Prevista").length,
    alerta: CALLS.filter((c) => c.status === "Alerta").length,
  };

  const filtered = CALLS.filter((c) => {
    const q = search.toLowerCase();
    const ms = !search || c.name.toLowerCase().includes(q) || c.imo.includes(q) || c.id.toLowerCase().includes(q) || c.agent.toLowerCase().includes(q);
    const mf = filter === "Todas" || (filter === "Iniciado" && (c.status === "Iniciado" || c.status === "Alerta")) || (filter === "Alerta" && c.status === "Alerta") || (filter === "Prevista" && c.status === "Prevista");
    return ms && mf;
  });

  return (
    <div style={{ fontFamily: "'Nunito',system-ui,sans-serif", background: B.offWhite, minHeight: "100vh", color: B.dark }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ background: B.navyDeep, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, boxShadow: "0 1px 0 rgba(7,159,230,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Logo size={26} />
            <span style={{ color: B.white, fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>NauticOps</span>
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>para</span>
            <span style={{ fontSize: 12, color: B.cyan, fontWeight: 800, letterSpacing: "0.04em" }}>ALICANTE PORT</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {counts.alerta > 0 && (
            <span style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", padding: "3px 10px", borderRadius: 99, fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", border: "1px solid rgba(239,68,68,0.3)" }}>
              ⚠ {counts.alerta} ALERTA ACTIVA
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: B.success, boxShadow: `0 0 6px ${B.success}`, display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700 }}>EN VIVO · 11/05/2026</span>
          </div>
        </div>
      </div>

      <div style={{ background: B.white, borderBottom: `1px solid ${B.grayLight}`, padding: "14px 24px", display: "flex", alignItems: "center", boxShadow: "0 1px 6px rgba(1,11,36,0.05)" }}>
        {[
          { label: "ESCALAS TOTALES", value: counts.total, color: B.navy },
          { label: "EN PUERTO", value: counts.iniciado, color: B.success },
          { label: "CON ALERTA", value: counts.alerta, color: B.danger },
          { label: "PREVISTAS", value: counts.prevista, color: B.cyan },
        ].map((s, i) => (
          <div key={s.label} style={{ paddingRight: 28, marginRight: 28, borderRight: i < 3 ? `1px solid ${B.grayLight}` : "none" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: B.gray, letterSpacing: "0.08em", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: B.gray }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buque, IMO, agente…"
              style={{
                paddingLeft: 32,
                paddingRight: 12,
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 8,
                border: `1px solid ${B.grayLight}`,
                fontSize: 12,
                outline: "none",
                width: 200,
                background: B.offWhite,
                fontFamily: "inherit",
                color: B.dark,
              }}
            />
          </div>
          {[
            { k: "Todas", l: "Todas", n: counts.total },
            { k: "Iniciado", l: "En puerto", n: counts.iniciado + counts.alerta },
            { k: "Alerta", l: "⚠ Alertas", n: counts.alerta },
            { k: "Prevista", l: "Previstas", n: counts.prevista },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "inherit",
                letterSpacing: "0.02em",
                background: filter === f.k ? (f.k === "Alerta" ? B.danger : B.navy) : B.offWhite,
                color: filter === f.k ? B.white : B.gray,
              }}
            >
              {f.l} <span style={{ opacity: 0.6, fontWeight: 600 }}>({f.n})</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {counts.alerta > 0 && (
          <div style={{ background: "rgba(127,29,29,0.95)", border: `1px solid ${B.danger}`, borderRadius: 10, padding: "10px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>⚠</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#FCA5A5", letterSpacing: "0.04em" }}>ALERTA OPERATIVA ACTIVA</div>
              <div style={{ fontSize: 11, color: "rgba(252,165,165,0.8)", marginTop: 2 }}>WEC MAJORELLE · Muelle 23 · +4h 15min · NIEVES B y SPIRIT potencialmente afectadas</div>
            </div>
            <button
              onClick={() => setSelected(CALLS.find((c) => c.status === "Alerta"))}
              style={{ marginLeft: "auto", background: "rgba(239,68,68,0.2)", border: `1px solid ${B.danger}`, color: "#FCA5A5", borderRadius: 7, padding: "5px 14px", cursor: "pointer", fontSize: 11, fontWeight: 800, fontFamily: "inherit" }}
            >
              Ver detalle →
            </button>
          </div>
        )}

        <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.grayLight}`, overflow: "hidden", boxShadow: "0 1px 6px rgba(1,11,36,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: B.navyDeep }}>
                {["ESCALA", "ESTADO", "BUQUE", "GT", "MUELLE", "OPERACIÓN", "ETA", "ETD", "AGENTE"].map((h) => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isSel = selected?.id === c.id;
                const isAl = c.status === "Alerta";
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(isSel ? null : c)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? `1px solid ${B.grayLight}` : "none",
                      background: isSel ? B.cyanPale : isAl ? "#FFF1F1" : i % 2 === 0 ? B.white : B.offWhite,
                      cursor: "pointer",
                      transition: "background 0.1s",
                      borderLeft: isAl ? `3px solid ${B.danger}` : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel) e.currentTarget.style.background = B.cyanPale;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel) e.currentTarget.style.background = isAl ? "#FFF1F1" : i % 2 === 0 ? B.white : B.offWhite;
                    }}
                  >
                    <td style={{ padding: "11px 14px", fontSize: 11, fontFamily: "'Courier New',monospace", color: B.gray, fontWeight: 600 }}>{c.id}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <Badge status={c.status} />
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: B.navy }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: B.gray, marginTop: 1 }}>IMO {c.imo}</div>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: B.gray, fontWeight: 600 }}>{c.gt.toLocaleString()}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 6, background: isSel ? B.white : B.grayLight, fontSize: 12, fontWeight: 800, color: B.navy }}>{c.berth}</span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <OpTag op={c.op} />
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 11, color: B.gray, whiteSpace: "nowrap" }}>{fmt(c.eta)}</td>
                    <td style={{ padding: "11px 14px", fontSize: 11, color: B.gray, whiteSpace: "nowrap" }}>{fmt(c.etd)}</td>
                    <td style={{ padding: "11px 14px", fontSize: 10, color: B.gray, maxWidth: 160 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.agent}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: B.gray }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Sin resultados</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Logo size={14} />
            <span style={{ fontSize: 10, color: B.gray, fontWeight: 700 }}>NauticOps para Alicante Port</span>
          </div>
          <span style={{ fontSize: 10, color: B.gray }}>puertoalicante.com · Actualización cada 2 horas</span>
        </div>
      </div>

      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(1,11,36,0.45)", zIndex: 99 }} />
          <Detail call={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  );
}
