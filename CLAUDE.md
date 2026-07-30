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

- **Prettier** es el formateador único (`.prettierrc.json`: `printWidth` 100, comillas dobles, `;`, `trailingComma: all`). Corre `npm run format` antes de commitear y `npm run format:check` para verificar.
- **`.prettierignore`** excluye lo que **no** debe reformatearse: `dist`, lockfiles, los `data.json` / `vessel-cache.json` que generan los scrapers/cron (evita churn y conflictos con las escrituras automáticas), `scripts/fixtures/` (HTML crudo de las fuentes) y `public/demo/v2`.
- **ESLint** usa flat config (`eslint.config.js`) con `eslint-config-prettier` al final para no solapar reglas de estilo con Prettier. Lint: `npm run lint`.
- **Typecheck**: `npx tsc --noEmit` (hay errores baseline que se sanean en #80; ojo: `npm run build` de Vite **no** hace typecheck).
- El **quality gate en CI** (`format:check → lint → typecheck → test/coverage` + protección de `main`) se está montando en las issues **#79–#83**. Hasta que aterrice, **corre el gate en local antes de cada PR**.

## Pages

| Route                  | Component                                   | Purpose                                          |
| ---------------------- | ------------------------------------------- | ------------------------------------------------ |
| `/`                    | `src/pages/Index.tsx`                       | Main landing page                                |
| `/for-shipping-agents` | `src/pages/ShippingAgentsPage.tsx`          | Commercial landing page for shipping agents      |
| `/legal`               | `src/pages/LegalPage.tsx`                   | Legal / privacy                                  |
| `/demo/alicante`       | `src/pages/demos/alicante/DemoAlicante.tsx` | Interactive demo for Puerto de Alicante prospect |
| `/demo/huelva`         | `src/pages/demos/huelva/DemoHuelva.tsx`     | Interactive demo for Puerto de Huelva prospect   |
| `/demo/marin`          | `src/pages/demos/marin/DemoMarin.tsx`       | Interactive demo for Puerto de Marín prospect    |

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
```

Ports: `alicante` (CSV auto-update), `huelva` (PDF via `npm run update-demo:huelva`), `marin` (dos tablas HTML de apmarin.com cruzadas por código de escala, via `npm run update-demo:marin`). Cada puerto tiene su propio script de ingesta; sin código compartido entre demos por ahora.

To update a demo (change vessel data, statuses, alerts), only edit that port's `data.json`. See [demos/alicante/CLAUDE.md](src/pages/demos/alicante/CLAUDE.md) or [demos/huelva/CLAUDE.md](src/pages/demos/huelva/CLAUDE.md) for schema and walkthrough notes.

## Brand colors

| Token       | Hex       | Use                          |
| ----------- | --------- | ---------------------------- |
| `navyDeep`  | `#010B24` | Dark backgrounds, nav        |
| `navy`      | `#0A1F3D` | Primary text, active buttons |
| `cyan`      | `#079FE6` | Brand primary, CTAs          |
| `cyanLight` | `#29B6F6` | Badges, highlights           |
| `success`   | `#00C896` | Confirmed states             |
| `warning`   | `#F59E0B` | Alerts, in-progress          |
| `danger`    | `#EF4444` | Critical alerts, delays      |

## No authentication

There is no login or user accounts. CTA forms submit to **Formspree** (`https://formspree.io/f/…`).
