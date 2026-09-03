---
status: done
epic: rules
---

# Decide what happens to `.claude/rules/*.md`

## The problem

Four files, 272 lines, `@`-imported into every session by `CLAUDE.md` section 13:

```
$ wc -l .claude/rules/*.md
      51 .claude/rules/architecture-rules.md
     100 .claude/rules/clean-code-rules.md
      66 .claude/rules/testing-rules.md
      55 .claude/rules/workflow-rules.md
     272 total
```

They fail on two counts at once.

**They are in Portuguese.** `architecture-rules.md` opens with
`description: Arquitetura do monorepo — regras de dependencia entre camadas` and
`Este projeto e um monorepo com portfolio pessoal.` The `language` skill puts everything that lands
in a repo in English, with no exception for agent context files.

**They describe a tree that does not exist.** `architecture-rules.md` documents
`artifacts/api-server/` (Express) and a top-level `lib/`, with import rules between them:

```
$ ls -d lib artifacts/*
ls: lib: No such file or directory
artifacts/portfolio
```

This repo runs Cloudflare Pages Functions and has one artifact.

## Why this is not just `rm`

They are the repo's own content, not a copy of a plugin skill — `CLAUDE.md` section 12 is explicit
that nothing was copied from `hexagram` into `.claude/rules/`. So deleting them destroys writing that
has no other home, and `CLAUDE.md` already says as much:

> Removing them is an open decision, not something this file has settled.

## What has to happen

The owner picks one of two, and the decision gets recorded before anyone edits a file:

- **Rewrite** — translate to English, correct the tree they describe, keep them as the repo's own
  layer under the plugin skills.
- **Retire** — delete the four files, drop the `@`-imports and section 13 from `CLAUDE.md`, and let
  the plugin skills be the only standard.

Either way the end state is the same test: nothing in `.claude/rules/` is in Portuguese, and nothing
in it names a path that is not in the tree.
