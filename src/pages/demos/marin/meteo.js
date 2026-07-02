/** Helpers de meteo compartidos por DemoMarin y SchedulePlayback (evita duplicar la paleta). */

/** Color por nivel de aviso AEMET (amarillo/naranja/rojo). */
export const nivelColor = n => n === "rojo" ? "#DC2626" : n === "naranja" ? "#F97316" : "#EAB308";

/** Punto de color (emoji) por nivel — para no depender solo del color (accesibilidad). */
export const nivelDot = n => n === "rojo" ? "🔴" : n === "naranja" ? "🟠" : "🟡";
