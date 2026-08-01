/**
 * Escenario de alerta de las demos, compartido por Alicante y Huelva.
 *
 * Vivía duplicado: `update-alicante.mjs` tenía su propia copia privada y las dos ya
 * habían divergido (la etiqueta del práctico, y una rama muerta en la de Huelva). Al
 * estar dentro de un entrypoint, la copia de Alicante quedaba además fuera de la
 * medición de cobertura: sin test y sin medir. Aquí se testea una vez y sirve a las dos.
 *
 * OJO: esto FABRICA una incidencia para que la demo tenga algo que enseñar. Marín ya no
 * lo hace — allí las alertas solo se marcan cuando una fuente real detecta una
 * discrepancia. Cuando exista esa detección para Alicante y Huelva, esto se retira.
 */

export const ALERT_DELAY = "+4h 30min";

function fmtMilestoneTime(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Elige una escala en puerto y la marca en incidencia, encadenando el impacto a la
 * siguiente que espera ese mismo muelle. MUTA `calls` en el sitio.
 *
 * Devuelve null —sin tocar nada— si no hay ninguna escala "Iniciado": sin buque en
 * puerto no hay incidencia que contar. Es un caso real, no teórico: es el estado en el
 * que está Alicante hoy, y por el que su demo se quedó sin el guion comercial.
 *
 * @param calls       escalas del data.json
 * @param pilotLabel  quién firma el hito de atraque ("Práctico (APA)" / "(Huelva)")
 */
export function buildAlertScenario(calls, { pilotLabel } = {}) {
  const by = pilotLabel || "Práctico";
  let alertCall = null;
  let affectedCall = null;

  // Par ideal: un buque en puerto que bloquea el muelle a otro ya previsto (cascada).
  for (const c of calls.filter((c) => c.status === "Iniciado")) {
    if (c.berth === "—") continue;
    const next = calls.find((x) => x.status === "Prevista" && x.berth === c.berth);
    if (next) {
      alertCall = c;
      affectedCall = next;
      break;
    }
  }
  // Sin cascada: basta con el primer buque en puerto.
  if (!alertCall) alertCall = calls.find((c) => c.status === "Iniciado");
  if (!alertCall) return null;

  const op = alertCall.op || "";
  const opCtx = op.startsWith("D/") ? "descarga" : op.startsWith("C/") ? "carga" : "operaciones";

  alertCall.status = "Alerta";
  alertCall.delay = ALERT_DELAY;
  alertCall.alertNote = `Incidencia en ${opCtx}. El buque no liberará el Muelle ${alertCall.berth} según lo previsto.`;

  if (affectedCall) {
    affectedCall.affectedBy = alertCall.id;
    affectedCall.affectRisk = "ALTO";
  }

  const etaMs = new Date(alertCall.eta).getTime();
  const milestones = {
    [alertCall.id]: [
      { label: "Atracado", status: "done", time: fmtMilestoneTime(etaMs + 25 * 60000), by },
      {
        label: "Inicio de operaciones",
        status: "done",
        time: fmtMilestoneTime(etaMs + 90 * 60000),
        by: `Agente: ${alertCall.agent}`,
      },
      {
        label: "Fin de operaciones",
        status: "in_progress",
        time: "En curso — con incidencia",
        by: null,
      },
      { label: "Desatracado", status: "pending", time: null, by: null },
    ],
  };

  return {
    alertId: alertCall.id,
    alertName: alertCall.name,
    affectedName: affectedCall?.name,
    milestones,
  };
}
