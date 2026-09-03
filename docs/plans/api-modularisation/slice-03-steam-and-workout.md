---
status: todo
kanban: 195c524c-a2cd-498e-9781-75b762dcb9b0
---

# Slice 3 — Steam and Lyfta routes into their own modules

## Delivers

`portfolio/steam` in `functions/api/routes/steam.ts` and `portfolio/workout` in
`functions/api/routes/workout.ts`, both registered in the table.

## Needs

- Slice 1 merged.
- 20 min reading `[[path]].ts` lines 330-445. `workout` is 79 lines and the larger of the two.

## Tests

- The existing suite stays green.
- New: `portfolio/steam` with `STEAM_API_KEY` absent returns the same status and body as before the
  move.
- New: `portfolio/workout` with the upstream rejecting produces the same 502 the shared `catch`
  produced, proving the per-route fallback from slice 1 carries the default case.

## Done when

```
cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5 && wc -l 'functions/api/[[path]].ts'
```

prints 0 failed test files and a line count of 530 or less.

## If stuck

if `workout` turns out to share helpers with `stats` (both aggregate into the same
dashboard shape), stop and move the shared helper into `functions/api/routes/shared.ts` in this
slice rather than duplicating it and cleaning up in slice 4.
