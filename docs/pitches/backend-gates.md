---
status: active
epic: gates
---

# Make CI actually gate the backend

## The problem, in two halves

### Type check does not see `functions/**`

```
$ cat artifacts/portfolio/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  ...
```

`pnpm run typecheck` is `tsc -p tsconfig.json --noEmit`, and that `include` is the whole story: the
726-line production worker has never been type checked. There is no second tsconfig either —
`git ls-files | grep tsconfig` returns exactly `tsconfig.json`, `tsconfig.base.json` and
`artifacts/portfolio/tsconfig.json`.

There is also no ambient type source for the Workers runtime in the tree: no
`worker-configuration.d.ts` is tracked, and `@cloudflare/workers-types` is not installed (only
`@cloudflare/kv-asset-handler`, `@cloudflare/unenv-preset` and `workerd` appear under
`node_modules/.pnpm`). `[[path]].ts` names `PagesFunction`, `KVNamespace` and `D1Database`, so
turning the check on is not a one-line `include` edit — it needs the types first.

### Lint cannot fail

```
$ cd artifacts/portfolio && pnpm exec eslint .
✖ 120 problems (0 errors, 120 warnings)
```

| rule | count |
|---|---|
| `@typescript-eslint/no-explicit-any` | 88 |
| `@typescript-eslint/no-unused-vars` | 17 |
| `react-hooks/exhaustive-deps` | 15 |

| area | count |
|---|---|
| `src/` | 73 |
| `functions/` | 47 |

`package.json` runs `eslint .` with no `--max-warnings`, so the CI step is green by construction.
The `lint` skill: *"A warning that does not fail the build is not a warning, it is a comment"* — and
it also says not to add the flag quietly, because adding it is the moment the 120 have to be dealt
with.

## Why it is one epic

Both halves fail the same way: the gate exists in the workflow file, runs, and cannot say no. And
both cost the same thing to close — a pile of pre-existing findings that has to be worked through
before the flag flips, or the first push after the flip breaks `main`.

## Ordering

After `shared-constants` and preferably after `api-modularisation`. Nothing forces it, but 47 of the
120 warnings live in `functions/`, and most of them are in the one file the API epic is splitting up.
