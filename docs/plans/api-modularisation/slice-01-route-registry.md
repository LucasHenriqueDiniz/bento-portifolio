---
status: todo
kanban: b619ed25-76b1-415b-aece-7f42aeb50477
---

# Slice 1 — Route registry, proved on the three trivial routes

## Delivers

`functions/api/routes/` exists with a route table, and `onRequest` dispatches through
it. `portfolio/visitors`, `POST portfolio/visitors/increment` and `portfolio/projects` are served
from modules instead of from the `if` chain; the other eight routes still run from `[[path]].ts`
unchanged.

## Needs

- Nothing. This is the first slice of the epic and depends on no other work.
- 20 min reading `functions/api/[[path]].ts` lines 219-239 and 709-726 — the dispatch entry, the
  three routes being moved, and the shared `catch`.

## Design constraint

the `catch` at line 720 is not uniform: `portfolio/mal` returns empty stats
with a 60s cache, everything else returns `502 Upstream error`. The registry must keep that as a
per-route fallback, not flatten it. None of the three routes in this slice uses the special case,
which is exactly why they go first.

## Tests

- `functions/api/[[path]].visitors.test.ts` passes unchanged — all 5 cases, including
  "rejects unsupported methods on the increment route", which is the one that proves the dispatcher
  still distinguishes method as well as path.
- A new test for the registry itself: an unknown path resolves to no route, so `onRequest` returns
  404.
- No test file is edited to make it pass. If a test needs changing, the dispatch contract changed and
  that belongs in the slice notes.

## Done when

```
cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5 && wc -l 'functions/api/[[path]].ts'
```

prints a `Test Files` line with 0 failed and a `Tests N passed (N)` line where N >= 123, and a line
count of 720 or less. The floor is 123, not 122: the suite is green today at 25 files / 122 tests, so
122 is already true before any work, and the registry test the Tests section asks for is the 123rd.
Do not pin the file count — this slice adds a test file, so a finished slice prints 26, and the
absolute count keeps moving as slices 2 to 6 add their own.

## If stuck

if the `PagesFunction<Env>` signature makes a route table awkward to type without
Workers ambient types, do not pull `backend-gates` forward. Type the table against a local
`type RouteHandler = (ctx: { request: Request; env: Env; path: string }) => Promise<Response>` and
leave the ambient-types question where it belongs.
