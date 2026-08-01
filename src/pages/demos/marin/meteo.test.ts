import { describe, it, expect } from "vitest";
import { nivelColor, nivelDot, safeHttpUrl, worstAviso } from "./meteo";

describe("safeHttpUrl", () => {
  // `aviso.web` viene del feed de AEMET y acaba en un href. Si un valor inesperado
  // pasara el filtro, sería un XSS a un clic de distancia.
  it("acepta http y https", () => {
    expect(safeHttpUrl("https://www.aemet.es/aviso")).toBe("https://www.aemet.es/aviso");
    expect(safeHttpUrl("http://www.aemet.es/aviso")).toBe("http://www.aemet.es/aviso");
  });

  it("rechaza esquemas peligrosos", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpUrl("JavaScript:alert(1)")).toBeNull();
    expect(safeHttpUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHttpUrl("vbscript:msgbox(1)")).toBeNull();
    expect(safeHttpUrl("file:///etc/passwd")).toBeNull();
  });

  it("rechaza lo que no es una URL utilizable", () => {
    expect(safeHttpUrl("")).toBeNull();
    expect(safeHttpUrl("   ")).toBeNull();
    expect(safeHttpUrl("www.aemet.es")).toBeNull(); // sin esquema
    expect(safeHttpUrl(null)).toBeNull();
    expect(safeHttpUrl(undefined)).toBeNull();
    expect(safeHttpUrl(42)).toBeNull();
    expect(safeHttpUrl({ href: "https://x.es" })).toBeNull();
  });

  it("no se deja engañar por espacios alrededor", () => {
    expect(safeHttpUrl("  https://www.aemet.es  ")).toBe("https://www.aemet.es");
    // Con espacio delante, "javascript:" seguiría siendo peligroso si no se recortara
    // antes de comprobar el esquema.
    expect(safeHttpUrl("  javascript:alert(1)")).toBeNull();
  });
});

describe("worstAviso", () => {
  const rojo = { nivel: "rojo", id: "r" };
  const naranja = { nivel: "naranja", id: "n" };
  const amarillo = { nivel: "amarillo", id: "a" };

  it("elige el nivel más severo", () => {
    expect(worstAviso([amarillo, rojo, naranja])).toBe(rojo);
    expect(worstAviso([amarillo, naranja])).toBe(naranja);
    expect(worstAviso([amarillo])).toBe(amarillo);
  });

  it("devuelve null sin avisos", () => {
    expect(worstAviso([])).toBeNull();
    expect(worstAviso(undefined)).toBeNull();
  });

  it("ante empate se queda con el primero (determinista)", () => {
    const a = { nivel: "naranja", id: "primero" };
    const b = { nivel: "naranja", id: "segundo" };
    expect(worstAviso([a, b])).toBe(a);
  });

  it("trata un nivel desconocido o ausente como el menos severo", () => {
    const raro = { nivel: "fucsia", id: "raro" };
    // `nivel` opcional: así es como llega una banda del reproductor sin aviso asociado.
    const sinNivel: { nivel?: string; id: string } = { id: "sin" };
    expect(worstAviso([raro, amarillo])).toBe(amarillo);
    expect(worstAviso([sinNivel, amarillo])).toBe(amarillo);
    // Si solo hay desconocidos, sigue devolviendo uno en vez de romper.
    expect(worstAviso([raro])).toBe(raro);
  });
});

describe("nivelColor / nivelDot", () => {
  it("mapea los tres niveles de AEMET", () => {
    expect(nivelColor("rojo")).toBe("#DC2626");
    expect(nivelColor("naranja")).toBe("#F97316");
    expect(nivelColor("amarillo")).toBe("#EAB308");
    expect(nivelDot("rojo")).toBe("🔴");
    expect(nivelDot("naranja")).toBe("🟠");
    expect(nivelDot("amarillo")).toBe("🟡");
  });

  it("cae a amarillo ante un nivel que AEMET no debería mandar", () => {
    expect(nivelColor("fucsia")).toBe("#EAB308");
    expect(nivelColor("")).toBe("#EAB308");
    expect(nivelDot("fucsia")).toBe("🟡");
  });
});
