---
status: active
epic: api
---

# Split the Pages Function into one module per resource

## The problem

`artifacts/portfolio/functions/api/[[path]].ts` is 726 lines. The exported handler alone is
508 of them:

```
$ wc -l 'artifacts/portfolio/functions/api/[[path]].ts'
     726
$ grep -n 'export const onRequest' 'artifacts/portfolio/functions/api/[[path]].ts'
219:export const onRequest: PagesFunction<Env> = async (context) => {
```

The `clean-code` skill puts a hard ceiling of 200 lines on a file. This one is 3.6x that, and its
handler is 2.5x that on its own.

Eleven routes share one `try` block and one 404 fallback:

| line | route |
|---|---|
| 223 | `POST portfolio/visitors/increment` |
| 240 | `portfolio/now-playing` |
| 285 | `portfolio/top-artists` |
| 307 | `portfolio/top-tracks` |
| 330 | `portfolio/steam` |
| 367 | `portfolio/workout` |
| 446 | `portfolio/stats` |
| 559 | `portfolio/mal` |
| 619 | `portfolio/mal/details` |
| 683 | `portfolio/machines` |
| 709 | `portfolio/visitors` |
| 715 | `portfolio/projects` |

## Why this is not a small change

This file is the production endpoint for the whole site — Last.fm, Steam, Lyfta, GitHub, MAL and the
D1 telemetry all land here. Touching the dispatch touches every integration at once, and the shared
`catch` at line 720 carries per-route behaviour (`portfolio/mal` gets an empty-stats fallback,
everything else gets a 502), so a naive extraction changes error semantics silently.

## What makes it safe

`vitest` already covers three of the routes end to end:

```
$ cd artifacts/portfolio && pnpm test
 Test Files  25 passed (25)
      Tests  122 passed (122)
```

The plan moves one group of routes per slice and keeps that suite green after each one, so a
regression is attributable to a single slice instead of to "the refactor".

## Shape

A route registry in `functions/api/routes/`, one module per upstream, and `onRequest` reduced to
lookup plus the shared error contract. No new layer: the modules are the same handlers, addressed by
a table instead of by a chain of `if`s.

## Ordering

Independent of the other epics. Doing it before `backend-gates` makes the typecheck slice smaller,
because the `any`s get spread over modules instead of piling into one file — but nothing forces
that order.

## Line budget

Each slice names an upper bound for `wc -l` on `[[path]].ts`. Those bounds are derived from the
measured span of the routes being moved; they are targets, not measurements of a future state.
