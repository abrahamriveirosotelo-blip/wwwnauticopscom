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
data.json       — Todos los datos de la demo (escalas + enriquecimiento)
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

Las tablas de Marín **no incluyen `IMO`, `GT` (arqueo), eslora ni bandera**. `update-marin.mjs` los deja degradados (`imo: '—'`, `gt`/`len`: `0`); luego `enrich-marin.mjs` los rellena desde vesselfinder.com **cuando el match es fiable** (ver «Enriquecimiento» más abajo). Si el match no es fiable, se quedan degradados:

- `imo`: enriquecido con el IMO real, o `'—'` si no hay match (el componente lo omite del header cuando es `'—'`).
- `gt`/`len`: enriquecidos con el valor real, o `0` si no hay match. Con `gt`/`len` a `0` y sin otros datos, `DemoMarin.tsx` muestra **"Datos de buque no publicados por la AP"** en el header del drawer y `—` en la columna GT de la tabla.

Ver [demo-data-quality.instructions.md](../../../../.github/instructions/demo-data-quality.instructions.md).

### Enriquecimiento de datos de buque (vesselfinder.com)

El script [`scripts/enrich-marin.mjs`](../../../../scripts/enrich-marin.mjs) (lib en [`scripts/lib/vesselfinder.mjs`](../../../../scripts/lib/vesselfinder.mjs)) busca cada buque por nombre en vesselfinder.com y rellena **datos estáticos**: `imo`, `mmsi`, `gt`, `dwt` (peso muerto), `len`, `flag` (bandera), `vesselType`, `built`, `callsign`. Se ejecuta **después** de `update-marin.mjs` (que resetea esos campos en cada actualización).

**Matching conservador** (los nombres no son únicos): solo se acepta un buque si hay un **único candidato de tipo comercial** con ese nombre exacto, o si el **`Destination` de VesselFinder confirma** la escala (contiene "Marin" para entrantes, o coincide con `to` para salientes). Ante la duda se deja `'—'` — nunca se asigna el IMO/GT de otro barco.

**Caché** [`vessel-cache.json`](vessel-cache.json), keyed por **nombre + destino (`to`) normalizados** (los nombres no son únicos: así dos buques distintos con el mismo nombre no se mezclan): los particulares son inmutables, así que un buque se resuelve una vez y no se vuelve a pedir (los no resueltos se reintentan a los 7 días). Esto minimiza peticiones a VesselFinder. Si `update-marin.mjs` resetea `data.json`, `enrich-marin.mjs` lo re-aplica desde la caché **sin** volver a la red.

`enrich-marin.mjs` solo rellena datos **estáticos** (inmutables). Los datos AIS en vivo se tratan aparte (ver siguiente sección).

```bash
npm run enrich-demo:marin            # enriquece data.json (usa caché)
npm run enrich-demo:marin:dry        # sin escribir
npm run enrich-demo:marin:force      # reintenta todo, ignorando la caché
node scripts/enrich-marin.mjs --vessel "GLORIOUS"   # prueba un nombre suelto
```

> **ToS / rate-limit:** los términos de VesselFinder restringen el scraping automatizado. El paso de enriquecimiento en CI es `continue-on-error` y throttlea 1,5 s entre peticiones; si las IPs de GitHub Actions se bloquean, la caché commiteada mantiene lo ya resuelto.

### Datos AIS en vivo (estado, velocidad, ETA reportada)

[`scripts/enrich-marin-live.mjs`](../../../../scripts/enrich-marin-live.mjs) añade datos **dinámicos** desde la ficha de VesselFinder: `aisStatus` (Navegando/Atracado/Fondeado/…), `aisSpeed` (nudos), `aisDraught` (calado actual en m), `aisEta` (ETA reportada por AIS), `aisAt` (timestamp absoluto del snapshot, hora España) y los booleanos derivados `aisAtMarin` (el destino AIS es Marín, por token) y `aisToFinal` (el destino AIS coincide con el `to` de la AP → Marín es escala intermedia). El matching se hace **en el script** (no en el TSX). Corre **después** de `enrich-marin.mjs` (necesita el `imo`); hace **una petición por IMO** ya conocido (sin búsqueda).

A diferencia de los particulares, esto **NO se cachea** (cambia constantemente) → se re-pide en cada ejecución. La celda "Predicted ETA" de la tabla de VesselFinder está gateada (premium), pero la ETA, la velocidad y el estado aparecen en la frase resumen y en un span `_mcol12ext`, de donde se leen. Solo los buques **en navegación** traen ETA/velocidad; los atracados no (correcto: ya llegaron).

La ETA del AIS viene en **UTC** y se convierte a **hora de España** (`Europe/Madrid`, con DST) para que sea comparable con la ETA de la AP. El valor de la demo: ver que un barco que la AP marca como `Prevista` **ya está atracado** según AIS, o comparar **ETA AP vs ETA AIS**.

```bash
npm run enrich-demo:marin:live           # rellena datos AIS en vivo
npm run enrich-demo:marin:live:dry       # sin escribir
node scripts/enrich-marin-live.mjs --vessel 9420796   # prueba un IMO suelto
```

En la UI: la **ETA AIS** aparece junto a la ETA de la AP en la sección **TIEMPOS** (no en una sección aparte); el **calado actual** va en **DATOS DEL BUQUE** (bajo TIEMPOS); la sección **Ruta** dibuja `Origen → Marín → Destino` (+ "Rumbo actual (AIS)" cuando el buque va a otro puerto); y la **tabla** muestra un chip por escala: ámbar **"⚓ ya en Marín (AIS)"** si `aisArrivedMarin` y la AP la da como prevista, o cian **"▸ rumbo a Marín"** si va de camino.

---

## Actualización de datos

El script [`scripts/update-marin.mjs`](../../../../scripts/update-marin.mjs) descarga las dos páginas, parsea las tablas (parser regex zero-dep en [`scripts/lib/marin-updater.mjs`](../../../../scripts/lib/marin-updater.mjs)), las cruza por escala y escribe `data.json`.

En cada ejecución también **elige el escenario de alerta**: un buque "en puerto" (`Iniciado`) que comparte muelle con otro `Prevista` → `"Alerta"` + retraso + impacto en cascada (`affectedBy`, `affectRisk: "ALTO"`). La comparación de muelles ignora acentos/mayúsculas (la AP escribe "Marin" en una tabla y "Marín" en la otra). No hay IDs hardcodeados.



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

El workflow [`.github/workflows/update-demos.yml`](../../../../.github/workflows/update-demos.yml) ejecuta el job `update-marin` cada 2 horas (06:00–22:00 hora España) junto a Alicante y Huelva: corre `update-marin.mjs`, luego `enrich-marin.mjs` (estático) y `enrich-marin-live.mjs` (AIS en vivo) — ambos `continue-on-error` en el cron — y commitea `data.json` + `vessel-cache.json` si cambiaron. Netlify redespliega.

---

## Notas para la demo

Tras actualizar, el barco en **Alerta** y el de **impacto ALTO** se eligen automáticamente (no hay IDs fijos). Usa el banner superior o clica el buque marcado como `Alerta`.

---

## Pendiente

- [x] Enriquecer IMO/GT/eslora/bandera/tipo desde vesselfinder.com (`enrich-marin.mjs`).
- [ ] Datos en vivo (velocidad/posición/ETA): requieren navegador headless o API de pago.
- [ ] Contacto/prospecto concreto al que va dirigida la demo (como Esther en Alicante).
- [ ] Aprovechar la columna `Norays` (no se vuelca al JSON; podría mostrarse en el drawer).
