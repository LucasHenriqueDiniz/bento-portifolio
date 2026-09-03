---
status: todo
kanban: fffcf4fd-842c-4b2e-b8b8-30d6885964b8
---

# Slice 1 — `@workspace/constants` exists and builds

## Delivers

a second workspace package at `artifacts/constants`, holding the six modules the
worker reads (`projects`, `contacts`, `jobExperiences`, `academicExperiences`, `skillsData`,
`languages`), moved with `git mv`, behind a new `index.ts` of its own. The six files they left
behind under `src/constants/` become re-export shims, so `src/constants/index.ts` — the barrel that
`export *`s eight modules today — keeps working untouched and nothing else changes yet.

## Needs

- Nothing outside the repo. `pnpm-workspace.yaml` already globs `artifacts/*`, so the package is
  picked up with no workspace edit.
- 20 min reading `artifacts/portfolio/src/constants/` — 10 modules plus a README, of which 6 are
  imported by the worker and 4 (`index`, `personSchema`, `publications`, `timelineData`) are not.
  Note that `index.ts` does not re-export `timelineData`, so the barrel is not a complete picture of
  the directory.

## Design constraint

`tsconfig.base.json` already sets `"customConditions": ["workspace"]`. Use
it: the package resolves to its TypeScript source under that condition, so there is no build step
and no `dist/` to keep in sync.

## Design constraint

move only what the worker needs. `personSchema.ts` and the rest stay in
`src/` until something outside the frontend asks for them; a package that holds everything is the
`lib/` mistake the pitch is avoiding.

## Tests

- The existing suite is the test. Nothing imports the new package yet, so a green run proves the
  shims are transparent.
- `pnpm run typecheck` at the repo root still passes, proving the new package did not break the
  `tsc --build` graph.

## Done when

```
cd /Users/maxter/dev/pessoal/bento-portifolio && test -f artifacts/constants/package.json && node -e 'process.stdout.write(require("./artifacts/constants/package.json").name)' && pnpm run typecheck && (cd artifacts/portfolio && pnpm test 2>&1 | tail -4)
```

prints `@workspace/constants`, the typecheck exits 0, and the test tail shows 0 failed test files
with `Tests N passed (N)` where N >= 122.

## If stuck

if `customConditions` does not resolve the source and the package wants a build step,
stop and write down what failed before adding one. A build step for six data modules is a signal the
package boundary is in the wrong place, not a thing to work around.
