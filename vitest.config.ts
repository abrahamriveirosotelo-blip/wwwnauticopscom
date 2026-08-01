import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.{test,spec}.mjs"],

    coverage: {
      provider: "v8",
      // `text` para verlo en consola y en el log de CI; `lcov` porque es lo que
      // SonarCloud importa (#83). `json-summary` alimenta el umbral ratchet.
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "./coverage",

      // Se mide la superficie que queremos sostener con tests, no todo el repo: un
      // porcentaje diluido por código que nadie va a testear deja de significar nada.
      //
      // DENTRO — lógica de dominio y utilidades:
      //   scripts/lib/**        parsers de las AP, matching de VesselFinder, escenarios
      //   src/lib/**            utilidades y analítica
      //   src/hooks|contexts/** estado e integraciones
      //   demos/**/meteo.ts     helpers de meteo compartidos
      //
      // FUERA, y por qué:
      //   scripts/*.mjs         entrypoints: descargan, escriben fichero y poco más. Su
      //                         lógica vive en scripts/lib, que sí se mide. Cubrirlos
      //                         pide tests de integración con red simulada (otro ticket).
      //   src/components/**     marketing estático y shadcn/ui copiado de upstream.
      //   src/pages/**/Demo*    los TSX de las demos son UI; su lógica de dominio
      //                         (alertas derivadas) aún no es importable — ver #94.
      //   traducciones, arranque, config y generados.
      include: [
        "scripts/lib/**/*.mjs",
        "src/lib/**/*.ts",
        "src/hooks/**/*.ts",
        "src/contexts/**/*.tsx",
        "src/pages/demos/**/meteo.ts",
      ],
      exclude: ["src/lib/translations.ts", "src/lib/translations/**", "**/*.d.ts"],

      // Ratchet: solo puede subir. Si un PR baja la cobertura global, falla; si la
      // sube, se actualizan estos números en el mismo PR. El umbral real de
      // "≥80% en código nuevo" lo aplica SonarCloud (#83), no esto.
      thresholds: {
        statements: 64,
        lines: 64,
        branches: 82,
        functions: 70,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
