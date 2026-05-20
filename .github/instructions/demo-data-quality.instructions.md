---
applyTo: "src/pages/demos/**,scripts/update-*.mjs"
---

# Demo data quality

## Known source data issues — do not flag

The demo data for Puerto de Huelva is ingested from a PDF published by the pilots'
association (`intranet.huelvapilots.com`). The source document occasionally contains
field mismatches (e.g. a consignee code such as `E.CIA` appearing in the `berth` column).

These are **errors in the upstream PDF**, not in the parser or the JSON schema.
The project has consciously decided not to sanitise them: fixing upstream data is the
data owner's responsibility. Do not raise review comments about `berth` values that look
like consignee codes (`E.CIA`, `ERS`, `IBM`, `PAM`, …) — they reflect the source as-is.
