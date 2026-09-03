---
status: todo
kanban: 1be32f63-dfbb-4249-94ab-05fd0880a4ba
---

# Slice 3 — 120 warnings to zero, then the flag

## Delivers

`eslint .` reports nothing, and `artifacts/portfolio/package.json` runs
`eslint . --max-warnings=0`, so the CI lint step can fail.

## Needs

- Nothing from the other slices, strictly. But 47 of the 120 warnings are in `functions/`, and most
  of those are in `[[path]].ts`, so running this after `api-modularisation` means fixing them in
  200-line modules instead of in a 726-line file.
- 3-4 h, and the split matters for how it is spent:

  | rule | count | what closing it costs |
  |---|---|---|
  | `@typescript-eslint/no-explicit-any` | 88 | writing the real types; the expensive one |
  | `@typescript-eslint/no-unused-vars` | 17 | mostly deletion, or an `_` prefix the config already ignores |
  | `react-hooks/exhaustive-deps` | 15 | the risky one — each is a behaviour question, not a formatting one |

- Baseline to re-measure before starting, because slices from the other epics move code:

  ```
  cd artifacts/portfolio && pnpm exec eslint . -f json | python3 -c "import json,sys,collections;print(collections.Counter(m['ruleId'] for f in json.load(sys.stdin) for m in f['messages']))"
  ```

## Design constraint

the flag goes on last, in the same commit as the last fix. A repo that
carries `--max-warnings=0` alongside a suppression comment per warning has moved the problem, not
solved it.

## Design constraint

`react-hooks/exhaustive-deps` is the one rule here where the mechanical fix
(adding the missing dep) can change behaviour: a dep added to an effect that fetches turns one
request into a request per render. Each of the 15 gets a decision — add the dep, or restructure —
and never a blanket `eslint-disable-next-line` without a sentence saying why.

## Tests

- `pnpm test` green after each batch of fixes, and `pnpm run build` green at the end. The 15
  `exhaustive-deps` fixes are behaviour changes and the suite is thin cover for them; where a fix
  touches an effect that fetches, add the test that pins the number of calls.

## Done when

```
cd artifacts/portfolio && grep -q -- '--max-warnings=0' package.json && pnpm run lint ; echo "exit=$?"
```

prints no findings and then `exit=0`. And the flag is load-bearing:

```
cd artifacts/portfolio && printf '\nexport const __gate: any = 1;\n' >> functions/lib/markdown.ts && pnpm run lint ; echo "exit=$?" ; git checkout -- functions/lib/markdown.ts
```

prints an `@typescript-eslint/no-explicit-any` warning and a non-zero `exit=`.

## If stuck

if the 15 `exhaustive-deps` cases cannot be closed without redesigning a hook, split
the slice: `03a` closes the 105 mechanical ones and sets `"react-hooks/exhaustive-deps": "error"`
aside as the one remaining `warn`; `03b` closes those 15 and adds the flag. Shipping `03a` alone is
still a real gate for the other two rules — but do not add `--max-warnings=0` in `03a`, because with
a `warn` rule still firing it would just fail.
