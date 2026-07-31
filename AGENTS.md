# wwwnauticopscom

Marketing site for NauticOps (`nauticops.com`) plus interactive port demos. React + TypeScript + Vite SPA, deployed on Vercel.

> **Single source of instructions for coding agents.** Cursor reads this file natively; Claude Code loads it through the `@AGENTS.md` import in `CLAUDE.md`. **Always edit this file**, never the bridge — anything written elsewhere is invisible to whoever uses the other tool.

## Working rules

The quality gate is **not enforced**: protecting `main` needs repo admin, which this account does not have. It is a convention, kept by hand, without exceptions.

1. **Before every commit**: `npm run format`.
2. **Before opening or updating a PR**: `npm run verify` (`format:check → lint → typecheck → test → build`). Treat it as the target to iterate against, not a formality — change, run, fix, repeat. Report the outcome in the PR body **with numbers** ("0 errors / 8 warnings, same as baseline"), never "all green".
3. **Acceptance**: the whole chain green, no exceptions. `lint` allows **0 errors**; its 8 `react-refresh/only-export-components` warnings are the known ceiling — 7 come from shadcn components that export variants alongside the component, 1 from `LanguageContext.tsx`. Do not add a ninth.
4. If something fails for a **pre-existing** reason, say so explicitly in the PR. Never silence it.
5. **Squash merge only** — one commit per PR, linear history. Merging `main` into a PR branch to catch up is fine; the squash collapses it anyway.
6. **`Closes #NN`** in the PR body when it closes an issue, or the issue stays open after the merge.
7. **Never hand-edit** `src/pages/demos/**/data.json` or `vessel-cache.json`: the cron rewrites them every 2h and commits straight to `main`.
8. **A repo-wide reformat gets its own PR**, with nothing else in it. Register its SHA in `.git-blame-ignore-revs` **afterwards**, in a separate PR — under squash the SHA only exists once merged (`gh pr view <n> --json mergeCommit --jq .mergeCommit.oid`).

**Language**: commit messages and these instruction files are in **English**. Issues and PR titles and bodies stay in **Spanish**.

Once per clone: `git config blame.ignoreRevsFile .git-blame-ignore-revs`. GitHub applies it by itself in its web UI.

**Adding rules here** — a file that grows unchecked gets read worse than a short one, so every line must earn its place:

- Add a rule only when an agent repeated the same mistake, or a review caught something it should have known. Not preemptively.
- Nothing an agent can work out by reading the code. Routes, file trees, dependency lists and colour values belong in the code, not here.
- Descriptive documentation goes in the README. This file is only for what changes an agent's behaviour.
- Anything that applies to a single folder goes in that folder's instructions.
- A rule that exists because of an open issue names it, and dies with it: rule 3 goes when #80 closes, the demo exception when #28 does.

## Scaling instructions

Splitting a file into `@imports` saves nothing — imported files load at launch too. What scales is **conditional loading**, so a new instruction goes to the narrowest tier that fits, and this trunk keeps only what applies to _every_ task:

| Tier              | Loads                       | Claude Code                     | Cursor                           |
| ----------------- | --------------------------- | ------------------------------- | -------------------------------- |
| Trunk (this file) | always                      | `CLAUDE.md`                     | `AGENTS.md`                      |
| Per path          | on touching a matching file | `.claude/rules/*.md` + `paths:` | `.cursor/rules/*.mdc` + `globs:` |
| Per folder        | on working inside it        | nested `CLAUDE.md`              | nested `AGENTS.md`               |
| On demand         | when the task calls for it  | skills                          | `.mdc` + `description`           |

Scaling means **moving an instruction down a tier, never deleting it** — below the trunk there is no size pressure. Per-path is the one tier where both tools need separate files: keep each to three lines pointing at one shared document, so there is still a single source. A long procedure ("how to add a new port") is a skill, not a rule.

## Traps

- `npm run build` (Vite) **does not typecheck**. That is `npm run typecheck`.
- Never reduce `typecheck` to a bare `tsc --noEmit`. The root `tsconfig.json` is a solution file (`"files": []` plus project references) and `tsc` does not follow references without `-b`, so a bare run checks **zero files and exits 0**. It hid 14 real errors — four of them blank text on the live landing page — until #80. The script names each project explicitly for that reason.
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

No backend and no auth: CTA forms post to Formspree. The UI defaults to **English**, not Spanish, despite the market — i18n lives in `LanguageContext` plus `src/lib/translations/`.
