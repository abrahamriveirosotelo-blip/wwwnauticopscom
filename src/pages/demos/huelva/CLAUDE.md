# NauticOps — Demo Puerto de Huelva

Mockup navegable del dashboard de operaciones portuarias de NauticOps, configurado para el Puerto de Huelva. Desarrollado para una demo comercial.

**Ruta pública:** `/demo/huelva`  
**Carpeta en repo:** `src/pages/demos/huelva/`

---

## Contexto del proyecto

NauticOps conecta la información planificada de las autoridades portuarias con la ejecución real de los actores que operan en el muelle (remolcadores, prácticos, amarradores). La propuesta de valor central es pasar de **"escala anunciada"** a **"escala ejecutada"**.

---

## Ficheros

```
DemoHuelva.tsx   — Componente React principal (solo UI y lógica; logo en LOGO_PORT base64)
data.json        — Todos los datos de la demo (escalas, servicios, hitos)
```

**Regla principal: los datos van en el JSON, nunca en el TSX.**  
Para actualizar la demo (cambiar escalas, estados, horarios, alertas) solo hay que tocar `data.json`.

---

## Estructura del JSON

El schema es idéntico al de [Alicante](../alicante/CLAUDE.md). Resumen de campos:

### `meta`

```json
{
  "port": "Puerto de Huelva",
  "source": "huelvapilots.com · previsiones",
  "date": "16/05/2026",
  "refreshHours": 24
}
```

### `calls[]`

| Campo        | Tipo    | Descripción                                              |
|--------------|---------|----------------------------------------------------------|
| `id`         | string  | Identificador de escala (p. ej. `H202600XXX`)            |
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
| `delay`      | string? | Solo en `status: "Alerta"`                               |
| `alertNote`  | string? | Solo en `status: "Alerta"`                               |
| `affectedBy` | string? | `id` de la escala que causa el impacto                   |
| `affectRisk` | string? | `"ALTO"` / `"MEDIO"`                                   |

### `tugService` y `milestones`

Igual que Alicante. Ver [alicante/CLAUDE.md](../alicante/CLAUDE.md) para ejemplos completos.

---

## Componente JSX — estructura

```
DemoHuelva()
├── NAV — logo NauticOps + logo puerto (placeholder) + indicador en vivo + badge de alerta
├── STATS — totales: escalas, en puerto, con alerta, previstas
├── ALERT BANNER — si hay escalas con status "Alerta"
├── TABLE — lista de escalas con filtros y buscador
└── Detail panel (drawer lateral)
    ├── Tab: Operación
    ├── Tab: Servicios (remolque + prácticos placeholder)
    └── Tab: Documentos (NOA · AP Huelva)
```

---

## Fuente de datos

Las previsiones de prácticos se publican como **PDF** (misma URL devuelve `application/pdf`):

```
https://intranet.huelvapilots.com/informes/previsiones
```

No hay CSV público equivalente al de Alicante. El script [`scripts/update-huelva.mjs`](../../../../scripts/update-huelva.mjs) descarga el PDF, extrae el texto con `pdf-parse` y mapea entradas (`E`) a `calls[]`. Las salidas (`S`) sin entrada asociada en el informe se omiten; si un buque tiene entrada y salida, se fusionan en un solo registro con `eta` + `etd`.

## Actualización de datos

En cada ejecución el script también **elige el escenario de alerta** (lógica en [`scripts/lib/huelva-updater.mjs`](../../../../scripts/lib/huelva-updater.mjs), independiente de Alicante): barco en puerto que comparte muelle con otro previsto → `"Alerta"` + impacto en cascada + hitos.

Se preservan del JSON anterior los datos manuales del parte de remolque (`tugService.crew`, `tugService.times`, `tugService.tugboat`). El `callId` se actualiza al barco elegido para la alerta.

### Comandos locales

```bash
npm run update-demo:huelva           # descarga PDF y actualiza data.json
npm run update-demo:huelva:dry       # vista previa sin escribir
npm run update-demo:huelva:debug     # lista filas parseadas del PDF
```

### PDF offline (sin red o si falla el acceso)

```bash
node scripts/update-huelva.mjs --file scripts/fixtures/huelva-previsiones.pdf
```

Fixture de referencia: [`scripts/fixtures/huelva-previsiones.pdf`](../../../../scripts/fixtures/huelva-previsiones.pdf).

### Si el script falla

1. Comprueba que la URL sigue devolviendo PDF (no página de login).
2. Ejecuta `npm run update-demo:huelva:debug` con `--file` y el PDF guardado manualmente.
3. Los códigos de muelle (`JGV`, `RSN`, …) vienen tal cual del informe de prácticos.

---

## Notas para la demo

Tras `npm run update-demo:huelva`, el barco en **alerta** y el de **impacto ALTO** se eligen automáticamente (no hay IDs fijos). Usa el banner superior y el drawer de remolque del buque marcado como `Alerta`.

**Actualización manual:** editar `data.json` o volver a ejecutar el script.

---

## Pendiente

- [x] Logo del puerto en `LOGO_PORT` (base64 en `DemoHuelva.tsx`)
- [x] Volcar escalas reales del PDF a `calls[]`
- [x] Script `update-huelva.mjs` + comandos npm
- [ ] Nombre real del remolcador en `tugService.tugboat`
- [ ] GitHub Actions programado (opcional; requiere acceso estable a la intranet)
