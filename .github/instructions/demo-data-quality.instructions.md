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
