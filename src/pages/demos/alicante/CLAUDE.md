# NauticOps — Demo Puerto de Alicante

Mockup navegable del dashboard de operaciones portuarias de NauticOps, configurado con datos reales de la Autoridad Portuaria de Alicante (APA). Desarrollado para una demo comercial.

---

## Contexto del proyecto

NauticOps es una plataforma que conecta la información planificada de las autoridades portuarias con la ejecución real de los actores que operan en el muelle (remolcadores, prácticos, amarradores). La propuesta de valor central es pasar de **"escala anunciada"** a **"escala ejecutada"**.

Esta demo está pensada para una reunión con Esther María Estévez Yepes (`emestevez@puertoalicante.com`), que contactó a través del formulario de NauticOps para conocer el producto.

---

## Ficheros

```
DemoAlicante.tsx   — Componente React principal (solo UI y lógica)
data.json          — Todos los datos de la demo (escalas, servicios, hitos)
```

**Regla principal: los datos van en el JSON, nunca en el TSX.**  
Para actualizar la demo (cambiar escalas, estados, horarios, alertas) solo hay que tocar `data.json`.

---

## Estructura del JSON

### `meta`
Metadatos del puerto y la fuente de datos.

```json
{
  "port": "Alicante Port",
  "source": "puertoalicante.com · V_TC_ESCALAS.csv",
  "date": "11/05/2026",
  "refreshHours": 2
}
```

### `calls[]`
Array de escalas. Campos de cada escala:

| Campo        | Tipo    | Descripción                                              |
|--------------|---------|----------------------------------------------------------|
| `id`         | string  | Identificador de la AP (`A202600XXX`)                    |
| `status`     | string  | `"Iniciado"` / `"Prevista"` / `"Alerta"`                 |
| `imo`        | string  | Número IMO del buque                                     |
| `name`       | string  | Nombre del buque                                         |
| `gt`         | number  | Arqueo bruto (toneladas)                                 |
| `len`        | number  | Eslora en metros                                         |
| `berth`      | string  | Muelle asignado                                          |
| `agent`      | string  | Consignataria                                            |
| `op`         | string  | Tipo de operación                                        |
| `eta`        | string  | ISO 8601 — llegada prevista                              |
| `etd`        | string  | ISO 8601 — salida prevista                               |
| `from`       | string  | Puerto de origen                                         |
| `to`         | string  | Puerto de destino                                        |
| `delay`      | string? | Solo en `status: "Alerta"`. Ej: `"+4h 15min"`           |
| `alertNote`  | string? | Solo en `status: "Alerta"`. Descripción del problema     |
| `affectedBy` | string? | `id` de la escala que está causando el impacto           |
| `affectRisk` | string? | `"ALTO"` / `"MEDIO"`. Requiere `affectedBy`. (`"BAJO"` no está implementado en la UI) |

**Para simular una alerta:** cambiar `status` a `"Alerta"` y añadir `delay` y `alertNote`.  
**Para marcar una escala como afectada:** añadir `affectedBy` (id de la escala en alerta) y `affectRisk`.

### `tugService`
Datos del parte de remolque. El campo `callId` lo vincula a su escala.

```json
{
  "callId": "A202600322",
  "reportNumber": "027892",
  "tugboat": "HÉRCULES APA",
  "powerPct": 75,
  "rope": true,
  "shipEngine": false,
  "status": "en_curso",
  "crew": {
    "patron": "J. Martínez",
    "mecanico": "R. Soler",
    "marinero": "P. Ruiz"
  },
  "times": {
    "requested_at":  "06:45",
    "ir_at_planned":  "07:00",
    "ir_at_real":     "07:02",
    "cos_at_planned": "07:18",
    "cos_at_real":    "09:32",
    "rc_at_planned":  "07:21",
    "rc_at_real":     null,
    "sc_at_planned":  "07:52",
    "sc_at_real":     null,
    "fr_at_planned":  "08:05",
    "fr_at_real":     null
  }
}
```

`status` puede ser `"en_curso"` o `"completado"`. Cada evento tiene un par `_planned` / `_real`; los tiempos `_real` nulos aparecen como `—`. Si `_real` existe y difiere de `_planned`, la UI lo muestra en rojo con badge `⚠ tarde`.

> Para escalar a múltiples servicios, `tugService` deberá convertirse en un array `tugServices[]` y filtrar por `callId` en el componente.

### `milestones`
Hitos operativos por `callId`. Solo es necesario incluir escalas que tengan datos reales — las que no aparezcan mostrarán un estado por defecto todo en `"pending"`.

```json
{
  "A202600322": [
    { "label": "Atracado",              "status": "done",        "time": "11/05 · 08:42", "by": "Práctico J. Morales" },
    { "label": "Inicio de operaciones", "status": "in_progress", "time": "En curso",       "by": "Agente: A. Pérez"   },
    { "label": "Fin de operaciones",    "status": "pending",     "time": null,             "by": null                 },
    { "label": "Desatracado",           "status": "pending",     "time": null,             "by": null                 }
  ]
}
```

Valores posibles de `status` por hito: `"done"` ✅ / `"in_progress"` 🔄 / `"pending"` ⌛

---

## Componente JSX — estructura

```
DemoAlicante()
├── NAV — logo NauticOps + logo APA + indicador en vivo + badge de alerta
├── STATS — totales: escalas, en puerto, con alerta, previstas
├── ALERT BANNER — aparece automáticamente si hay escalas con status "Alerta"
├── TABLE — lista de escalas con filtros y buscador
│   └── fila de escala
│       ├── badge de estado (Iniciado / Prevista / Alerta)
│       ├── badge de impacto (Impacto ALTO / MEDIO) si affectedBy está presente
│       └── muelle destacado en naranja si la escala está afectada
└── Detail panel (drawer lateral, se abre al clicar una fila)
    ├── Header — nombre, IMO, GT, eslora, estado, muelle
    ├── Tab: Operación
    │   ├── Ruta origen → destino
    │   ├── Tiempos — grid 2×2: ETA / ATA / ETD / ATD
    │   ├── Hitos operativos — Atracado / Inicio ops / Fin ops / Desatracado
    │   ├── Consignatario
    │   └── Movimientos autorizados — Entrada / Salida
    ├── Tab: Servicios
    │   ├── Remolque — datos del parte (solo si tugService.callId === call.id)
    │   │   ├── Timeline IR → COS → RC → SC → FR (previsto vs real; tarda en rojo con badge ⚠)
    │   │   └── Tripulación (patrón, mecánico, marinero)
    │   └── Prácticos — "Sin datos recibidos" (placeholder)
    └── Tab: Documentos
        ├── Parte de remolque con estado OCR
        └── NOA
```

---

## Paleta de colores (Brand Guide NauticOps v1.0)

| Token        | Hex       | Uso                                         |
|--------------|-----------|---------------------------------------------|
| `navyDeep`   | `#010B24` | Fondo oscuro, nav, cabeceras de tabla        |
| `navy`       | `#0A1F3D` | Texto principal, botones activos             |
| `navyMid`    | `#0F3460` | Acento secundario                            |
| `cyan`       | `#079FE6` | Color principal de marca, CTAs               |
| `cyanLight`  | `#29B6F6` | Acento, badges, highlights                   |
| `cyanPale`   | `#E1F5FE` | Fondos de tarjetas, filas seleccionadas      |
| `offWhite`   | `#F7FAFD` | Fondo de página, filas alternas              |
| `grayLight`  | `#E2EBF4` | Bordes, separadores                          |
| `gray`       | `#64748B` | Texto secundario, labels, metadatos          |
| `success`    | `#00C896` | Tiempos reales confirmados, hitos completados|
| `warning`    | `#F59E0B` | Alertas, hitos en curso, escalas afectadas   |
| `danger`     | `#EF4444` | Alertas críticas, retrasos confirmados       |

---

## Fuente de datos reales

Las escalas actuales se obtienen del CSV público de la APA:

```
https://www.puertoalicante.com/wp-content/uploads/buques/V_TC_ESCALAS.csv
```

Es el mismo feed que alimenta `puertoalicante.com/el-puerto/prevision-buques/`.

## Actualización automática de datos

Un GitHub Actions workflow (`.github/workflows/update-alicante-demo.yml`) descarga el CSV cada 2 horas, actualiza `calls[]` en `data.json`, y hace push. Netlify redespliega automáticamente. La demo muestra siempre escalas reales del puerto.

**El workflow preserva** `tugService` y `milestones` — son datos manuales de la demo y no se tocan.  
**El workflow no preserva** `delay`, `alertNote`, `affectedBy`, `affectRisk` — si necesitas el escenario de alerta para una demo, edita `data.json` manualmente después de la actualización.

### Comandos locales

```bash
npm run update-demo           # actualiza data.json con datos frescos
npm run update-demo:dry       # muestra qué cambiaría sin escribir
npm run update-demo:headers   # imprime las columnas del CSV (útil si falla la detección)
```

### Si el script falla con "columna no encontrada"

1. Ejecuta `npm run update-demo:headers` para ver las columnas reales del CSV
2. Actualiza el objeto `COL` en `scripts/update-alicante.mjs` con los nombres correctos
3. Las columnas obligatorias son `id`, `name` y `eta`

---

## Funcionalidades pendientes / ideas para desarrollar

- [ ] Múltiples partes de remolque (`tugService` → `tugServices[]`) con filtrado por `callId`
- [ ] Nivel de impacto `"BAJO"` en `affectRisk` (actualmente solo `"ALTO"` y `"MEDIO"` tienen badge en la UI)
- [ ] Hitos operativos para todas las escalas activas (no solo las que tienen datos reales)
- [ ] Panel de prácticos con datos reales (fuente: `practicosvigo.com` como referencia)
- [ ] Notificaciones / suscripciones a eventos de una escala
- [ ] Dashboard interno para la AP con trazabilidad completa
- [ ] Modo de comparación planificado vs real más explícito en la vista de tabla
- [ ] Exportación de datos (CSV, PDF)
- [ ] Soporte multilingüe (ES / EN)
- [ ] Versión para el Puerto de Vigo con sus propios datos

---

## Notas para la demo

**Escala recomendada para el recorrido guiado:** `WEC MAJORELLE` (id: `A202600322`)  
6.362 GT, portacontenedores, Muelle 23. Es la única escala con datos reales de remolque, hitos en progreso y alerta activa — cubre todos los paneles del drawer de una vez.

**Para mostrar el escenario de alerta:** clicar en `WEC MAJORELLE` (id: `A202600322`)  
Tiene `status: "Alerta"`, retraso de +4h 15min, y afecta a NIEVES B (riesgo ALTO) y SPIRIT (riesgo MEDIO) en el Muelle 23.

**Para mostrar el impacto en cascada:** después de la alerta, buscar `NIEVES B` o `SPIRIT` en la tabla — aparecerán con borde naranja y badge de impacto.