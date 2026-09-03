---
status: todo
kanban: 23eac554-ff0d-4c94-84cc-fc4ab22f489b
---

# Slice 4 — GitHub stats route into its own module

## Delivers

`portfolio/stats` in `functions/api/routes/stats.ts`, with the `LANG_COLORS` map
(`[[path]].ts` lines 23-40) moved next to the only code that reads it.

## Needs

- Slice 1 merged.
- 30 min reading `[[path]].ts` lines 446-558. At 113 lines this is the single largest route, and it
  reads both `GITHUB_USERNAME` and `GITHUB_PAT`.

## Tests

- The existing suite stays green.
- New: with `GITHUB_PAT` absent, the route behaves as it does today. Read the current code for what
  that is; the token is optional in `Env` and the unauthenticated path may be a real code path
  rather than an error.
- New: a language the `LANG_COLORS` map does not list still appears in the response, with whatever
  fallback colour the current code uses.

## Done when

```
cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5 && wc -l 'functions/api/[[path]].ts' functions/api/routes/stats.ts
```

prints 0 failed test files, `[[path]].ts` at 400 lines or less, and `stats.ts` at 200 or less.

## If stuck

if `stats.ts` lands over 200 lines on its own, split it by upstream call
(`stats.ts` for the route, `github.ts` for the API client) rather than raising the ceiling.
