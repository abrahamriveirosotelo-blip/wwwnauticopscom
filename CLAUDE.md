# wwwnauticopscom

React + TypeScript + Vite SPA. The public marketing website for NauticOps (`nauticops.com`), deployed via Netlify.

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS + shadcn/ui** (components copied into `src/components/ui/`)
- **Bun** as package manager
- **React Router** for routing
- **Netlify** for deployment (`netlify.toml` present)
- No backend, no auth.

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `src/pages/Index.tsx` | Main landing page |
| `/shipping-agents` | `src/pages/ShippingAgentsPage.tsx` | Targeted page for shipping agents |
| `/legal` | `src/pages/LegalPage.tsx` | Legal / privacy |
| `/demos/alicante` | `src/pages/demos/alicante/DemoAlicante.tsx` | Interactive demo for Puerto de Alicante prospect |

## Architecture

**i18n:** `src/contexts/LanguageContext.tsx` provides `language`, `setLanguage`, and a `t` object (typed `Translations`). Translations live in `src/lib/translations.ts` and the `src/lib/translations/` directory (split by domain: `about`, `legal`, `shippingAgents`). Default language is English (`'en'`).

**Analytics:** `src/lib/analytics.ts` + `src/hooks/usePageTracking.ts` handle page view tracking.

## Demo pattern

Demos follow a strict separation: **all data in JSON, zero domain data in TSX.**

```
src/pages/demos/alicante/
  DemoAlicante.tsx   — UI and logic only
  data.json          — all calls, tug service, milestones
  CLAUDE.md          — demo-specific documentation
```

To update the demo (change vessel data, statuses, alerts), only edit `data.json`. See [demos/alicante/CLAUDE.md](src/pages/demos/alicante/CLAUDE.md) for the full data schema and demo walkthrough notes.

## Brand colors

| Token | Hex | Use |
|-------|-----|-----|
| `navyDeep` | `#010B24` | Dark backgrounds, nav |
| `navy` | `#0A1F3D` | Primary text, active buttons |
| `cyan` | `#079FE6` | Brand primary, CTAs |
| `cyanLight` | `#29B6F6` | Badges, highlights |
| `success` | `#00C896` | Confirmed states |
| `warning` | `#F59E0B` | Alerts, in-progress |
| `danger` | `#EF4444` | Critical alerts, delays |

## No authentication

There is no login or user accounts. CTA forms submit to a third-party handler (Netlify Forms).
