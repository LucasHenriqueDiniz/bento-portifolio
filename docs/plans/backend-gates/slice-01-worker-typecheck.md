---
status: todo
kanban: b64c54c0-4537-4cc6-8bac-e7327e2819e3
---

# Slice 1 — `functions/**` type checks clean, off to one side

## Delivers

`artifacts/portfolio/tsconfig.functions.json`, extending `tsconfig.base.json`,
including `functions/**/*` with the Workers ambient types available, and every error it reports
fixed. CI does not run it yet — that is slice 2, deliberately, so this slice can be merged without
being able to break `main`.

## Needs

- A source of Workers types. There is none in the tree today: no `worker-configuration.d.ts` is
  tracked, and `ls node_modules/.pnpm | grep -i cloudflare` returns only `kv-asset-handler`,
  `unenv-preset` and `workerd-darwin-arm64`. Either add `@cloudflare/workers-types` as a
  devDependency or generate `worker-configuration.d.ts` from the installed `wrangler` (4.87). Decide
  which in this slice and say why in the commit.
- `artifacts/portfolio/tsconfig.json` stays as it is. Two tsconfigs is the point: the existing one
  is `"jsx": "preserve"` with `types: ["node", "vite/client"]`, which is not what a Worker is.
- 1-2 h. The size is unknown until `tsc` runs — the 88 `no-explicit-any` warnings are *explicit*
  `any`, which `noImplicitAny: true` does not reject, so the error count could be far smaller than
  the warning count suggests. Measure before estimating further.

## Design constraint

`noEmitOnError`, `strictNullChecks` and `useUnknownInCatchVariables` are all
already on in `tsconfig.base.json`. Do not relax them for `functions/`. If a specific file needs an
escape hatch, it gets one line of `@ts-expect-error` with a reason, not a loosened compiler option
for the whole worker.

## Tests

- `pnpm test` stays green. A type fix that changes runtime behaviour is a bug, and the 122 existing
  tests are what catches it.
- No new tests. This slice buys a compiler, not coverage.

## Done when

```
cd artifacts/portfolio && pnpm exec tsc -p tsconfig.functions.json --noEmit ; echo "tsc exit=$?"
```

prints no diagnostics and then `tsc exit=0`.

## If stuck

if the error count comes back large enough that fixing it in one slice is not honest,
split by directory: `01a` covers `functions/_middleware.ts` and `functions/lib/`, `01b` covers
`functions/api/`, and the `include` grows between them. Do not ship a tsconfig with
`"strict": false` to make the number go to zero.
