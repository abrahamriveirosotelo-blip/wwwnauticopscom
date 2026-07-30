@AGENTS.md

## Claude Code only

Everything above is imported from `AGENTS.md`, the single source shared with Cursor. **New instructions go there**, not here: whatever is written in this file is invisible to anyone working with Cursor.

- **Nested instructions**: each demo has its own `CLAUDE.md` under `src/pages/demos/<port>/`, loaded when reading files in those folders. They are the exception to the single source — Cursor cannot see them — and were left unduplicated on purpose: they disappear when #28 merges the demos into one app.
- **Auto memory** is local to each machine and is never shared with the team. Anything learned that should apply to everyone belongs in `AGENTS.md`.
