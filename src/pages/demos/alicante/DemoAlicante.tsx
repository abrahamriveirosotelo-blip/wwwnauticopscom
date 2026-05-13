import { useState } from "react";
import data from "./data.json";

const B = {
  navyDeep:"#010B24", navy:"#0A1F3D", navyMid:"#0F3460",
  cyan:"#079FE6", cyanLight:"#29B6F6", cyanPale:"#E1F5FE",
  offWhite:"#F7FAFD", grayLight:"#E2EBF4", gray:"#64748B",
  dark:"#0D1B2A", success:"#00C896", warning:"#F59E0B",
  danger:"#EF4444", white:"#FFFFFF",
};


const LOGO_NO  = "data:image/png;base64,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";
const LOGO_APA = "data:image/png;base64,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";


const CALLS     = data.calls;
const TUG       = data.tugService;
const META      = data.meta;
const MILESTONES = data.milestones;

function fmt(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES",{day:"2-digit",month:"short"})+" "+
    d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});
}

function opColor(op) {
  if (op.includes("PORTACONTENEDORES")) return { bg:"#DBEAFE", text:"#1D4ED8" };
  if (op.includes("PASAJE")) return { bg:"#EDE9FE", text:"#6D28D9" };
  if (op.startsWith("D/")) return { bg:"#FEF3C7", text:"#92400E" };
  if (op.startsWith("C/")) return { bg:"#D1FAE5", text:"#065F46" };
  return { bg:B.grayLight, text:B.gray };
}

function Logo({ size=28 }) {
  return <img src={LOGO_NO} alt="NauticOps" style={{width:size,height:size,objectFit:"contain",display:"block"}}/>;
}
function LogoAPA({ height=22 }) {
  return <img src={LOGO_APA} alt="Alicante Port" style={{height,objectFit:"contain",display:"block"}}/>;
}

function Badge({ status }) {
  const m = {
    Iniciado:{ bg:"#DCFCE7", text:"#166534", dot:"#16A34A", label:"EN PUERTO" },
    Prevista: { bg:B.cyanPale, text:"#0369A1", dot:B.cyan,  label:"PREVISTA"  },
    Alerta:  { bg:"#FEE2E2", text:"#DC2626", dot:B.danger, label:"⚠ ALERTA"  },
  }[status]||{bg:B.grayLight,text:B.gray,dot:B.gray,label:status};
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",
      borderRadius:99,fontSize:10,fontWeight:800,letterSpacing:"0.06em",background:m.bg,color:m.text}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:m.dot,display:"inline-block",flexShrink:0}}/>
      {m.label}
    </span>
  );
}

function OpTag({ op }) {
  const {bg,text}=opColor(op);
  return <span style={{padding:"2px 9px",borderRadius:6,fontSize:10,fontWeight:700,background:bg,color:text}}>{op}</span>;
}

function TimeField({ label, value, isReal, isEmpty }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      <div style={{fontSize:9,fontWeight:800,color:B.gray,letterSpacing:"0.07em"}}>{label}</div>
      <div style={{fontSize:13,fontWeight:isReal?700:500,
        color:isEmpty?B.grayLight:isReal?B.success:B.navy,
        fontFamily:isEmpty?"inherit":"'Courier New',monospace"}}>
        {value}
      </div>
    </div>
  );
}

function minsFromTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function TugStep({ code, label, planned, real, last }) {
  const done = !!real;
  const isLate = real && planned && (minsFromTime(real) - minsFromTime(planned)) > 5;
  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",
          justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:800,
          background:done?B.navy:B.grayLight,color:done?B.cyan:B.gray}}>{code}</div>
        {!last&&<div style={{width:2,height:18,background:done?B.cyan:B.grayLight,marginTop:2,borderRadius:1}}/>}
      </div>
      <div style={{paddingBottom:last?0:6,flex:1}}>
        <div style={{fontSize:11,fontWeight:700,color:done?B.navy:B.gray}}>{label}</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:2}}>
          <span style={{fontSize:10,color:B.gray}}>Prev. {planned??"—"}</span>
          {real?(
            <span style={{fontSize:11,fontWeight:700,
              color:isLate?B.danger:B.success,fontFamily:"'Courier New',monospace"}}>
              {real}
              {isLate&&(
                <span style={{marginLeft:6,fontSize:9,fontWeight:800,
                  background:"#FEE2E2",color:B.danger,padding:"1px 5px",borderRadius:4}}>
                  ⚠ tarde
                </span>
              )}
            </span>
          ):(
            <span style={{fontSize:11,color:B.grayLight}}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ call, onClose }) {
  const hasTug = TUG.callId === call.id;
  const isAlert = call.status === "Alerta";
  const [tab, setTab] = useState("operacion");

  return (
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:490,
      background:B.white,boxShadow:`-4px 0 40px rgba(1,11,36,0.2)`,
      display:"flex",flexDirection:"column",zIndex:100,
      fontFamily:"'Nunito',system-ui,sans-serif",overflowY:"auto"}}>

      {/* Header */}
      <div style={{background:isAlert?"#7F1D1D":B.navy,padding:"20px 24px",
        color:B.white,flexShrink:0,
        borderBottom:isAlert?`3px solid ${B.danger}`:"none"}}>
        {isAlert&&(
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,
            background:"rgba(239,68,68,0.2)",borderRadius:8,padding:"6px 12px"}}>
            <span style={{fontSize:14}}>⚠</span>
            <span style={{fontSize:11,fontWeight:800,color:"#FCA5A5",letterSpacing:"0.06em"}}>
              RETRASO CONFIRMADO · {call.delay}
            </span>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",fontWeight:700}}>{call.id}</div>
            <div style={{fontSize:22,fontWeight:800,marginTop:3,letterSpacing:"-0.01em"}}>{call.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>
              IMO {call.imo} · {call.gt.toLocaleString()} GT · {call.len} m
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.12)",border:"none",
            color:B.white,borderRadius:8,padding:"6px 14px",cursor:"pointer",
            fontSize:13,fontFamily:"inherit",fontWeight:700}}>✕</button>
        </div>
        <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
          <Badge status={call.status}/>
          <OpTag op={call.op}/>
          <span style={{padding:"3px 10px",borderRadius:99,fontSize:10,fontWeight:800,
            background:"rgba(255,255,255,0.12)",color:B.white,letterSpacing:"0.05em"}}>
            MUELLE {call.berth}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`2px solid ${B.grayLight}`,background:B.offWhite,flexShrink:0}}>
        {[["operacion","Operación"],["servicios","Servicios"],["documentos","Documentos"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            flex:1,padding:"12px 0",border:"none",background:"transparent",
            fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:"0.05em",fontFamily:"inherit",
            color:tab===k?B.cyan:B.gray,
            borderBottom:tab===k?`2px solid ${B.cyan}`:"2px solid transparent",marginBottom:-2}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{padding:24,flex:1}}>
        {tab==="operacion"&&<>
          {/* Route */}
          <div style={{display:"flex",alignItems:"center",gap:12,background:B.offWhite,
            borderRadius:12,padding:"14px 18px",marginBottom:20,border:`1px solid ${B.grayLight}`}}>
            <div style={{textAlign:"center",minWidth:70}}>
              <div style={{fontSize:9,color:B.gray,fontWeight:800,letterSpacing:"0.06em",marginBottom:3}}>ORIGEN</div>
              <div style={{fontSize:13,fontWeight:700,color:B.navy}}>{call.from}</div>
            </div>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
              <div style={{flex:1,height:1,background:B.grayLight}}/>
              <span style={{fontSize:18,color:B.cyan}}>⚓</span>
              <div style={{flex:1,height:1,background:B.grayLight}}/>
            </div>
            <div style={{textAlign:"center",minWidth:70}}>
              <div style={{fontSize:9,color:B.gray,fontWeight:800,letterSpacing:"0.06em",marginBottom:3}}>DESTINO</div>
              <div style={{fontSize:13,fontWeight:700,color:B.navy}}>{call.to}</div>
            </div>
          </div>

          {/* Times */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:800,color:B.gray,letterSpacing:"0.08em",marginBottom:10}}>TIEMPOS</div>
            <div style={{background:B.offWhite,borderRadius:12,border:`1px solid ${B.grayLight}`,overflow:"hidden"}}>
              {/* Llegada */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,
                borderBottom:`1px solid ${B.grayLight}`}}>
                <div style={{padding:"14px 16px",borderRight:`1px solid ${B.grayLight}`}}>
                  <TimeField label="ETA · Llegada prevista"
                    value={fmt(call.eta)} isReal={false} isEmpty={false}/>
                </div>
                <div style={{padding:"14px 16px"}}>
                  {(() => {
                    const ata = call.status!=="Prevista"
                      ? fmt(new Date(new Date(call.eta).getTime()+25*60000)) : null;
                    return <TimeField label="ATA · Llegada real"
                      value={ata||"—"} isReal={true} isEmpty={!ata}/>;
                  })()}
                </div>
              </div>
              {/* Salida */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                <div style={{padding:"14px 16px",borderRight:`1px solid ${B.grayLight}`}}>
                  <TimeField label="ETD · Salida prevista"
                    value={fmt(call.etd)} isReal={false} isEmpty={false}/>
                </div>
                <div style={{padding:"14px 16px"}}>
                  <TimeField label="ATD · Salida real"
                    value="—" isReal={true} isEmpty={true}/>
                </div>
              </div>
            </div>
          </div>

          {/* Operational milestones */}
          {call.status !== "Prevista" && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:800,color:B.gray,letterSpacing:"0.08em",marginBottom:10}}>HITOS OPERATIVOS</div>
              <div style={{background:B.offWhite,borderRadius:12,border:`1px solid ${B.grayLight}`,overflow:"hidden"}}>
                {[
                  ...(MILESTONES[call.id] || [
                    { label:"Atracado",              status:"pending", time:null, by:null },
                    { label:"Inicio de operaciones", status:"pending", time:null, by:null },
                    { label:"Fin de operaciones",    status:"pending", time:null, by:null },
                    { label:"Desatracado",           status:"pending", time:null, by:null },
                  ]),
                ].map((m, i, arr) => {
                  const done = m.status==="done"; const inProgress = m.status==="in_progress";
                  const icon = done ? "✅" : inProgress ? "🔄" : "⌛";
                  const rowBg = m.inProgress ? "rgba(245,158,11,0.06)" : B.white;
                  const borderColor = m.inProgress ? B.warning : B.grayLight;
                  return (
                    <div key={m.label} style={{
                      display:"flex", alignItems:"center", gap:12,
                      padding:"11px 16px",
                      background:rowBg,
                      borderBottom: i < arr.length-1 ? `1px solid ${B.grayLight}` : "none",
                      borderLeft: inProgress ? `3px solid ${B.warning}` : "3px solid transparent",
                    }}>
                      <span style={{fontSize:16, flexShrink:0}}>{icon}</span>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:12, fontWeight:700,
                          color: done ? B.navy : inProgress ? "#92400E" : B.gray}}>
                          {m.label}
                        </div>
                        {m.by && (
                          <div style={{fontSize:10, color:B.gray, marginTop:2}}>{m.by}</div>
                        )}
                      </div>
                      <div style={{textAlign:"right", flexShrink:0}}>
                        {m.time ? (
                          <div style={{fontSize:11, fontWeight:700,
                            color: done ? B.success : inProgress ? B.warning : B.gray,
                            fontFamily:"'Courier New', monospace"}}>
                            {m.time}
                          </div>
                        ) : (
                          <div style={{fontSize:10, color:B.grayLight, fontWeight:600}}>Pendiente</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agent */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:800,color:B.gray,letterSpacing:"0.08em",marginBottom:10}}>CONSIGNATARIO</div>
            <div style={{background:B.offWhite,borderRadius:12,padding:"12px 16px",
              fontSize:13,color:B.navy,fontWeight:600,border:`1px solid ${B.grayLight}`}}>{call.agent}</div>
          </div>

          {/* Movements */}
          <div>
            <div style={{fontSize:10,fontWeight:800,color:B.gray,letterSpacing:"0.08em",marginBottom:10}}>MOVIMIENTOS AUTORIZADOS</div>
            <div style={{background:B.offWhite,borderRadius:12,padding:"12px 16px",
              display:"flex",flexDirection:"column",gap:8,border:`1px solid ${B.grayLight}`}}>
              {[{tipo:"E",label:"Entrada",from:"Mar",to:`Muelle ${call.berth}`,done:call.status!=="Prevista"},
                {tipo:"S",label:"Salida",from:`Muelle ${call.berth}`,to:"Mar",done:false}
              ].map(m=>(
                <div key={m.tipo} style={{display:"flex",alignItems:"center",gap:10,
                  padding:"9px 12px",background:B.white,borderRadius:8,border:`1px solid ${B.grayLight}`}}>
                  <span style={{width:26,height:26,borderRadius:6,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:11,fontWeight:800,
                    background:m.tipo==="E"?B.cyanPale:"#FEF3C7",
                    color:m.tipo==="E"?B.navy:"#92400E"}}>{m.tipo}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:B.navy}}>{m.label}</div>
                    <div style={{fontSize:10,color:B.gray}}>{m.from} → {m.to}</div>
                  </div>
                  <span style={{fontSize:9,fontWeight:800,letterSpacing:"0.05em",
                    color:m.done?B.success:B.warning}}>{m.done?"EJECUTADO":"PREVISTO"}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {tab==="servicios"&&<>
          {hasTug?(
            <div>
              <div style={{fontSize:10,fontWeight:800,color:B.gray,letterSpacing:"0.08em",marginBottom:10}}>REMOLQUE</div>
              <div style={{background:B.offWhite,borderRadius:12,padding:18,border:`1px solid ${B.grayLight}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:B.navy}}>{TUG.tugboat}</div>
                    <div style={{fontSize:11,color:B.gray,marginTop:2}}>Parte nº 027892 · {TUG.powerPct}% potencia</div>
                  </div>
                  <span style={{padding:"3px 10px",borderRadius:99,fontSize:9,fontWeight:800,
                    letterSpacing:"0.05em",background:"#DCFCE7",color:"#166534"}}>
                    {TUG.status==="en_curso"?"⚠ EN CURSO":"COMPLETADO"}
                  </span>
                </div>
                <div style={{marginBottom:16}}>
                  {[
                    ["IR",  "Salida base",  TUG.times.ir_at_planned,  TUG.times.ir_at_real],
                    ["COS", "Al costado",   TUG.times.cos_at_planned, TUG.times.cos_at_real],
                    ["RC",  "Recoge cabo",  TUG.times.rc_at_planned,  TUG.times.rc_at_real],
                    ["SC",  "Sale costado", TUG.times.sc_at_planned,  TUG.times.sc_at_real],
                    ["FR",  "Llega a base", TUG.times.fr_at_planned,  TUG.times.fr_at_real],
                  ].map(([c,l,p,r],i,a)=>(
                    <TugStep key={c} code={c} label={l} planned={p} real={r} last={i===a.length-1}/>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["Patrón",TUG.crew.patron],["Mecánico",TUG.crew.mecanico],["Marinero",TUG.crew.marinero]].map(([r,n])=>(
                    <div key={r} style={{background:B.white,borderRadius:8,padding:"8px 10px",border:`1px solid ${B.grayLight}`}}>
                      <div style={{fontSize:9,color:B.gray,fontWeight:800,letterSpacing:"0.05em"}}>{r.toUpperCase()}</div>
                      <div style={{fontSize:12,color:B.navy,fontWeight:700,marginTop:2}}>{n}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ):(
            <div style={{background:B.offWhite,borderRadius:12,padding:32,textAlign:"center",
              color:B.gray,border:`1px solid ${B.grayLight}`}}>
              <div style={{fontSize:28,marginBottom:8}}>📋</div>
              <div style={{fontSize:13,fontWeight:600}}>Sin servicios registrados aún</div>
            </div>
          )}
        </>}

        {tab==="documentos"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {hasTug&&(
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                background:B.offWhite,borderRadius:10,border:`1px solid ${B.grayLight}`}}>
                <div style={{width:38,height:38,background:B.cyanPale,borderRadius:8,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📄</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:B.navy}}>Parte de remolque nº 027892</div>
                  <div style={{fontSize:11,color:B.gray}}>Recibido vía WhatsApp · 11/05/2026 · OCR completado</div>
                </div>
                <span style={{fontSize:9,fontWeight:800,color:B.success,background:"#DCFCE7",
                  padding:"3px 8px",borderRadius:6,letterSpacing:"0.04em"}}>✓ OCR</span>
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
              background:B.offWhite,borderRadius:10,border:`1px solid ${B.grayLight}`}}>
              <div style={{width:38,height:38,background:"#EDE9FE",borderRadius:8,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📋</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:B.navy}}>NOA · {call.id}</div>
                <div style={{fontSize:11,color:B.gray}}>Notice of Arrival · AP Alicante</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const counts = {
    total:    CALLS.length,
    iniciado: CALLS.filter(c=>c.status==="Iniciado").length,
    prevista: CALLS.filter(c=>c.status==="Prevista").length,
    alerta:   CALLS.filter(c=>c.status==="Alerta").length,
  };

  const filtered = CALLS.filter(c=>{
    const q=search.toLowerCase();
    const ms=!search||c.name.toLowerCase().includes(q)||c.imo.includes(q)||
      c.id.toLowerCase().includes(q)||c.agent.toLowerCase().includes(q);
    const mf=filter==="Todas"||(filter==="Iniciado"&&(c.status==="Iniciado"||c.status==="Alerta"))||
      (filter==="Alerta"&&c.status==="Alerta")||(filter==="Prevista"&&c.status==="Prevista");
    return ms&&mf;
  });

  return (
    <div style={{fontFamily:"'Nunito',system-ui,sans-serif",background:B.offWhite,minHeight:"100vh",color:B.dark}}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <div style={{background:B.navyDeep,height:52,display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"0 24px",flexShrink:0,
        boxShadow:"0 1px 0 rgba(7,159,230,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <Logo size={36}/>
            <span style={{color:B.white,fontWeight:800,fontSize:16,letterSpacing:"-0.01em",fontFamily:"'Nunito',sans-serif"}}>NauticOps</span>
          </div>
          <div style={{width:1,height:20,background:"rgba(255,255,255,0.12)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:700,letterSpacing:"0.05em"}}>PARA</span>
            <LogoAPA height={20}/>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {counts.alerta>0&&(
            <span style={{background:"rgba(239,68,68,0.15)",color:"#FCA5A5",padding:"3px 10px",
              borderRadius:99,fontSize:9,fontWeight:800,letterSpacing:"0.06em",
              border:"1px solid rgba(239,68,68,0.3)"}}>
              ⚠ {counts.alerta} ALERTA ACTIVA
            </span>
          )}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:B.success,
              boxShadow:`0 0 6px ${B.success}`,display:"inline-block"}}/>
            <span style={{color:"rgba(255,255,255,0.45)",fontSize:10,fontWeight:700}}>EN VIVO · 11/05/2026</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:B.white,borderBottom:`1px solid ${B.grayLight}`,
        padding:"14px 24px",display:"flex",alignItems:"center",
        boxShadow:"0 1px 6px rgba(1,11,36,0.05)"}}>
        {[
          {label:"ESCALAS TOTALES", value:counts.total,    color:B.navy   },
          {label:"EN PUERTO",       value:counts.iniciado, color:B.success },
          {label:"CON ALERTA",      value:counts.alerta,   color:B.danger  },
          {label:"PREVISTAS",       value:counts.prevista, color:B.cyan    },
        ].map((s,i)=>(
          <div key={s.label} style={{paddingRight:28,marginRight:28,
            borderRight:i<3?`1px solid ${B.grayLight}`:"none"}}>
            <div style={{fontSize:9,fontWeight:800,color:B.gray,letterSpacing:"0.08em",marginBottom:2}}>{s.label}</div>
            <div style={{fontSize:28,fontWeight:900,color:s.color,lineHeight:1}}>{s.value}</div>
          </div>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:12,color:B.gray}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Buque, IMO, agente…"
              style={{paddingLeft:32,paddingRight:12,paddingTop:7,paddingBottom:7,
                borderRadius:8,border:`1px solid ${B.grayLight}`,fontSize:12,
                outline:"none",width:200,background:B.offWhite,fontFamily:"inherit",color:B.dark}}/>
          </div>
          {[{k:"Todas",l:"Todas",n:counts.total},
            {k:"Iniciado",l:"En puerto",n:counts.iniciado+counts.alerta},
            {k:"Alerta",l:"⚠ Alertas",n:counts.alerta},
            {k:"Prevista",l:"Previstas",n:counts.prevista}
          ].map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} style={{
              padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",
              fontSize:11,fontWeight:800,fontFamily:"inherit",letterSpacing:"0.02em",
              background:filter===f.k?(f.k==="Alerta"?B.danger:B.navy):B.offWhite,
              color:filter===f.k?B.white:B.gray}}>
              {f.l} <span style={{opacity:0.6,fontWeight:600}}>({f.n})</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{padding:"20px 24px"}}>
        {/* Alert banner */}
        {counts.alerta>0&&(
          <div style={{background:"rgba(127,29,29,0.95)",border:`1px solid ${B.danger}`,borderRadius:10,
            padding:"10px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:18}}>⚠</span>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#FCA5A5",letterSpacing:"0.04em"}}>ALERTA OPERATIVA ACTIVA</div>
              <div style={{fontSize:11,color:"rgba(252,165,165,0.8)",marginTop:2}}>
                WEC MAJORELLE · Muelle 23 · +4h 15min · NIEVES B y SPIRIT potencialmente afectadas
              </div>
            </div>
            <button onClick={()=>setSelected(CALLS.find(c=>c.status==="Alerta"))}
              style={{marginLeft:"auto",background:"rgba(239,68,68,0.2)",border:`1px solid ${B.danger}`,
                color:"#FCA5A5",borderRadius:7,padding:"5px 14px",cursor:"pointer",
                fontSize:11,fontWeight:800,fontFamily:"inherit"}}>
              Ver detalle →
            </button>
          </div>
        )}

        <div style={{background:B.white,borderRadius:12,border:`1px solid ${B.grayLight}`,
          overflow:"hidden",boxShadow:"0 1px 6px rgba(1,11,36,0.06)"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:B.navyDeep}}>
                {["ESCALA","ESTADO","BUQUE","GT","MUELLE","OPERACIÓN","ETA","ETD","AGENTE"].map(h=>(
                  <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:9,fontWeight:800,
                    color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c,i)=>{
                const isSel=selected?.id===c.id;
                const isAl=c.status==="Alerta";
                const isAffected = !!c.affectedBy;
                const affectRisk = c.affectRisk==="ALTO"  ? { label:"Impacto ALTO",  color:"#DC2626", bg:"#FEE2E2" }
                                 : c.affectRisk==="MEDIO" ? { label:"Impacto MEDIO", color:"#D97706", bg:"#FEF3C7" }
                                 : null;
                return (
                  <tr key={c.id}
                    onClick={()=>setSelected(isSel?null:c)}
                    style={{
                      borderBottom:i<filtered.length-1?`1px solid ${B.grayLight}`:"none",
                      background:isSel?B.cyanPale:isAl?"#FFF1F1":isAffected?"#FFFBEB":i%2===0?B.white:B.offWhite,
                      cursor:"pointer",transition:"background 0.1s",
                      borderLeft:isAl?`3px solid ${B.danger}`:isAffected?`3px solid ${B.warning}`:"3px solid transparent"}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=B.cyanPale}}
                    onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=isAl?"#FFF1F1":isAffected?"#FFFBEB":i%2===0?B.white:B.offWhite}}>
                    <td style={{padding:"11px 14px",fontSize:11,fontFamily:"'Courier New',monospace",color:B.gray,fontWeight:600}}>{c.id}</td>
                    <td style={{padding:"11px 14px"}}><Badge status={c.status}/></td>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{fontWeight:800,fontSize:13,color:isAl?B.danger:B.navy}}>{c.name}</div>
                      <div style={{fontSize:10,color:B.gray,marginTop:1,display:"flex",alignItems:"center",gap:5}}>
                        <span>IMO {c.imo}</span>
                        {isAffected && affectRisk && (
                          <span style={{padding:"1px 6px",borderRadius:4,fontSize:9,fontWeight:800,
                            background:affectRisk.bg,color:affectRisk.color,letterSpacing:"0.04em"}}>
                            ⚠ {affectRisk.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{padding:"11px 14px",fontSize:12,color:B.gray,fontWeight:600}}>{c.gt.toLocaleString()}</td>
                    <td style={{padding:"11px 14px"}}>
                      <span style={{padding:"4px 10px",borderRadius:6,
                        background:isAffected?(isSel?B.white:"#FEF3C7"):isSel?B.white:B.grayLight,
                        fontSize:12,fontWeight:800,
                        color:isAffected?B.warning:B.navy}}>{c.berth}</span>
                    </td>
                    <td style={{padding:"11px 14px"}}><OpTag op={c.op}/></td>
                    <td style={{padding:"11px 14px",fontSize:11,color:B.gray,whiteSpace:"nowrap"}}>{fmt(c.eta)}</td>
                    <td style={{padding:"11px 14px",fontSize:11,color:B.gray,whiteSpace:"nowrap"}}>{fmt(c.etd)}</td>
                    <td style={{padding:"11px 14px",fontSize:10,color:B.gray,maxWidth:160}}>
                      <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.agent}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&(
            <div style={{padding:48,textAlign:"center",color:B.gray}}>
              <div style={{fontSize:28,marginBottom:8}}>🔍</div>
              <div style={{fontSize:13,fontWeight:600}}>Sin resultados</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo size={22}/>
            <span style={{fontSize:9,color:B.gray,fontWeight:700,letterSpacing:"0.03em"}}>×</span>
            <LogoAPA height={16}/>
          </div>
          <span style={{fontSize:10,color:B.gray}}>{`${META.source} · Actualización cada ${META.refreshHours}h`}</span>
        </div>
      </div>

      {selected&&<>
        <div onClick={()=>setSelected(null)}
          style={{position:"fixed",inset:0,background:"rgba(1,11,36,0.45)",zIndex:99}}/>
        <Detail call={selected} onClose={()=>setSelected(null)}/>
      </>}
    </div>
  );
}