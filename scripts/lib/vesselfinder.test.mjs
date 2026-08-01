import { describe, it, expect, vi } from "vitest";
import {
  normName,
  destMatchesPort,
  destIsMarin,
  isCommercialType,
  destinationConfirms,
  matchVessel,
} from "./vesselfinder.mjs";

/* El enriquecimiento asigna IMO/GT/eslora a una escala a partir de una búsqueda por
 * NOMBRE, y los nombres de buque no son únicos. La regla del módulo es explícita:
 * ante la duda se deja degradado, nunca se asigna el IMO de otro barco. Estos tests
 * fijan esa regla, porque un fallo aquí no rompe nada visible: enseña datos ajenos
 * como si fueran del buque correcto. */

describe("normName", () => {
  it("normaliza acentos, mayúsculas y puntuación", () => {
    expect(normName("Marín")).toBe("MARIN");
    expect(normName("  cabo   de   gata ")).toBe("CABO DE GATA");
    expect(normName("BLUE-STAR.1")).toBe("BLUE STAR 1");
  });

  it("tolera vacío y nulos", () => {
    expect(normName("")).toBe("");
    expect(normName(null)).toBe("");
    expect(normName(undefined)).toBe("");
  });
});

describe("destIsMarin", () => {
  it("reconoce el topónimo y el LOCODE", () => {
    expect(destIsMarin("Marin, Pontevedra, Spain")).toBe(true);
    expect(destIsMarin("MARIN")).toBe(true);
    expect(destIsMarin("ESMAR")).toBe(true);
    expect(destIsMarin("ES MAR")).toBe(true); // VesselFinder lo parte a veces
  });

  it("NO confunde otros topónimos que contienen 'marin'", () => {
    // El caso que documenta el módulo: sin token-match, un substring daría match.
    expect(destIsMarin("MARINA DI CARRARA")).toBe(false);
    expect(destIsMarin("SAN MARINO")).toBe(false);
    expect(destIsMarin("MARINETTE")).toBe(false);
  });

  it("no toma un 'MAR' suelto por el LOCODE", () => {
    // "ES"+"MAR" debe ser contiguo; si no, Mar del Plata pasaría por Marín.
    expect(destIsMarin("MAR DEL PLATA")).toBe(false);
    expect(destIsMarin("MAR LIGURE")).toBe(false);
  });

  it("tolera destino vacío", () => {
    expect(destIsMarin("")).toBe(false);
    expect(destIsMarin(null)).toBe(false);
  });
});

describe("destMatchesPort", () => {
  it("compara por token completo, no por substring", () => {
    expect(destMatchesPort("Vigo, Spain", "VIGO")).toBe(true);
    expect(destMatchesPort("Marina di Carrara", "MARIN")).toBe(false);
  });

  it("ignora tokens cortos del puerto para no disparar falsos positivos", () => {
    // "DE" (2 letras) no debería bastar para dar por bueno un destino.
    expect(destMatchesPort("Puerto de Huelva", "DE")).toBe(false);
  });

  it("devuelve false si falta cualquiera de los dos", () => {
    expect(destMatchesPort("", "VIGO")).toBe(false);
    expect(destMatchesPort("Vigo", "")).toBe(false);
  });
});

describe("isCommercialType", () => {
  it("acepta mercantes", () => {
    expect(isCommercialType("Cargo")).toBe(true);
    expect(isCommercialType("Bulk Carrier")).toBe(true);
    expect(isCommercialType("Container Ship")).toBe(true);
  });

  it("descarta lo que no puede ser una escala comercial", () => {
    expect(isCommercialType("Pleasure Craft")).toBe(false);
    expect(isCommercialType("Sailing vessel")).toBe(false);
    expect(isCommercialType("")).toBe(false);
    expect(isCommercialType(null)).toBe(false);
  });
});

describe("destinationConfirms", () => {
  it("confirma un entrante cuyo destino AIS es Marín", () => {
    expect(destinationConfirms("Marin, Spain", { to: "ROTTERDAM" })).toBe(true);
  });

  it("confirma un saliente cuyo destino AIS coincide con el 'to' de la AP", () => {
    expect(destinationConfirms("Rotterdam", { to: "ROTTERDAM" })).toBe(true);
  });

  it("no confirma si el destino no tiene nada que ver", () => {
    expect(destinationConfirms("Hamburg", { to: "ROTTERDAM" })).toBe(false);
  });

  it("no confirma cuando la AP no publica destino", () => {
    // update-marin deja '—' cuando la AP no da el dato: no puede servir de confirmación.
    expect(destinationConfirms("Hamburg", { to: "—" })).toBe(false);
    expect(destinationConfirms("", { to: "ROTTERDAM" })).toBe(false);
  });
});

describe("matchVessel — el matching conservador", () => {
  const call = { name: "GLORIOUS", to: "ROTTERDAM" };
  const comercial = { imo: "9420796", name: "GLORIOUS", type: "Cargo", detailId: "1" };

  it("acepta el candidato cuando es el único comercial con ese nombre", async () => {
    const r = await matchVessel(call, [comercial], vi.fn());
    expect(r?.confidence).toBe("single-commercial");
    expect(r?.candidate.imo).toBe("9420796");
  });

  it("NO asigna nada si ningún candidato tiene IMO", async () => {
    const sinImo = { ...comercial, imo: null };
    expect(await matchVessel(call, [sinImo], vi.fn())).toBeNull();
  });

  it("NO asigna nada si el nombre no es exacto", async () => {
    const otro = { ...comercial, name: "GLORIOUS STAR" };
    expect(await matchVessel(call, [otro], vi.fn())).toBeNull();
  });

  it("NO asigna un buque de recreo aunque el nombre coincida", async () => {
    const recreo = { ...comercial, type: "Pleasure Craft" };
    expect(await matchVessel(call, [recreo], vi.fn())).toBeNull();
  });

  it("con dos homónimos, desambigua por destino confirmado", async () => {
    const a = { ...comercial, imo: "1111111", detailId: "a" };
    const b = { ...comercial, imo: "2222222", detailId: "b" };
    const fetchDetail = vi.fn(async (id) =>
      id === "b"
        ? { imo: "2222222", destination: "Marin, Spain" }
        : { imo: "1111111", destination: "Hamburg" },
    );
    const r = await matchVessel(call, [a, b], fetchDetail);
    expect(r?.confidence).toBe("destination-confirmed");
    expect(r?.candidate.imo).toBe("2222222");
  });

  it("con dos homónimos y ningún destino que confirme, NO elige — se queda degradado", async () => {
    const a = { ...comercial, imo: "1111111", detailId: "a" };
    const b = { ...comercial, imo: "2222222", detailId: "b" };
    const fetchDetail = vi.fn(async () => ({ imo: "9999999", destination: "Hamburg" }));
    expect(await matchVessel(call, [a, b], fetchDetail)).toBeNull();
  });

  it("no confía en una ficha sin IMO verificado aunque el destino cuadre", async () => {
    const a = { ...comercial, imo: "1111111", detailId: "a" };
    const b = { ...comercial, imo: "2222222", detailId: "b" };
    const fetchDetail = vi.fn(async () => ({ imo: null, destination: "Marin, Spain" }));
    expect(await matchVessel(call, [a, b], fetchDetail)).toBeNull();
  });

  it("si la ficha falla, sigue con el resto en vez de romper", async () => {
    const a = { ...comercial, imo: "1111111", detailId: "a" };
    const b = { ...comercial, imo: "2222222", detailId: "b" };
    const fetchDetail = vi.fn(async (id) => {
      if (id === "a") throw new Error("timeout");
      return { imo: "2222222", destination: "Marin, Spain" };
    });
    const r = await matchVessel(call, [a, b], fetchDetail);
    expect(r?.candidate.imo).toBe("2222222");
  });

  it("sin candidatos devuelve null", async () => {
    expect(await matchVessel(call, [], vi.fn())).toBeNull();
  });
});
