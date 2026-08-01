import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe("LanguageContext", () => {
  it("arranca en inglés, no en castellano", () => {
    // Contraintuitivo para una web dirigida al mercado español, y fácil de "corregir"
    // por error: el idioma por defecto es una decisión, no un descuido.
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe("en");
  });

  it("cambia el idioma y con él todo el árbol de traducciones", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    const enTitle = result.current.t.hero.title;

    act(() => result.current.setLanguage("es"));

    expect(result.current.language).toBe("es");
    expect(result.current.t.hero.title).not.toBe(enTitle);
    expect(result.current.t.nav.requestDemo).toBe("Solicitar Demo");
  });

  it("expone las claves que la home lee y que estuvieron vacías en producción", () => {
    // Se perdieron al sincronizar componentes sin sus traducciones (#80): la home
    // renderizó huecos durante tres meses. Que existan en ambos idiomas es el contrato.
    const { result } = renderHook(() => useLanguage(), { wrapper });
    for (const lang of ["en", "es"] as const) {
      act(() => result.current.setLanguage(lang));
      const t = result.current.t;
      expect(t.hero.supportingLine).toBeTruthy();
      expect(t.hero.ctaSecondaryHint).toBeTruthy();
      expect(t.nav.about).toBeTruthy();
      expect(t.cta.form.message).toBeTruthy();
      expect(t.cta.form.messagePlaceholder).toBeTruthy();
      expect(t.cta.form.errorFallback).toBeTruthy();
    }
  });

  it("falla ruidosamente si se usa fuera del provider", () => {
    // React vuelca el error no capturado + el aviso de error boundary: ~40 líneas de
    // stack en stdout y en el log de CI. Se acalla SOLO aquí, así que un console.error
    // inesperado en cualquier otro test se sigue viendo.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useLanguage())).toThrow(/LanguageProvider/);
    spy.mockRestore();
  });
});
