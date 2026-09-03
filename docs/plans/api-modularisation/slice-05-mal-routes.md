---
status: todo
kanban: 22ee2954-3358-4fad-8eb7-b5d9f55eb104
---

# Slice 5 — MyAnimeList routes, including the special-case fallback

## Delivers

`portfolio/mal` and `portfolio/mal/details` in `functions/api/routes/mal.ts`, with
`fetchJikanUserResource` (line 107), `fetchJikanDetails` (line 123), the `JIKAN_BASE` /
`JIKAN_HEADERS` constants (lines 15-19) and the `lastGoodMal` module-level cache (line 21) moved
with them — plus the two tests under Tests that pin the fallback, which the check below counts by
name rather than trusting the suite total.

## Needs

- Slice 1 merged, because this is the slice that exercises the per-route fallback the registry was
  built for.
- 30 min reading `[[path]].ts` lines 559-682, plus lines 15-21 and 107-154 for the helpers, plus the
  `catch` at 719-726.

## Design constraint

`portfolio/mal` is the one route whose failure mode is not a 502. The
current `catch` returns a zeroed stats object with a 60s cache. That fallback moves into the route's
own registration; if it ends up anywhere else, the registry contract from slice 1 was wrong and this
slice fixes it there rather than special-casing the dispatcher.

## Design constraint

`lastGoodMal` is mutable module state on a Worker isolate. Moving it to
another module keeps that behaviour only if the module is imported once. Assert it, do not assume
it.

## Tests

- `functions/api/[[path]].mal-details.test.ts` passes unchanged — all 3 validation cases (missing
  `type`/`ids`, invalid `type`, more than 20 ids).
- Both new tests go in one `describe("portfolio/mal fallback", ...)` block. The name is not
  cosmetic: the check below selects them with `vitest -t` and reads the count back, so a block named
  anything else reads as zero tests written.
- New: `portfolio/mal` with the upstream throwing returns the zeroed stats object, not a 502. This
  is the regression the whole slice exists to prevent.
- New: two sequential `portfolio/mal` requests, the second with the upstream failing, serve the
  first one's payload from `lastGoodMal`.

## Done when

```
cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5 && pnpm test -t 'portfolio/mal fallback' 2>&1 | grep -E '^ +Tests +2 passed' && wc -l 'functions/api/[[path]].ts' functions/api/routes/mal.ts
```

prints `Test Files N passed (N)` with 0 failed, then `Tests  2 passed | ... skipped`, then
`[[path]].ts` at 260 lines or less and `mal.ts` at 200 or less.

Measured on this branch before the work: the suite is `Test Files 25 passed (25)` /
`Tests 122 passed (122)`, and the chain exits 1 at the `-t` step — `portfolio/mal fallback` selects
nothing, so vitest reports `Tests 122 skipped (122)` and `wc` never runs. That is the whole point of
the middle step. "0 failed test files" is already true today, so it cannot on its own tell a
finished slice from an untouched tree; only the named-test count can. A `Tests N passed (N)` floor
would not work here either — slices 1 through 4 add seven or more tests of their own before this one
runs, so any absolute N this slice could name is reached without writing either test below.

Three details worth keeping, each of them a bug that was in this check:

- `tail -5`, not `tail -4`. On a green run vitest prints `Test Files`, `Tests`, `Start at`,
  `Duration` and a blank line — `tail -4` cuts off the `Test Files` line the criterion reads.
- `set -o pipefail`, because `pnpm test 2>&1 | tail -5` takes its exit status from `tail`, which
  succeeds whether or not the suite did.
- the `-t` run is a second invocation on purpose. Filtering the only run would leave the rest of the
  suite skipped and prove nothing about it.

## If stuck

if the `lastGoodMal` behaviour cannot be reproduced under `vitest` because each test
gets a fresh module registry, do not delete the cache to make the test pass. Drop that one test —
the `lastGoodMal` one, never the zeroed-stats one — keep the code as it is, and in the same commit
change the check's `2 passed` to `1 passed` with the reason written here. Leaving the check at `2`
while shipping one test turns a red gate into a puzzle for whoever runs it next.
