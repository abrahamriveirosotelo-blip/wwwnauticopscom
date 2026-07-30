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
DemoMarin.tsx        — Componente React principal (UI + lógica; logo en LOGO_PORT como data URI SVG)
FleetMap.tsx         — Mapa Leaflet "Posición de la flota" (vista Tarjetas)
SchedulePlayback.tsx — Simulación animada de entradas/salidas (vista Cronología)
meteo.ts             — Helpers de meteo compartidos (nivelColor, nivelDot, safeHttpUrl, worstAviso)
data.json            — Todos los datos de la demo (escalas + enriquecimiento + meta.meteo)
vessel-cache.json    — Caché del enriquecimiento estático (VesselFinder), ver «Enriquecimiento»
```

**Regla principal: los datos van en el JSON, nunca en el TSX.**
Para actualizar la demo (cambiar escalas, estados, horarios, alertas) solo hay que tocar `data.json`. (Los tipos del schema — `Call`/`Meta`/`Aviso`/`Meteo` — se declaran en `DemoMarin.tsx`: eso es tipado, no datos.)

Nació como clon de [Huelva](../huelva/CLAUDE.md) (logo SVG de APMARIN, etiqueta `AP Marín`, degradado de `gt`/`len`/`imo`) pero ha **divergido bastante**: añade mapa AIS (`FleetMap`), vista **Cronología** con simulación (`SchedulePlayback`), **meteo operativa + avisos AEMET** (`meteo.ts` + `meta.meteo`) y **alertas derivadas** del contraste AP↔AIS. El schema base sigue el de [Alicante](../alicante/CLAUDE.md), extendido con los campos `aisX` y `meta.meteo`.

---

## Fuente de datos

Dos tablas HTML estáticas públicas de apmarin.com, con la **misma estructura** (una `<table class="estilo1">`, 9 columnas: Buque · Origen · Destino · Escala · Consignatario · Muelle · Norays · Mercancía · ETA|ETD):

```
https://www.apmarin.com/es/paginas/buques_esperados   → última columna ETA (llegadas previstas)
https://www.apmarin.com/es/paginas/buques_puerto      → última columna ETD (escalas aún en puerto)
```

### Cruce por código de escala

La columna **Escala** (`M2026XXXXX`) es un identificador único que aparece en **ambas** tablas y sirve de clave de unión. El año vive dentro del propio código (`M`**`2026`**`…`), de ahí se toma para fechar `eta`/`etd` sin adivinar.

**Importante (un buque está en una lista _o_ en la otra, nunca en ambas a la vez):** la tabla de esperados da la ETA antes de la llegada; cuando el buque atraca desaparece de esa lista y pasa a "en puerto", que da la ETD. Para que una escala muestre **ETA _y_ ETD** el script conserva el dato del `data.json` anterior:

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

### Posición en vivo (aisstream.io)

[`scripts/enrich-marin-ais.mjs`](../../../../scripts/enrich-marin-ais.mjs) añade la **posición** que VesselFinder no expone: `aisLat`, `aisLon`, `aisSog` (velocidad, kn), `aisCog` (rumbo sobre el fondo, °), `aisHeading` (proa, °) y `aisPosAt` (instante de la posición, hora España). Fuente: [aisstream.io](https://aisstream.io) — stream **WebSocket** gratuito; el script conecta, se **suscribe filtrando por los MMSI** de la flota (los rellena `enrich-marin.mjs`), escucha una ventana corta (`--seconds`, 90 s por defecto) y guarda la última posición de cada buque.

Separación de responsabilidades: aquí **solo** se trata cinemática de posición; el estado (`aisStatus`) y la ETA siguen viniendo de `enrich-marin-live.mjs`. Los valores AIS "no disponible" (SOG 102.3, COG 360, proa 511) se normalizan a `null`.

**Best-effort, no cacheable** (la posición cambia constantemente): requiere el secret **`AISSTREAM_KEY`** ([API key gratuita](https://aisstream.io/apikeys)); sin key el script se **omite solo** (sale 0). Si un buque no emite en la ventana, se conserva su última posición conocida (`buildCalls` arrastra los campos `aisLat/aisLon/…`). Cobertura de aisstream: costera (~200 km); buena para buques navegando hacia Marín, con posibles huecos en mar abierto o en el fondo de la ría.

> **Node:** usa el **WebSocket global**, disponible en **Node ≥ 22**. En Node 20 (permitido por `engines`) cae automáticamente a **`undici`** (devDependency). Si no hay ninguno de los dos, el script avisa y se omite (no es que "no funcione": faltaría el runtime de WebSocket).

**Se ejecuta EN LOCAL, NO en CI.** Los buques (sobre todo atracados) emiten posición cada varios minutos, así que una ventana de cron es demasiado corta para captar la flota. El flujo es dejar el script corriendo un rato (p. ej. antes de una demo) e ir **commiteando `data.json` progresivamente**. El script está pensado para eso:

- **`--seconds N`**: duración de la ventana. Para llenar el mapa, ventana larga (p. ej. `3600`).
- **Reconecta** solo si aisstream cierra el socket (habitual en runs largos).
- **`--flush N`** (60 s por defecto): vuelca `data.json` cada N s → puedes commitear sin parar el proceso.
- **Ctrl-C**: corta limpio guardando lo captado.
- **Acumula entre pasadas**: los no captados conservan su posición anterior.

```bash
AISSTREAM_KEY=xxxxx npm run enrich-demo:marin:ais           # ventana 90 s (prueba rápida)
AISSTREAM_KEY=xxxxx npm run enrich-demo:marin:ais:long      # 1 h, volcando cada 60 s
AISSTREAM_KEY=xxxxx node scripts/enrich-marin-ais.mjs --seconds 3600 --flush 120
AISSTREAM_KEY=xxxxx npm run enrich-demo:marin:ais:dry       # sin escribir
```

En la UI: el mapa **POSICIÓN DE LA FLOTA** (`FleetMap.tsx`, Leaflet + OpenStreetMap) pinta cada buque con posición, orientado al rumbo y coloreado por estado; **clic en un buque abre su escala** (mismo drawer que la tabla). Sin posiciones, muestra solo Marín.

### Meteo operativa (MeteoGalicia + avisos AEMET de costa)

[`scripts/enrich-marin-meteo.mjs`](../../../../scripts/enrich-marin-meteo.mjs) rellena `data.meta.meteo` con:

- **Observación** de la estación MeteoGalicia **14005 "Porto de Marín"** (en el propio puerto): racha y dirección de viento, temperatura, presión, lluvia, humedad.
- **Avisos** de fenómenos adversos de AEMET (CAP ATOM de Galicia), filtrados a la **zona costera de Marín — Rías Baixas-Costa (`713601C`)**: nivel (amarillo/naranja/rojo), fenómeno, ventana y detalle (descripción/instrucción/probabilidad).

Ninguna fuente envía CORS → se traen **server-side** en el script y se hornean en el JSON (como el AIS). Los helpers de UI compartidos viven en [`meteo.ts`](meteo.ts). La ETA/instantes se pasan a hora de España (`Europe/Madrid`, DST) con `toSpainIso`. Se **descartó** la capa de oleaje regional (Copernicus IBI ~3 km: sin detalle en el puerto).

```bash
npm run enrich-demo:marin:meteo          # rellena meta.meteo
npm run enrich-demo:marin:meteo:dry      # sin escribir
```

En la UI: panel **"Condiciones en el puerto"** con la observación; **banner** con chips de aviso (clic → modal de detalle); en la **Cronología** los avisos se pintan en la barra de tiempo (chip del vigente = el de mayor nivel) y en los días afectados; y las **tarjetas** de escalas cuya estancia solapa un aviso lo señalan con un badge de nivel.

---

## Vistas de la UI

Conmutador **Tarjetas ↔ Cronología** sobre la lista de escalas:

- **Tarjetas** — estado actual: KPIs, buscador/filtros, lista de escalas (cada una abre su drawer) y el mapa `FleetMap` con las posiciones AIS.
- **Cronología** — planificación: `SchedulePlayback` anima la entrada/salida de cada buque según su ETA/ETD sobre un mapa centrado en Marín, con reproductor (play/pausa), barra de tiempo con hitos por día, medidor de ocupación (pico) y los avisos meteo pintados en la barra. Arranca en el "ahora" y deja retroceder.

Clic en un buque (en cualquier vista) abre su escala y lo resalta como seleccionado en el mapa.

---

## Actualización de datos

El script [`scripts/update-marin.mjs`](../../../../scripts/update-marin.mjs) descarga las dos páginas, parsea las tablas (parser regex zero-dep en [`scripts/lib/marin-updater.mjs`](../../../../scripts/lib/marin-updater.mjs)), las cruza por escala y escribe `data.json`.

### Alertas operativas (dirigidas por datos, ya no fabricadas)

La UI muestra una **alerta operativa** cuando una escala trae los campos `status: "Alerta"` + `delay`/`alertNote` (buque en incidencia) y otra trae `affectedBy` + `affectRisk` (escala impactada). **Ya NO se fabrican**: `update-marin.mjs` dejó de generar el escenario de demo; estos campos solo deben marcarse cuando una **fuente real** detecte una incidencia. La maquinaria de UI se conserva para cuando exista esa detección real.

Además, la UI **deriva alertas del contraste AP↔AIS** (no requieren campos en el JSON), en `DemoMarin.tsx`:

- `isDelayedDeparture` — la AP lo lista en puerto pero su ETD ya venció y el AIS no lo da navegando fuera → "salida demorada".
- `departedPerAis` — el AIS lo sitúa navegando con destino distinto de Marín aunque la AP lo liste en puerto → "ya zarpó (AIS)".
- `etaDiscrepancy` — la ETA de la AP y la del AIS **a Marín** (solo si `aisAtMarin`, no cuando el AIS va al puerto siguiente) difieren > 1 h → "retraso/adelanto".

`hasAlert(c)` combina el modelo del JSON con estas derivadas; alimentan el banner, el KPI "CON ALERTA" y los chips de tarjetas/cronología. (Aparte, las escalas cuya estancia solapa un aviso AEMET se marcan con un badge de nivel — ver «Meteo operativa».)

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

El workflow [`.github/workflows/update-demos.yml`](../../../../.github/workflows/update-demos.yml) ejecuta el job `update-marin` cada 2 horas (06:00–22:00 hora España) junto a Alicante y Huelva: corre `update-marin.mjs`, luego `enrich-marin.mjs` (estático), `enrich-marin-live.mjs` (AIS en vivo) y `enrich-marin-meteo.mjs` (meteo) — los tres enrich `continue-on-error` — y commitea `data.json` + `vessel-cache.json` si cambiaron. **Vercel** redespliega.

> La **posición AIS** (`enrich-marin-ais.mjs`, aisstream) **NO** corre en el cron: necesita ventanas largas (ver sección anterior), así que se ejecuta en local y se commitea a mano. `update-marin`/`buildCalls` arrastran las posiciones ya commiteadas, así que el cron no las borra. Se reactivará en CI cuando haya un servidor con el WebSocket abierto 24/7.

---

## Notas para la demo

La demo muestra datos reales: escalas de la AP + datos AIS en vivo (estado, ETA reportada, posición en el mapa). El gancho "planificado vs ejecutado" sale del **contraste AP vs AIS** (p. ej. un buque que la AP da como `Prevista` y el AIS ya sitúa atracado en Marín, o ETA AP vs ETA AIS). Las **alertas operativas** ya no se inventan: solo aparecerán cuando una fuente real detecte una incidencia (ver «Alertas operativas» arriba).

---

## Pendiente

- [x] Enriquecer IMO/GT/eslora/bandera/tipo desde vesselfinder.com (`enrich-marin.mjs`).
- [x] Datos en vivo de estado/velocidad/ETA (`enrich-marin-live.mjs`, VesselFinder).
- [x] Posición en vivo (lat/lon/rumbo) desde aisstream.io (`enrich-marin-ais.mjs`).
- [x] Mapa en la UI que pinta la posición AIS de cada buque (`FleetMap.tsx`, Leaflet; clic abre la escala).
- [x] Meteo operativa: observación MeteoGalicia (est. 14005) + avisos AEMET de costa (`enrich-marin-meteo.mjs`, `meta.meteo`, panel + banner + badges).
- [x] Vista Cronología: simulación animada de la planificación de entradas/salidas (`SchedulePlayback.tsx`).
- [x] `enrich-marin-meteo.mjs` corre en el cron (la meteo se refresca sola cada ciclo).
- [ ] Servidor 24/7 para el WebSocket de aisstream (poder poblar posiciones en CI, no solo en local).
- [ ] Contacto/prospecto concreto al que va dirigida la demo (como Esther en Alicante).
- [ ] Aprovechar la columna `Norays` (no se vuelca al JSON; podría mostrarse en el drawer).
