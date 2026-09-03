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
cd /Users/maxter/dev/pessoal/bento-portifolio && grep -rn '\.\./\.\./src' artifacts/portfolio/functions ; echo "grep exit=$?" && (cd artifacts/portfolio && pnpm test 2>&1 | tail -4)
```

prints no matching lines, then `grep exit=1`, then a test tail with 0 failed test files.

## If stuck

if Vite or `wrangler` cannot resolve `@workspace/constants` from inside
`functions/`, do not fall back to a relative path into `artifacts/constants`. That trades one
inversion for a worse one. Record the resolution failure and treat it as the slice's real finding.
