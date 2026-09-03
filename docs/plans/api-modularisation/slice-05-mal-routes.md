---
status: todo
kanban: 22ee2954-3358-4fad-8eb7-b5d9f55eb104
---

# Slice 5 — MyAnimeList routes, including the special-case fallback

## Delivers

`portfolio/mal` and `portfolio/mal/details` in `functions/api/routes/mal.ts`, with
`fetchJikanUserResource` (line 107), `fetchJikanDetails` (line 123), the `JIKAN_BASE` /
`JIKAN_HEADERS` constants (lines 15-19) and the `lastGoodMal` module-level cache (line 21) moved
with them.

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
- New: `portfolio/mal` with the upstream throwing returns the zeroed stats object, not a 502. This
  is the regression the whole slice exists to prevent.
- New: two sequential `portfolio/mal` requests, the second with the upstream failing, serve the
  first one's payload from `lastGoodMal`.

## Done when

```
cd artifacts/portfolio && pnpm test 2>&1 | tail -4 && wc -l 'functions/api/[[path]].ts' functions/api/routes/mal.ts
```

prints 0 failed test files, `[[path]].ts` at 260 lines or less, and `mal.ts` at 200 or less.

## If stuck

if the `lastGoodMal` behaviour cannot be reproduced under `vitest` because each test
gets a fresh module registry, do not delete the cache to make the test pass. Drop the third test,
write down that it is unverified in the slice notes, and keep the code as it is.
