---
applyTo: "src/pages/demos/**,scripts/update-*.mjs"
---

# Demo data quality

## Huelva PDF ingestion

The demo data for Puerto de Huelva is ingested from a PDF published by the pilots'
association (`intranet.huelvapilots.com`). The PDF does not include IMO numbers, so
`imo` is always `'—'` for Huelva calls — do not flag this as a missing field.

The parser handles blank `Muelle` (berth) entries: when the PDF omits a berth,
the regex would otherwise capture the agent code in that slot. The `agentInBerth`
swap logic in `update-huelva.mjs` corrects this automatically.

## Marín HTML ingestion

The demo data for Puerto de Marín is scraped from two static HTML tables published
by the port authority (`apmarin.com`): `buques_esperados` (ETA) and `buques_puerto`
(ETD). They are joined by the `Escala` code (`M2026…`), which is the same in both.

Marín's tables do **not** publish `IMO`, `GT` (tonnage) or length. These are degraded:
`imo` is always `'—'`, and `gt`/`len` are `0` — do not flag any of these as missing
fields. `DemoMarin.tsx` shows "Datos de buque no publicados por la AP" instead of
"0 GT · 0 m". Do not enrich these from external sources (product decision: only
real data from the official source).

A vessel appears in `buques_esperados` **or** `buques_puerto`, never both at once, so
a single scrape never has ETA and ETD for the same call. `update-marin.mjs` recovers
the missing one from the previous `data.json`; on a cold start (no prior file) in-port
vessels legitimately show `eta: ""` until a later run captures it. This is expected.
