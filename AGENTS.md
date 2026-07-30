# wwwnauticopscom

React + TypeScript + Vite SPA. The public marketing website for NauticOps (`nauticops.com`), deployed on Vercel.

> **Fuente única de instrucciones para agentes de código.** Cursor lee este fichero de forma nativa; Claude Code lo carga a través del import `@AGENTS.md` que hay en `CLAUDE.md`. **Edita siempre este fichero**, nunca el puente. Lo que no esté escrito aquí no lo ve quien use la otra herramienta.

## Reglas de trabajo — leer antes de tocar nada

El quality gate **no está forzado**: proteger `main` y exigir checks requiere permiso de admin sobre el repo, que esta cuenta no tiene (el repo es de `abrahamriveirosotelo-blip`). Así que es una **convención que se cumple a mano, sin excepciones**:

1. **Antes de cada commit**: `npm run format`. No se commitea sin formatear.
2. **Antes de abrir o actualizar un PR**: `npm run verify` (`format:check → lint → typecheck → test → build`), y **el resultado va en el cuerpo del PR con números concretos** — "3 errores / 8 warnings, igual que el baseline", no "todo verde".
3. **Criterio de aceptación** mientras #80 no aterrice: `format:check`, `typecheck`, `test` y `build` en verde **siempre**; `lint` no puede empeorar el baseline (**3 errores / 8 warnings**). Cuando cierre #80, el criterio pasa a lint en verde también.
4. Si el gate falla por algo **preexistente**, se dice explícitamente en el PR. Nunca se silencia ni se da por bueno sin mencionarlo.
5. **Merge siempre con squash**: un commit por PR, historial lineal, sin merge commits. Dentro de una rama sí puedes mergear `main` para ponerte al día.
6. **No editar a mano** `src/pages/demos/**/data.json` ni `vessel-cache.json`: los reescribe el cron cada 2 h y se perdería el cambio.
7. **Un reformateo masivo va en su propio PR**, sin nada más dentro, y su SHA (el de `main`, post-squash) se registra en `.git-blame-ignore-revs` en un PR posterior.
8. **El cuerpo del PR lleva `Closes #NN`** cuando cierra una issue. Sin eso la issue queda abierta tras el merge y hay que cerrarla a mano.

`npm run verify` no es un trámite: es **el objetivo verificable contra el que iterar**. Cambia, ejecútalo, corrige, repite hasta que pase. Un agente rinde mucho mejor con una diana automática que con una descripción de lo que "debería" funcionar.

Al clonar el repo, una vez: `git config blame.ignoreRevsFile .git-blame-ignore-revs`. Sin eso, `git blame` te devuelve los commits de reformateo en vez de los autores reales (GitHub sí lo aplica solo en su web).

**Sobre ampliar estas reglas:** añade una solo cuando un agente cometa el mismo error por segunda vez, o cuando una revisión pille algo que debería haber sabido. Un fichero que crece sin freno se acaba leyendo peor que uno corto. Si algo solo aplica a una parte del código, va en las instrucciones de esa carpeta, no aquí.

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS + shadcn/ui** (components copied into `src/components/ui/`)
- **npm** (`package-lock.json`; a `bun.lockb` from earlier Bun use also persists)
- **React Router** for routing
- **Vercel** for deployment (`vercel.json` present; apex `nauticops.com` 308-redirects to `www.nauticops.com`). A legacy `netlify.toml` remains and Netlify still builds PR deploy-previews.
- No backend, no auth.

## Formato y calidad de código

- **`npm run verify`** encadena el gate completo: `format:check → lint → typecheck → test → build`. Es **el** comando a correr antes de abrir un PR (hasta que #81 lo mueva a CI). Hoy falla en `lint` por los 3 errores de baseline; queda verde con **#80**.
- **Prettier** es el formateador único (`.prettierrc.json`: `printWidth` 100, comillas dobles, `;`, `trailingComma: all`). Corre `npm run format` antes de commitear y `npm run format:check` para verificar. La versión va **pineada exacta** (`"prettier": "3.9.6"`, sin `^`): un minor de Prettier puede cambiar el formato y poner en rojo PRs que no tocaron nada.
- **`prettier-plugin-tailwindcss`** (pineado exacto) ordena las clases Tailwind, también dentro de `cn()` y `cva()` (`tailwindFunctions` en `.prettierrc.json`). El orden dentro de una cadena deja de ser una decisión: lo pone el plugin.
- **`.prettierignore`** excluye lo que **no** debe reformatearse: `dist`, lockfiles, los `data.json` / `vessel-cache.json` que generan los scrapers/cron (evita churn y conflictos con las escrituras automáticas — `update-huelva.mjs` además escribe sin salto final), `scripts/fixtures/` (HTML crudo de las fuentes: viene con marcado inválido que **rompe** el parser de Prettier) y `public/demo/v2`.
- **ESLint** usa flat config (`eslint.config.js`) con `eslint-config-prettier` al final para no solapar reglas de estilo con Prettier. Lint: `npm run lint`. Baseline actual: **3 errores** (2× `no-empty-object-type`, 1× `no-require-imports`) + 8 warnings de `react-refresh`; se sanean en **#80**.
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) — hoy **limpio**; ojo: `npm run build` de Vite **no** hace typecheck.
- **Merge**: `main` se mergea **siempre con squash** — un commit por PR, historial lineal, sin merge commits. Dentro de una rama de PR sí puedes mergear `main` para ponerte al día; el squash lo colapsa todo igual.
- **`git blame`**: los commits de reformateo masivo se listan en `.git-blame-ignore-revs`. GitHub lo aplica solo; en local, una vez por clon: `git config blame.ignoreRevsFile .git-blame-ignore-revs`. Ojo al squash: el SHA bueno es el que queda **en `main`** (`gh pr view <n> --json mergeCommit --jq .mergeCommit.oid`), así que un PR de reformateo se registra en un PR posterior, nunca en sí mismo.
- **Alcance**: el gate cubre solo `wwwnauticopscom/`. La raíz del monorepo y `port-control-center/` (deprecado) quedan fuera.
- El **quality gate** se está montando en las issues **#79–#83**. El workflow de CI (#81) se podrá añadir y dará señal visible en cada PR, pero **hacerlo bloqueante requiere admin del repo**, que esta cuenta no tiene: hasta que eso se resuelva, el gate vive en las **Reglas de trabajo** de arriba y se corre en local antes de cada PR.

## Pages

| Route                  | Component                                   | Purpose                                          |
| ---------------------- | ------------------------------------------- | ------------------------------------------------ |
| `/`                    | `src/pages/Index.tsx`                       | Main landing page                                |
| `/for-shipping-agents` | `src/pages/ShippingAgentsPage.tsx`          | Commercial landing page for shipping agents      |
| `/legal/:section`      | `src/pages/LegalPage.tsx`                   | Legal / privacy (`/legal` a secas **no** existe) |
| `/demo/alicante`       | `src/pages/demos/alicante/DemoAlicante.tsx` | Interactive demo for Puerto de Alicante prospect |
| `/demo/huelva`         | `src/pages/demos/huelva/DemoHuelva.tsx`     | Interactive demo for Puerto de Huelva prospect   |
| `/demo/marin`          | `src/pages/demos/marin/DemoMarin.tsx`       | Interactive demo for Puerto de Marín prospect    |
| `*`                    | `src/pages/NotFound.tsx`                    | Catch-all 404                                    |

`/demo/v2` (#75) **no** es una ruta del SPA: es `public/demo/v2/index.html`, un HTML autocontenido con JS/CSS inline que Vercel sirve mediante un `rewrite` de `vercel.json`. Queda fuera del build de Vite y fuera de Prettier.

## Architecture

**i18n:** `src/contexts/LanguageContext.tsx` provides `language`, `setLanguage`, and a `t` object (typed `Translations`). Translations live in `src/lib/translations.ts` and the `src/lib/translations/` directory (split by domain: `about`, `legal`, `shippingAgents`). Default language is English (`'en'`).

**Analytics:** Google Analytics 4 via `src/lib/analytics.ts` (+ `src/hooks/usePageTracking.ts` for page views), GA4 property `G-LBV7LSXJDD`. Also tracks B2B conversion events (`trackCtaClick`, `trackPlatformClick`, `trackFormStart`, …).

## Demo pattern

Demos follow a strict separation: **all data in JSON, zero domain data in TSX.**

```
src/pages/demos/<port>/
  Demo<Port>.tsx     — UI and logic only
  data.json          — all calls, tug service, milestones
  CLAUDE.md          — demo-specific documentation

# marin/ además (la demo más completa):
  FleetMap.tsx       — mapa Leaflet de la flota
  SchedulePlayback.tsx — reproducción temporal de la planificación
  meteo.ts           — tipos/utilidades del bloque meteo
  vessel-cache.json  — caché AIS que escribe enrich-marin-ais.mjs
```

Los `data.json` y `vessel-cache.json` los reescribe el cron (`.github/workflows/update-demos.yml`, cada 2 h entre 04:00–20:00 UTC), que commitea directo a `main`. Por eso están en `.prettierignore`: no se editan a mano ni se formatean.

Ports: `alicante` (CSV auto-update), `huelva` (PDF via `npm run update-demo:huelva`), `marin` (dos tablas HTML de apmarin.com cruzadas por código de escala, via `npm run update-demo:marin`). Cada puerto tiene su propio script de ingesta; sin código compartido entre demos por ahora.

To update a demo (change vessel data, statuses, alerts), only edit that port's `data.json`. See [demos/alicante/CLAUDE.md](src/pages/demos/alicante/CLAUDE.md) or [demos/huelva/CLAUDE.md](src/pages/demos/huelva/CLAUDE.md) for schema and walkthrough notes.

⚠️ Esos ficheros por demo se llaman `CLAUDE.md`, así que **Claude Code los carga solo al entrar en esas carpetas y Cursor no los carga nunca**. Es la única excepción a la fuente única de este repo, y es deliberada: las tres demos se unifican en una sola app en #28 y duplicarlas ahora sería trabajo tirado. Si trabajas con Cursor dentro de una demo, ábrelo a mano antes de tocar nada.

## Brand colors

⚠️ Hay **dos paletas distintas** y no coinciden en valores. Usa la que toque según dónde estés.

**1. Sitio (Tailwind + CSS vars).** Definidas en HSL en `src/index.css` (`--navy-deep`, `--navy-medium`, `--navy-light`, `--cyan-brand`, `--cyan-light`, `--cyan-pale`, `--slate-warm`) y expuestas como utilidades en `tailwind.config.ts`:

| Clase Tailwind               | Var CSS         | Uso                          |
| ---------------------------- | --------------- | ---------------------------- |
| `bg-navy-deep`               | `--navy-deep`   | Dark backgrounds, nav        |
| `bg-navy` / `bg-navy-medium` | `--navy-medium` | Primary text, active buttons |
| `bg-navy-light`              | `--navy-light`  | Superficies elevadas         |
| `bg-cyan-brand`              | `--cyan-brand`  | Brand primary, CTAs          |
| `bg-cyan-light`              | `--cyan-light`  | Badges, highlights           |
| `bg-cyan-pale`               | `--cyan-pale`   | Fondos suaves                |

**2. Demos (hex literal).** Cada `Demo*.tsx` lleva su propio objeto `const B = {…}` con hex — duplicado e idéntico en las tres demos, sin relación con las vars CSS de arriba:

| Token       | Hex       | Use                          |
| ----------- | --------- | ---------------------------- |
| `navyDeep`  | `#010B24` | Dark backgrounds, nav        |
| `navy`      | `#0A1F3D` | Primary text, active buttons |
| `cyan`      | `#079FE6` | Brand primary, CTAs          |
| `cyanLight` | `#29B6F6` | Badges, highlights           |
| `success`   | `#00C896` | Confirmed states             |
| `warning`   | `#F59E0B` | Alerts, in-progress          |
| `danger`    | `#EF4444` | Critical alerts, delays      |

(`navyMid`, `cyanPale`, `offWhite`, `grayLight`, `gray`, `dark`, `white` completan el objeto.) Unificar ambas paletas es candidato natural para la consolidación de demos de v2.

## No authentication

There is no login or user accounts. CTA forms submit to **Formspree** (`https://formspree.io/f/…`).
