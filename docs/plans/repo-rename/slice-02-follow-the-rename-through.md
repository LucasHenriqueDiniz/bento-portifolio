---
status: todo
kanban: 4ce47efa-8ea4-4849-986b-8c9fd636cfe8
---

# Slice 2 — Follow the rename through the tree

## Delivers

`origin` pointing at the new URL, and the eight tracked lines that spell `portifolio` corrected:
seven in `artifacts/portfolio/public/.well-known/api-catalog` and one at
`artifacts/portfolio/src/constants/projects.ts:903`.

## Needs

- Slice 1 merged. Editing the URLs before the rename lands points them at a 404.
- 20 min. The full inventory is eight lines, already measured:

  ```
  $ git grep -ni portifolio
  artifacts/portfolio/public/.well-known/api-catalog:5,11,17,23,29,35,41
  artifacts/portfolio/src/constants/projects.ts:903
  ```

## Design constraint

`.well-known/api-catalog` is served to the public. Each of its seven `service-doc` entries points at
`...bento-portifolio#public-api`, so the anchor has to survive the edit — a corrected URL that drops
`#public-api` is a worse link than the misspelled one that keeps it.

## Design constraint

The local clone directory is still `bento-portifolio`. Renaming it is the owner's own machine, not
this repository, and is out of scope — but `git remote set-url` is in scope and is what the check
below reads.

## Tests

- `pnpm test` and `pnpm run build` stay green — `projects.ts` is imported by the frontend and, after
  the `shared-constants` epic, by the worker as well.
- No new tests. Nothing here is behaviour.

## Done when

```
cd /Users/maxter/dev/pessoal/bento-portifolio && git remote -v | grep -c portifolio ; git grep -ni portifolio ; echo "grep exit=$?"
```

prints `0`, then no matching lines, then `grep exit=1`.

## If stuck

If a `service-doc` URL is referenced by something outside this repo that cannot be updated in step,
keep GitHub's redirect doing its job and say so in the commit — but still fix `projects.ts:903`,
which is a link the site renders about itself and is under nobody else's control.
