/** Helpers de meteo compartidos por DemoMarin y SchedulePlayback (evita duplicar la paleta). */

/** Color por nivel de aviso AEMET. `nivel` viene de datos externos (AEMET/JSON): se acepta
 *  cualquier string y se cae a amarillo para valores no reconocidos. */
export const nivelColor = (n: string): string =>
  n === "rojo" ? "#DC2626" : n === "naranja" ? "#F97316" : "#EAB308";

/** Punto de color (emoji) por nivel — para no depender solo del color (accesibilidad). */
export const nivelDot = (n: string): string =>
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
/** Rango de un nivel; 0 si falta o no se reconoce (sin coerción de undefined a clave). */
const rank = (n?: string): number => (n ? NIVEL_RANK[n] : undefined) ?? 0;

/** Aviso más severo de una lista (rojo > naranja > amarillo); null si está vacía/indefinida.
 *  Opera sobre cualquier objeto con `nivel`, así que sirve tanto para avisos como para las
 *  bandas del reproductor. Determinista: ante empate se queda con el primero de mayor nivel. */
export const worstAviso = <T extends { nivel?: string }>(list?: T[]): T | null =>
  list && list.length
    ? list.reduce((a, b) => (rank(b.nivel) > rank(a.nivel) ? b : a))
    : null;
