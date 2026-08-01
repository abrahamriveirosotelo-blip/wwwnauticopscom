// @vitest-environment node
// Estos helpers corren en Node puro dentro del cron: se testean en Node, no en jsdom.
import { describe, it, expect, vi, afterEach } from "vitest";
import { parseDate, parseDateParts, isStillActive } from "./huelva-updater.mjs";

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
