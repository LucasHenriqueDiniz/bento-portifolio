---
status: todo
kanban: f52602cc-a76b-4963-acf6-992528869212
---

# Slice 3 — the shims come out

## Delivers

every `src/**` import of the six moved modules points at `@workspace/constants`, and
`artifacts/portfolio/src/constants/` no longer holds a shim for any of them.

## Needs

- Slice 2 merged. The worker goes first because it is the one with the architectural problem; the
  frontend rewrite is cleanup.
- 30 min: 9 files under `artifacts/portfolio/` import from a `constants/` path today
  (`grep -rl 'constants/' --include='*.ts' --include='*.tsx' src functions` returns 9). Some use the
  `@/` alias, so a plain path search will miss them — search for both `@/constants` and
  `./constants`.

## Design constraint

the four modules that did not move (`personSchema`, `publications`,
`timelineData`, and the directory README) stay under `src/constants/`. The directory does not
disappear; only the six shims do.

## Tests

- The existing suite stays green, and `pnpm run build` succeeds — the build is what catches an alias
  that resolved in `vitest` but not in Vite.

## Done when

```
cd /Users/maxter/dev/pessoal/bento-portifolio/artifacts/portfolio && ls src/constants/ && grep -rn "constants/\(projects\|contacts\|jobExperiences\|academicExperiences\|skillsData\|languages\)" src functions ; echo "grep exit=$?"
```

lists only `README.md`, `index.ts`, `personSchema.ts`, `publications.ts` and `timelineData.ts`, then
prints `grep exit=1` with no matching lines above it.

## If stuck

if `src/constants/index.ts` is the barrel half the app imports and unpicking it turns
into a 40-file diff, split this slice: `03a` rewrites the barrel to re-export from
`@workspace/constants` and stops there, `03b` deletes the barrel. Fractional numbers are the point.
