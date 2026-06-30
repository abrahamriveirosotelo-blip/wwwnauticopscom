---
applyTo: "src/pages/demos/**,scripts/update-*.mjs,scripts/enrich-*.mjs,scripts/lib/*.mjs"
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

Marín's tables do **not** publish `IMO`, `GT` (tonnage), length or flag. `update-marin.mjs`
leaves them degraded (`imo: '—'`, `gt`/`len`: `0`) — do not flag any of these as missing
fields. A second step, `enrich-marin.mjs`, fills them from vesselfinder.com **when the match
is reliable** (see below); when it isn't, they stay degraded and `DemoMarin.tsx` shows
"Datos de buque no publicados por la AP" instead of "0 GT · 0 m".

A vessel appears in `buques_esperados` **or** `buques_puerto`, never both at once, so
a single scrape never has ETA and ETD for the same call. `update-marin.mjs` recovers
the missing one from the previous `data.json`; on a cold start (no prior file) in-port
vessels legitimately show `eta: ""` until a later run captures it. This is expected.

### Marín vessel enrichment (vesselfinder.com)

`imo`/`gt`/`dwt`/`len`/`flag`/`vesselType`/`built`/`callsign` are NOT from the port authority —
`enrich-marin.mjs` fills them from vesselfinder.com **after** `update-marin.mjs`. Matching is **conservative**:
a vessel is only enriched when there is a single commercial-type result for the exact name,
or when VesselFinder's `Destination` confirms the call (contains "Marin", or matches `to`).
When uncertain it is left at `'—'`/`0` — never guess another ship's IMO/GT. So some calls
staying unenriched (e.g. ambiguous names) is correct behaviour, not a bug.

Results are cached in `src/pages/demos/marin/vessel-cache.json` (keyed by normalized
name + destination, since names are not unique; static particulars are immutable).

`enrich-marin-live.mjs` adds **live AIS** fields (`aisStatus`, `aisSpeed`, `aisDraught`,
`aisEta`, `aisDestination`, `aisAt`, plus the derived booleans `aisAtMarin` and
`aisToFinal`) from VesselFinder, by IMO, **without caching** (dynamic — re-fetched each
run). The derived booleans are computed in the script (token-matching via the lib), NOT
in the TSX, so the view never re-implements port matching. The AIS ETA is UTC, converted
to Europe/Madrid to be comparable with the AP's local ETA; `aisAt` is the absolute snapshot
time (Europe/Madrid), not a relative "X min ago" string (which would lie once committed).
Only vessels currently under way carry an ETA/speed; moored ones don't (they've arrived —
not a bug). These fields are optional and the UI hides the AIS card when absent.

`update-marin.mjs` (via `buildCalls`) carries the enrichment fields forward from the
previous `data.json`, so a skipped/failed enrich step keeps the last known values instead
of wiping them; the enrich steps refresh them when they run.

Position (lat/lon), course/heading and distance-to-go are NOT in VesselFinder's public
HTML (JS map widget / premium) and are intentionally not scraped — they'd need a paid AIS API.
