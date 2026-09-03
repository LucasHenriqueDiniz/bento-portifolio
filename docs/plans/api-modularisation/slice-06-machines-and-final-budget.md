---
status: todo
kanban: 685b938e-7b00-4e23-b8ac-747edc3628e8
---

# Slice 6 — Machines route out, and the whole directory under the ceiling

## Delivers

`portfolio/machines` in `functions/api/routes/machines.ts`, with `MetricRow`
(line 155), `MACHINE_METRICS_SQL`, `buildMachineStatus` and `fetchServerFromPublicStats` (line 194)
moved with it. `[[path]].ts` is left holding only `Env`, the dispatcher, and the shared helpers
`json` (line 43) and `cached` (line 52) — or those two move to `functions/api/routes/http.ts`, if
that is what it takes to get under the ceiling.

## Needs

- Slices 1-5 merged. This is the last route out.
- 20 min reading `[[path]].ts` lines 155-218 and 683-707. The D1 path has two nested fallbacks
  (empty result set, and query failure) that both downgrade to the public stats endpoint.

## Tests

- `functions/api/[[path]].machines.test.ts` passes unchanged — all 5 cases, including the two
  fallback paths and the 502 when both D1 and the public endpoint fail.
- New: an unknown path returns 404 and does not touch `env.DAILY_INGEST_DB`.

## Done when

```
cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5 && find functions -name '*.ts' ! -name '*.test.ts' -exec wc -l {} + | awk '$1 > 200 && $2 != "total"'
```

prints 0 failed test files and then **nothing at all** — no file under `functions/` outside the
tests is over 200 lines.

## If stuck

if `[[path]].ts` cannot get under 200 because `Env` plus the dispatcher plus the
route imports is genuinely that long, move `Env` to `functions/api/env.ts` and import it. Do not
raise the ceiling, and do not delete the per-route comments to buy lines.
