import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  titleCase,
  yearFromEscala,
  parseMarinDate,
  parseMarinFreshness,
  parseMarinPage,
  buildCalls,
} from "./marin-updater.mjs";

const fixture = (n) => readFileSync(resolve(import.meta.dirname, "../fixtures", n), "utf-8");

describe("parseMarinPage — contra el HTML real de apmarin.com", () => {
  // Las fixtures son capturas reales de las dos tablas. Si la AP cambia la estructura,
  // estos tests fallan aquí y no en producción tres horas después.
  const esperados = parseMarinPage(fixture("marin-esperados.html"));
  const puerto = parseMarinPage(fixture("marin-puerto.html"));

  it("distingue la tabla de esperados (ETA) de la de en puerto (ETD)", () => {
    expect(esperados.kind).toBe("eta");
    expect(puerto.kind).toBe("etd");
  });

  it("extrae filas con el código de escala como clave", () => {
    expect(esperados.rows.length).toBeGreaterThan(0);
    for (const r of esperados.rows) {
      expect(r.escala).toMatch(/^[A-Z]\d{4}/);
      expect(r.name).toBeTruthy();
    }
  });

  it("no cuela la cabecera como si fuera una escala", () => {
    const nombres = esperados.rows.map((r) => r.name.toUpperCase());
    expect(nombres).not.toContain("BUQUE");
    expect(nombres).not.toContain("ORIGEN");
  });

  it("lee la frescura que publica la AP", () => {
    expect(esperados.freshness).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it("revienta con mensaje claro si desaparece la tabla", () => {
    expect(() => parseMarinPage("<html><body>mantenimiento</body></html>")).toThrow(/estilo1/);
  });
});

describe("parseMarinFreshness", () => {
  it("lee el h4 con fecha y hora", () => {
    expect(parseMarinFreshness("<h4>5/7/2026 9:05</h4>")).toBe("2026-07-05T09:05");
  });

  it("devuelve null si el h4 no está (estructura cambiada)", () => {
    expect(parseMarinFreshness("<h4>sin fecha</h4>")).toBeNull();
    expect(parseMarinFreshness("")).toBeNull();
  });
});

describe("yearFromEscala / parseMarinDate / titleCase", () => {
  it("saca el año del propio código de escala en vez de adivinarlo", () => {
    expect(yearFromEscala("M2026000123", 1999)).toBe(2026);
    expect(yearFromEscala("", 2026)).toBe(2026); // fallback
    expect(yearFromEscala(null, 2026)).toBe(2026);
  });

  it("compone la fecha ISO local a partir de DD/MM HH:MM", () => {
    expect(parseMarinDate("25/06 20:00", 2026)).toBe("2026-06-25T20:00");
    expect(parseMarinDate("5/6 9:05", 2026)).toBe("2026-06-05T09:05");
  });

  it("devuelve null ante un formato que no reconoce", () => {
    expect(parseMarinDate("25-06 20:00", 2026)).toBeNull();
    expect(parseMarinDate("", 2026)).toBeNull();
    expect(parseMarinDate(null, 2026)).toBeNull();
  });

  it("normaliza consignatarias y marca las vacías con guion", () => {
    expect(titleCase("PEREZ Y CIA")).toBe("Perez Y Cia");
    expect(titleCase("   ")).toBe("—");
    expect(titleCase(null)).toBe("—");
  });
});

describe("buildCalls — el cruce de las dos tablas", () => {
  const row = (over = {}) => ({
    name: "GLORIOUS",
    from: "VIGO",
    to: "ROTTERDAM",
    escala: "M2026000123",
    agent: "Perez Y Cia",
    berth: "Comercio",
    norays: "1-5",
    op: "D/Granel",
    when: "25/06 20:00",
    ...over,
  });

  it("marca 'Iniciado' lo que aparece en la tabla de en puerto", () => {
    const calls = buildCalls({ rows: [] }, { rows: [row()] }, [], 2026);
    expect(calls[0].status).toBe("Iniciado");
    expect(calls[0].etd).toBe("2026-06-25T20:00");
  });

  it("deja 'Prevista' lo que solo está en esperados", () => {
    const calls = buildCalls({ rows: [row()] }, { rows: [] }, [], 2026);
    expect(calls[0].status).toBe("Prevista");
    expect(calls[0].eta).toBe("2026-06-25T20:00");
  });

  it("recupera del JSON anterior la ETA que la tabla actual ya no trae", () => {
    // Un buque atracado desaparece de "esperados": sin esto perdería su ETA y la
    // demo mostraría "ETA —" para todo lo que ya está en puerto.
    const prev = [{ id: "M2026000123", eta: "2026-06-24T08:00", etd: "" }];
    const calls = buildCalls({ rows: [] }, { rows: [row()] }, prev, 2026);
    expect(calls[0].eta).toBe("2026-06-24T08:00");
    expect(calls[0].etd).toBe("2026-06-25T20:00");
  });

  it("arrastra el enriquecimiento previo para que un enrich fallido no lo borre", () => {
    const prev = [{ id: "M2026000123", imo: "9420796", gt: 12345, flag: "Spain" }];
    const calls = buildCalls({ rows: [] }, { rows: [row()] }, prev, 2026);
    expect(calls[0].imo).toBe("9420796");
    expect(calls[0].gt).toBe(12345);
    expect(calls[0].flag).toBe("Spain");
  });

  it("conserva los 0 válidos del enriquecimiento (aisSpeed 0 = atracado)", () => {
    // Con una comprobación de veracidad en vez de != null, un buque atracado
    // perdería su velocidad 0 y parecería que no hay dato.
    const prev = [{ id: "M2026000123", aisSpeed: 0, aisCog: 0 }];
    const calls = buildCalls({ rows: [] }, { rows: [row()] }, prev, 2026);
    expect(calls[0].aisSpeed).toBe(0);
    expect(calls[0].aisCog).toBe(0);
  });

  it("la fila de en puerto pisa los datos de la de esperados", () => {
    const calls = buildCalls(
      { rows: [row({ berth: "Fondeo", op: "—" })] },
      { rows: [row({ berth: "Comercio", op: "D/Granel" })] },
      [],
      2026,
    );
    expect(calls).toHaveLength(1); // misma escala, un solo registro
    expect(calls[0].berth).toBe("Comercio");
  });

  it("corrige el cambio de año cuando la ETD cae antes que la ETA", () => {
    const calls = buildCalls(
      { rows: [row({ when: "30/12 22:00" })] },
      { rows: [row({ when: "02/01 06:00" })] },
      [],
      2026,
    );
    expect(calls[0].eta).toBe("2026-12-30T22:00");
    expect(calls[0].etd).toBe("2027-01-02T06:00");
  });

  it("ordena por ETA, y por ETD si no hay ETA", () => {
    const calls = buildCalls(
      {
        rows: [
          row({ escala: "M2026000002", when: "26/06 10:00" }),
          row({ escala: "M2026000001", when: "25/06 10:00" }),
        ],
      },
      { rows: [] },
      [],
      2026,
    );
    expect(calls.map((c) => c.id)).toEqual(["M2026000001", "M2026000002"]);
  });

  it("no inventa alertas: ninguna escala sale con campos de incidencia", () => {
    // El escenario de demo se retiró a propósito; solo una fuente real debe marcarlos.
    const calls = buildCalls({ rows: [row()] }, { rows: [row()] }, [], 2026);
    for (const c of calls) {
      expect(c.status).not.toBe("Alerta");
      expect(c.delay).toBeUndefined();
      expect(c.affectRisk).toBeUndefined();
    }
  });
});
