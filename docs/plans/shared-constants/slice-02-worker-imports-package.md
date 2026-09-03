---
status: todo
kanban: 7d83dc36-f6cd-4434-9245-96f67b07c765
---

# Slice 2 — the worker stops reaching into `src/`

## Delivers

`functions/lib/markdown.ts` imports `@workspace/constants` instead of
`../../src/constants/*`. The dependency inversion is gone; `functions/` depends on a package, not on
the frontend's source tree.

## Needs

- Slice 1 merged.
- `@workspace/constants` listed as a dependency of `@workspace/portfolio` in
  `artifacts/portfolio/package.json`, so the import is declared rather than resolved by accident
  through the workspace root.
- 10 min reading `functions/lib/markdown.ts` lines 1-6.

## Tests

- The existing suite stays green — `markdown.ts` feeds the markdown views of the site, so a broken
  import shows up there.
- New, if `markdown.ts` has no direct coverage today: one test asserting the generated markdown for
  a known project contains that project's title, so the import is exercised rather than merely
  compiled.

## Done when

```
cd /Users/maxter/dev/pessoal/bento-portifolio && ! grep -rn '\.\./\.\./src' artifacts/portfolio/functions && (cd artifacts/portfolio && set -o pipefail && pnpm test 2>&1 | tail -5)
```

prints no matching lines, then a `Test Files` line with 0 failed, and exits 0. Today it prints the
six imports in `functions/lib/markdown.ts` and stops there with exit 1, which is the failure this
slice removes. Two things the earlier `; echo "grep exit=$?"` form got wrong, both measured on this
branch: the gate exited 0 while all six imports were still in place, and `tail -4` cut off the
`Test Files` line the criterion reads. `! grep` makes the surviving import the exit status, and
`set -o pipefail` inside the subshell stops a red suite from exiting 0 through `tail`.

## If stuck

if Vite or `wrangler` cannot resolve `@workspace/constants` from inside
`functions/`, do not fall back to a relative path into `artifacts/constants`. That trades one
inversion for a worse one. Record the resolution failure and treat it as the slice's real finding.
