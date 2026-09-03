---
status: todo
kanban: 549ac6ab-b1f4-47c0-9ae7-cc5a60d4b9a8
---

# Slice 2 — Last.fm routes into their own module

## Delivers

`portfolio/now-playing`, `portfolio/top-artists` and `portfolio/top-tracks` served
from `functions/api/routes/lastfm.ts`, registered in the table from slice 1. The `LASTFM_API_KEY` /
`LASTFM_USERNAME` reads move with them.

## Needs

- Slice 1 merged: the registry is the thing these register into.
- 15 min reading `[[path]].ts` lines 240-329.

## Tests

- The existing 122 stay green.
- New: `now-playing` with no `LASTFM_API_KEY` in `env` returns the same response it returns today.
  Read the current behaviour from the code before writing the expectation — do not assume it 502s.
- New: `top-artists` and `top-tracks` each pass their cache key to `cached()` unchanged, so the KV
  entries written before the move keep being read after it.

## Done when

```
cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5 && wc -l 'functions/api/[[path]].ts' functions/api/routes/lastfm.ts
```

prints `Test Files` with 0 failed, `[[path]].ts` at 640 lines or less, and `lastfm.ts` at 200 or
less.

## If stuck

the three routes share Last.fm response shapes. If splitting them into three modules
duplicates types, keep one `lastfm.ts` for all three; the ceiling is 200 lines per file, not one
route per file.
