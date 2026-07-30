# wwwnauticopscom

React + TypeScript + Vite SPA. The public marketing website for NauticOps (`nauticops.com`), deployed on Vercel.

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
- **`.prettierignore`** excluye lo que **no** debe reformatearse: `dist`, lockfiles, los `data.json` / `vessel-cache.json` que generan los scrapers/cron (evita churn y conflictos con las escrituras automáticas — `update-huelva.mjs` además escribe sin salto final), `scripts/fixtures/` (HTML crudo de las fuentes: viene con marcado inválido que **rompe** el parser de Prettier) y `public/demo/v2`.
- **ESLint** usa flat config (`eslint.config.js`) con `eslint-config-prettier` al final para no solapar reglas de estilo con Prettier. Lint: `npm run lint`. Baseline actual: **3 errores** (2× `no-empty-object-type`, 1× `no-require-imports`) + 8 warnings de `react-refresh`; se sanean en **#80**.
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) — hoy **limpio**; ojo: `npm run build` de Vite **no** hace typecheck.
- **`git blame`**: el reformateo masivo de #79 está en `.git-blame-ignore-revs`. GitHub lo aplica solo; en local, una vez por clon: `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
- **Alcance**: el gate cubre solo `wwwnauticopscom/`. La raíz del monorepo y `port-control-center/` (deprecado) quedan fuera.
- El **quality gate en CI** (`format:check → lint → typecheck → test/coverage` + protección de `main`) se está montando en las issues **#79–#83**. Hasta que aterrice, **corre el gate en local antes de cada PR**.

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
