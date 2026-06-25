# NauticOps — Demo Puerto de Marín

Mockup navegable del dashboard de operaciones portuarias de NauticOps, configurado con datos reales de la Autoridad Portuaria de Marín (APMARIN). Desarrollado para una demo comercial.

**Ruta pública:** `/demo/marin`
**Carpeta en repo:** `src/pages/demos/marin/`

---

## Contexto del proyecto

NauticOps conecta la información planificada de las autoridades portuarias con la ejecución real de los actores que operan en el muelle (remolcadores, prácticos, amarradores). La propuesta de valor central es pasar de **"escala anunciada"** a **"escala ejecutada"**.

---

## Ficheros

```
DemoMarin.tsx   — Componente React principal (solo UI y lógica; logo en LOGO_PORT como data URI SVG)
data.json       — Todos los datos de la demo (escalas, servicios, hitos)
```

**Regla principal: los datos van en el JSON, nunca en el TSX.**
Para actualizar la demo (cambiar escalas, estados, horarios, alertas) solo hay que tocar `data.json`.

El componente es un clon de [Huelva](../huelva/CLAUDE.md) con tres adaptaciones: logo SVG de APMARIN, etiqueta `AP Marín` y **degradado de `gt`/`len`/`imo`** (ver más abajo). El schema del JSON es idéntico al de [Alicante](../alicante/CLAUDE.md).

---

## Fuente de datos

Dos tablas HTML estáticas públicas de apmarin.com, con la **misma estructura** (una `<table class="estilo1">`, 9 columnas: Buque · Origen · Destino · Escala · Consignatario · Muelle · Norays · Mercancía · ETA|ETD):

```
https://www.apmarin.com/es/paginas/buques_esperados   → última columna ETA (llegadas previstas)
https://www.apmarin.com/es/paginas/buques_puerto      → última columna ETD (escalas aún en puerto)
```

### Cruce por código de escala

La columna **Escala** (`M2026XXXXX`) es un identificador único que aparece en **ambas** tablas y sirve de clave de unión. El año vive dentro del propio código (`M`**`2026`**`…`), de ahí se toma para fechar `eta`/`etd` sin adivinar.

**Importante (un buque está en una lista *o* en la otra, nunca en ambas a la vez):** la tabla de esperados da la ETA antes de la llegada; cuando el buque atraca desaparece de esa lista y pasa a "en puerto", que da la ETD. Para que una escala muestre **ETA *y* ETD** el script conserva el dato del `data.json` anterior:

- al construir una escala "en puerto" sin ETA en la tabla actual, recupera la ETA que se guardó cuando estaba en "esperados";
- y a la inversa para la ETD.

Por eso en un **arranque en frío** (sin `data.json` previo) los barcos ya en puerto muestran `ETA —`; tras una o dos ejecuciones del workflow la ETA queda registrada. No es un bug.

### Campos que la AP no publica

Las tablas de Marín **no incluyen `IMO`, `GT` (arqueo) ni eslora**. Se degradan a `'—'` / `0`:

- `imo` siempre `'—'` (el componente ya lo omite del header).
- `gt` y `len` valen `0`; `DemoMarin.tsx` muestra **"Datos de buque no publicados por la AP"** en el header del drawer y `—` en la columna GT de la tabla.

No se enriquecen desde fuentes externas (decisión de producto: 100 % datos reales de la fuente oficial). Ver [demo-data-quality.instructions.md](../../../../.github/instructions/demo-data-quality.instructions.md).

---

## Actualización de datos

El script [`scripts/update-marin.mjs`](../../../../scripts/update-marin.mjs) descarga las dos páginas, parsea las tablas (parser regex zero-dep en [`scripts/lib/marin-updater.mjs`](../../../../scripts/lib/marin-updater.mjs)), las cruza por escala y escribe `data.json`.

En cada ejecución también **elige el escenario de alerta**: un buque "en puerto" (`Iniciado`) que comparte muelle con otro `Prevista` → `"Alerta"` + retraso + impacto en cascada (`affectedBy`, `affectRisk: "ALTO"`) + hitos operativos. La comparación de muelles ignora acentos/mayúsculas (la AP escribe "Marin" en una tabla y "Marín" en la otra). No hay IDs hardcodeados.

Se preservan del JSON anterior los datos manuales del parte de remolque (`tugService.crew`, `tugService.times`, `tugService.tugboat`). El `callId` se actualiza al barco elegido para la alerta.

### Comandos locales

```bash
npm run update-demo:marin           # descarga y actualiza data.json
npm run update-demo:marin:dry       # vista previa sin escribir
npm run update-demo:marin:debug     # lista las filas parseadas de ambas tablas
```

### Offline (sin red o si falla el acceso)

```bash
node scripts/update-marin.mjs --file scripts/fixtures/marin-esperados.html scripts/fixtures/marin-puerto.html
```

Fixtures de referencia: [`scripts/fixtures/marin-esperados.html`](../../../../scripts/fixtures/marin-esperados.html) y [`marin-puerto.html`](../../../../scripts/fixtures/marin-puerto.html).

### Si el script falla con "No se encontró la tabla class=estilo1"

1. Comprueba que las URLs siguen devolviendo HTML (no una página de error/cookies).
2. Ejecuta `npm run update-demo:marin:debug` para ver qué filas detecta.
3. Si cambió la estructura de la tabla, ajusta el orden de columnas en `parseMarinPage` (`scripts/lib/marin-updater.mjs`).

---

## Actualización automática (CI)

El workflow [`.github/workflows/update-demos.yml`](../../../../.github/workflows/update-demos.yml) ejecuta el job `update-marin` dos veces al día (08:00 y 12:00 hora España) junto a Alicante y Huelva, y commitea `data.json` si cambió. Netlify redespliega.

---

## Notas para la demo

Tras actualizar, el barco en **Alerta** y el de **impacto ALTO** se eligen automáticamente (no hay IDs fijos). Usa el banner superior y el drawer de remolque del buque marcado como `Alerta`.

---

## Pendiente

- [ ] Nombre real del remolcador de Marín en `tugService.tugboat` (placeholder: `REMOLCADOR RÍA DE PONTEVEDRA`).
- [ ] Contacto/prospecto concreto al que va dirigida la demo (como Esther en Alicante).
- [ ] Aprovechar la columna `Norays` (no se vuelca al JSON; podría mostrarse en el drawer).
