import "@testing-library/jest-dom";

// `setupFiles` es global, pero los tests de `scripts/**` corren con
// `@vitest-environment node` — ahí no hay `window` y tocarlo reventaría la carga.
// Solo se prepara el DOM cuando lo hay.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}
