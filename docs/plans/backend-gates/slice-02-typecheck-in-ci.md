---
status: todo
kanban: 58ebfa52-0a51-40ce-a3d7-5b5105039d3e
---

# Slice 2 — CI runs the worker type check

## Delivers

`pnpm run typecheck` in `artifacts/portfolio` runs both tsconfigs, so the existing
"Run type check" step in `.github/workflows/lint.yml` covers the backend without the workflow file
changing.

## Needs

- Slice 1 merged and green. Wiring an unclean check into CI breaks `main` on the next push, which is
  the exact failure this epic exists to avoid.
- 15 min reading `artifacts/portfolio/package.json` (`"typecheck": "tsc -p tsconfig.json --noEmit"`)
  and the root `package.json`, whose `typecheck` fans out with
  `pnpm -r --filter "./artifacts/**" --if-present run typecheck`.

## Design constraint

the change belongs in the package script, not in the workflow. The workflow
already calls `pnpm run typecheck`; a repo where the gate lives in YAML is a repo where running the
gate locally and running it in CI are different things.

## Tests

- The gate is the test, and it has to be proved in both directions: it passes on clean code, and it
  fails on a deliberately broken file.

## Done when

Passes on a clean tree:

```
cd artifacts/portfolio && pnpm run typecheck ; echo "exit=$?"
```

prints `exit=0`. And fails on a broken one:

```
cd artifacts/portfolio && printf '\nconst __gate: number = "not a number";\n' >> functions/lib/markdown.ts && pnpm run typecheck ; echo "exit=$?" ; git checkout -- functions/lib/markdown.ts
```

prints a `TS2322` diagnostic naming `functions/lib/markdown.ts` and then a non-zero `exit=`. If it
prints `exit=0`, the second tsconfig is not being reached and the slice is not done.

## If stuck

if running two tsconfigs from one script makes the failure output unreadable, use
`tsc --build` with project references rather than chaining two `tsc -p` calls with `&&`. Do not hide
the second run behind `|| true`.
