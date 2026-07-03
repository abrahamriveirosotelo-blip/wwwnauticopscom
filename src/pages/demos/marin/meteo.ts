/** Helpers de meteo compartidos por DemoMarin y SchedulePlayback (evita duplicar la paleta). */

export type Nivel = "amarillo" | "naranja" | "rojo";

/** Color por nivel de aviso AEMET (amarillo/naranja/rojo). */
export const nivelColor = (n: Nivel | string): string =>
  n === "rojo" ? "#DC2626" : n === "naranja" ? "#F97316" : "#EAB308";

/** Punto de color (emoji) por nivel — para no depender solo del color (accesibilidad). */
export const nivelDot = (n: Nivel | string): string =>
  n === "rojo" ? "🔴" : n === "naranja" ? "🟠" : "🟡";

/** URL segura para usar como href: solo http/https. Devuelve la URL saneada o null.
 *  aviso.web viene de un feed externo (AEMET); limitar el esquema evita que un valor
 *  inesperado (p. ej. "javascript:…") se convierta en un enlace peligroso (XSS). */
export const safeHttpUrl = (u: unknown): string | null => {
  const s = typeof u === "string" ? u.trim() : "";
  return /^https?:\/\//i.test(s) ? s : null;
};

/** Severidad por nivel (rojo > naranja > amarillo) para elegir el aviso "peor". */
const NIVEL_RANK: Record<string, number> = { amarillo: 1, naranja: 2, rojo: 3 };

/** Aviso más severo de una lista (rojo > naranja > amarillo); null si está vacía/indefinida.
 *  Opera sobre cualquier objeto con `nivel`, así que sirve tanto para avisos como para las
 *  bandas del reproductor. Determinista: ante empate se queda con el primero de mayor nivel. */
export const worstAviso = <T extends { nivel?: string }>(list?: T[]): T | null =>
  list && list.length
    ? list.reduce((a, b) => ((NIVEL_RANK[b.nivel] || 0) > (NIVEL_RANK[a.nivel] || 0) ? b : a))
    : null;
