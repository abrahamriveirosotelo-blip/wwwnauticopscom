/** Helpers de meteo compartidos por DemoMarin y SchedulePlayback (evita duplicar la paleta). */

/** Color por nivel de aviso AEMET (amarillo/naranja/rojo). */
export const nivelColor = n => n === "rojo" ? "#DC2626" : n === "naranja" ? "#F97316" : "#EAB308";

/** Punto de color (emoji) por nivel — para no depender solo del color (accesibilidad). */
export const nivelDot = n => n === "rojo" ? "🔴" : n === "naranja" ? "🟠" : "🟡";

/** URL segura para usar como href: solo http/https. Devuelve la URL saneada o null.
 *  aviso.web viene de un feed externo (AEMET); limitar el esquema evita que un valor
 *  inesperado (p. ej. "javascript:…") se convierta en un enlace peligroso (XSS). */
export const safeHttpUrl = u => {
  const s = typeof u === "string" ? u.trim() : "";
  return /^https?:\/\//i.test(s) ? s : null;
};
