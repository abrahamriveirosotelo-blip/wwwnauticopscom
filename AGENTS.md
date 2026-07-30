# wwwnauticopscom

Marketing site for NauticOps (`nauticops.com`) plus interactive port demos. React + TypeScript + Vite SPA, deployed on Vercel.

> **Single source of instructions for coding agents.** Cursor reads this file natively; Claude Code loads it through the `@AGENTS.md` import in `CLAUDE.md`. **Always edit this file**, never the bridge — anything written elsewhere is invisible to whoever uses the other tool.

## Working rules

The quality gate is **not enforced**: protecting `main` needs repo admin, which this account does not have. It is a convention, kept by hand, without exceptions.

1. **Before every commit**: `npm run format`.
2. **Before opening or updating a PR**: `npm run verify` (`format:check → lint → typecheck → test → build`). Treat it as the target to iterate against, not a formality — change, run, fix, repeat. Report the outcome in the PR body **with numbers** ("3 errors / 8 warnings, same as baseline"), never "all green".
3. **Acceptance**: `format:check`, `typecheck`, `test` and `build` green, always. `lint` must not exceed its baseline of **3 errors + 8 warnings** (2× `no-empty-object-type`, 1× `no-require-imports`), which #80 will clear.
4. If something fails for a **pre-existing** reason, say so explicitly in the PR. Never silence it.
5. **Squash merge only** — one commit per PR, linear history. Merging `main` into a PR branch to catch up is fine; the squash collapses it anyway.
6. **`Closes #NN`** in the PR body when it closes an issue, or the issue stays open after the merge.
7. **Never hand-edit** `src/pages/demos/**/data.json` or `vessel-cache.json`: the cron rewrites them every 2h and commits straight to `main`.
8. **A repo-wide reformat gets its own PR**, with nothing else in it. Register its SHA in `.git-blame-ignore-revs` **afterwards**, in a separate PR — under squash the SHA only exists once merged (`gh pr view <n> --json mergeCommit --jq .mergeCommit.oid`).

Issues, PR titles and bodies, and commit messages are written in **Spanish**, matching the existing history. These instruction files are in English.

Once per clone: `git config blame.ignoreRevsFile .git-blame-ignore-revs`. GitHub applies it by itself in its web UI.

**Adding rules here**: only when an agent repeats the same mistake, or a review catches something it should have known. A file that grows unchecked ends up read worse than a short one. Anything that applies to a single folder belongs in that folder's instructions.

## Traps

- `npm run build` (Vite) **does not typecheck**. That is `npm run typecheck`.
- The legal route is `/legal/:section`. Plain `/legal` falls through to the 404 catch-all.
- `/demo/v2` is **not** a SPA route: it is `public/demo/v2/index.html`, self-contained, served by a `vercel.json` rewrite. Outside the Vite build and outside Prettier.
- **Two brand palettes that do not match.** The site uses Tailwind tokens backed by HSL CSS vars in `src/index.css` (`bg-navy-deep`, `bg-cyan-brand`, …), while each `Demo*.tsx` carries its own literal-hex `const B` (cyan is `#079FE6` there). `bg-cyan-brand` is **not** the demos' cyan. Unifying both is a natural candidate for the v2 consolidation (#28).
- `netlify.toml` survives and Netlify still builds PR previews alongside Vercel. A leftover `bun.lockb` survives too — the project runs on **npm**.

## Formatting

Prettier is the only formatter, pinned **exactly** (`"prettier": "3.9.6"`, no `^`): a minor release can change its output and turn PRs red that changed nothing. `prettier-plugin-tailwindcss` orders Tailwind classes, including inside `cn()` and `cva()` — never hand-order them.

Every `.prettierignore` entry earns its place: the cron-written JSON (avoids churn against automatic writes; `update-huelva.mjs` also writes without a trailing newline), `scripts/fixtures/` (raw scraped HTML whose invalid markup **crashes** Prettier's parser), and `public/demo/v2`. Scope is `wwwnauticopscom/` only — the monorepo root and the deprecated `port-control-center/` stay out.

## Demos

One folder per port under `src/pages/demos/<port>/`, with a strict split: **all data in JSON, zero domain data in TSX**. To change vessels, statuses or alerts, edit that port's `data.json` and nothing else. Each port has its own ingest script (`npm run update-demo:<port>`); no code is shared between demos yet. `marin/` is the most complete one — Leaflet fleet map, schedule playback, meteo block and an AIS cache.

⚠️ Per-demo instructions live in `src/pages/demos/<port>/CLAUDE.md`, so **Claude Code loads them only when working inside those folders, and Cursor never loads them**. This is the one deliberate exception to the single-source rule: the three demos merge into a single app in #28, so duplicating them now is throwaway work. On Cursor, open the file by hand before touching a demo.

## Misc

i18n through `src/contexts/LanguageContext.tsx`; strings in `src/lib/translations.ts` plus `src/lib/translations/` split by domain. Default language is English.

GA4 `G-LBV7LSXJDD` via `src/lib/analytics.ts`. No backend and no auth — CTA forms post to Formspree.
