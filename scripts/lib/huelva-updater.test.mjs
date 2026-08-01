import { describe, it, expect, vi, afterEach } from "vitest";
import {
  ALERT_DELAY,
  parseDate,
  parseDateParts,
  isStillActive,
  buildAlertScenario,
} from "./huelva-updater.mjs";

afterEach(() => vi.useRealTimers());

describe("parseDate / parseDateParts", () => {
  it("convierte el formato del informe de prácticos a ISO local", () => {
    expect(parseDate("16/05/2026 08:30")).toBe("2026-05-16T08:30");
    expect(parseDate("16/05/2026 8:30")).toBe("2026-05-16T08:30"); // hora sin cero
  });

  it("devuelve null ante lo que no reconoce", () => {
    expect(parseDate("2026-05-16 08:30")).toBeNull();
    expect(parseDate("16/05/2026")).toBeNull(); // sin hora
    expect(parseDate("")).toBeNull();
    expect(parseDate(null)).toBeNull();
  });

  it("parseDateParts asume medianoche cuando falta la hora", () => {
    expect(parseDateParts("16/05/2026", "")).toBe("2026-05-16T00:00");
    expect(parseDateParts("16/05/2026", "08:30")).toBe("2026-05-16T08:30");
    expect(parseDateParts("", "08:30")).toBeNull();
  });
});

describe("isStillActive", () => {
  it("una escala sin ETD se considera activa (no se descarta por falta de dato)", () => {
    expect(isStillActive(null)).toBe(true);
    expect(isStillActive("")).toBe(true);
  });

  it("compara la ETD contra el momento actual", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-16T12:00:00"));
    expect(isStillActive("2026-05-16T18:00")).toBe(true);
    expect(isStillActive("2026-05-16T06:00")).toBe(false);
  });
});

describe("buildAlertScenario — el escenario de demo", () => {
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

  it("elige el par que comparte muelle y encadena el impacto", () => {
    const iniciado = call({ id: "H1", status: "Iniciado", name: "PRIMERO", berth: "JGV" });
    const previsto = call({ id: "H2", status: "Prevista", name: "SEGUNDO", berth: "JGV" });
    const calls = [iniciado, previsto];

    const r = buildAlertScenario(calls);

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

    const r = buildAlertScenario([iniciado, otro]);

    expect(r.alertId).toBe("H1");
    expect(r.affectedName).toBeUndefined();
    expect(otro.affectedBy).toBeUndefined();
  });

  it("ignora los muelles sin asignar al buscar la cascada", () => {
    const iniciado = call({ id: "H1", status: "Iniciado", berth: "—" });
    const previsto = call({ id: "H2", status: "Prevista", berth: "—" });

    const r = buildAlertScenario([iniciado, previsto]);

    // Cae al fallback: marca el Iniciado, pero sin encadenar por un muelle que no existe.
    expect(r.alertId).toBe("H1");
    expect(previsto.affectedBy).toBeUndefined();
  });

  it("SIN ninguna escala 'Iniciado' devuelve null y no marca nada", () => {
    // Este es exactamente el estado en que quedó Alicante —cuyo script comparte esta
    // lógica— y por el que su data.json se quedó sin campos de alerta: si no hay
    // ningún buque en puerto, el escenario no se genera. La demo se queda sin el
    // guion comercial, y en silencio.
    const calls = [call({ id: "H1" }), call({ id: "H2" })];
    expect(buildAlertScenario(calls)).toBeNull();
    for (const c of calls) {
      expect(c.status).toBe("Prevista");
      expect(c.delay).toBeUndefined();
    }
  });

  it("describe la incidencia según el tipo de operación", () => {
    const descarga = call({ id: "H1", status: "Iniciado", op: "D/Contenedores" });
    expect(buildAlertScenario([descarga]) && descarga.alertNote).toContain("descarga");

    const carga = call({ id: "H2", status: "Iniciado", op: "C/Granel" });
    expect(buildAlertScenario([carga]) && carga.alertNote).toContain("carga");

    const bunker = call({ id: "H3", status: "Iniciado", op: "Bunkering" });
    expect(buildAlertScenario([bunker]) && bunker.alertNote).toContain("operaciones");
  });

  it("genera hitos coherentes con la incidencia", () => {
    const iniciado = call({ id: "H1", status: "Iniciado" });
    const r = buildAlertScenario([iniciado]);
    const hitos = r.milestones["H1"];

    expect(hitos.map((h) => h.status)).toEqual(["done", "done", "in_progress", "pending"]);
    expect(hitos[2].label).toBe("Fin de operaciones");
    expect(hitos[2].time).toContain("incidencia");
    expect(hitos[1].by).toContain("Perez");
  });

  it("con la lista vacía devuelve null en vez de romper", () => {
    expect(buildAlertScenario([])).toBeNull();
  });
});
