// @vitest-environment node
import { describe, it, expect } from "vitest";
import { ALERT_DELAY, buildAlertScenario } from "./alert-scenario.mjs";

/* Lo usan Alicante y Huelva. Antes era una copia por script, ya divergida, y la de
 * Alicante vivía dentro de un entrypoint: sin test y fuera de la medición. */

const call = (over) => ({
  id: "H1",
  status: "Prevista",
  name: "BUQUE",
  berth: "JGV",
  agent: "Perez",
  op: "D/Granel",
  eta: "2026-05-16T08:00",
  ...over,
});

describe("buildAlertScenario", () => {
  it("elige el par que comparte muelle y encadena el impacto", () => {
    const iniciado = call({ id: "H1", status: "Iniciado", name: "PRIMERO", berth: "JGV" });
    const previsto = call({ id: "H2", status: "Prevista", name: "SEGUNDO", berth: "JGV" });

    const r = buildAlertScenario([iniciado, previsto], { pilotLabel: "Práctico (Huelva)" });

    expect(r.alertId).toBe("H1");
    expect(r.affectedName).toBe("SEGUNDO");
    expect(iniciado.status).toBe("Alerta");
    expect(iniciado.delay).toBe(ALERT_DELAY);
    expect(iniciado.alertNote).toContain("JGV");
    expect(previsto.affectedBy).toBe("H1");
    expect(previsto.affectRisk).toBe("ALTO");
  });

  it("sin par que comparta muelle, marca el primer Iniciado y no afecta a nadie", () => {
    const iniciado = call({ id: "H1", status: "Iniciado", berth: "RSN" });
    const otro = call({ id: "H2", status: "Prevista", berth: "JGV" });

    const r = buildAlertScenario([iniciado, otro], {});

    expect(r.alertId).toBe("H1");
    expect(r.affectedName).toBeUndefined();
    expect(otro.affectedBy).toBeUndefined();
  });

  it("ignora los muelles sin asignar al buscar la cascada", () => {
    const iniciado = call({ id: "H1", status: "Iniciado", berth: "—" });
    const previsto = call({ id: "H2", status: "Prevista", berth: "—" });

    const r = buildAlertScenario([iniciado, previsto], {});

    expect(r.alertId).toBe("H1");
    expect(previsto.affectedBy).toBeUndefined();
  });

  it("SIN ninguna escala 'Iniciado' devuelve null y no marca nada", () => {
    // El estado real de Alicante hoy: 5 escalas, todas Prevista. El escenario no se
    // genera, su data.json se queda sin campos de alerta, y el guion comercial de la
    // demo —que empieza por "el barco en Alerta"— deja de existir. En silencio.
    const calls = [call({ id: "H1" }), call({ id: "H2" })];
    expect(buildAlertScenario(calls, {})).toBeNull();
    for (const c of calls) {
      expect(c.status).toBe("Prevista");
      expect(c.delay).toBeUndefined();
    }
  });

  it("con la lista vacía devuelve null en vez de romper", () => {
    expect(buildAlertScenario([], {})).toBeNull();
  });

  it("describe la incidencia según el tipo de operación", () => {
    const descarga = call({ id: "A", status: "Iniciado", op: "D/Contenedores" });
    buildAlertScenario([descarga], {});
    expect(descarga.alertNote).toContain("descarga");

    const carga = call({ id: "B", status: "Iniciado", op: "C/Granel" });
    buildAlertScenario([carga], {});
    expect(carga.alertNote).toContain("carga");

    // Cualquier otra operación cae en el texto genérico.
    const otra = call({ id: "C", status: "Iniciado", op: "Bunkering" });
    buildAlertScenario([otra], {});
    expect(otra.alertNote).toContain("operaciones");

    const sinOp = call({ id: "D", status: "Iniciado", op: "" });
    buildAlertScenario([sinOp], {});
    expect(sinOp.alertNote).toContain("operaciones");
  });

  it("firma el atraque con el práctico de cada puerto", () => {
    const apa = call({ id: "A", status: "Iniciado" });
    const r1 = buildAlertScenario([apa], { pilotLabel: "Práctico (APA)" });
    expect(r1.milestones["A"][0].by).toBe("Práctico (APA)");

    const huelva = call({ id: "H", status: "Iniciado" });
    const r2 = buildAlertScenario([huelva], { pilotLabel: "Práctico (Huelva)" });
    expect(r2.milestones["H"][0].by).toBe("Práctico (Huelva)");
  });

  it("cae a una etiqueta genérica si no se pasa la del puerto", () => {
    const c = call({ id: "X", status: "Iniciado" });
    const r = buildAlertScenario([c]);
    expect(r.milestones["X"][0].by).toBe("Práctico");
  });

  it("genera hitos coherentes con la incidencia", () => {
    const iniciado = call({ id: "H1", status: "Iniciado" });
    const r = buildAlertScenario([iniciado], {});
    const hitos = r.milestones["H1"];

    expect(hitos.map((h) => h.status)).toEqual(["done", "done", "in_progress", "pending"]);
    expect(hitos[2].label).toBe("Fin de operaciones");
    expect(hitos[2].time).toContain("incidencia");
    expect(hitos[1].by).toContain("Perez");
  });
});
