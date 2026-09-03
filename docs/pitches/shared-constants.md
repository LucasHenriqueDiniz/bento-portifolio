---
status: active
epic: constants
---

# Move `src/constants/` into a workspace package

## The problem

The Cloudflare worker reaches into the frontend's source tree:

```
$ grep -rn '\.\./\.\./src' artifacts/portfolio/functions
artifacts/portfolio/functions/lib/markdown.ts:1:import { projects } from "../../src/constants/projects";
artifacts/portfolio/functions/lib/markdown.ts:2:import { contacts, ContactLinks } from "../../src/constants/contacts";
artifacts/portfolio/functions/lib/markdown.ts:3:import { jobExperiences } from "../../src/constants/jobExperiences";
artifacts/portfolio/functions/lib/markdown.ts:4:import { academicExperiences, certificates } from "../../src/constants/academicExperiences";
artifacts/portfolio/functions/lib/markdown.ts:5:import { skillsData } from "../../src/constants/skillsData";
artifacts/portfolio/functions/lib/markdown.ts:6:import { languages } from "../../src/constants/languages";
```

This is the only real dependency inversion in the repo. Everything else points the right way.

## Why it matters beyond taste

The repo's own written rule forbade it. `.claude/rules/architecture-rules.md` — since deleted, see
`docs/decisions/0001-legacy-rules.md` — listed "Codigo duplicado entre frontend e backend (extrair
para `lib/`)" as an anti-pattern and said the shared layer is where cross-cutting data lives. That
`lib/` never existed:

```
$ ls -d lib
ls: lib: No such file or directory
$ ls -d artifacts/*
artifacts/portfolio
```

So the rule has been unenforceable since it was written. Rather than build the `lib/` the stale rule
describes, the data goes where this workspace already looks for packages.

## Shape

`pnpm-workspace.yaml` already globs `artifacts/*`, and `tsconfig.base.json` already sets
`"customConditions": ["workspace"]` — the machinery for a second workspace package is in place and
unused. A new `artifacts/constants` package (`@workspace/constants`) holds the data; `src/` and
`functions/` both depend inward on it.

No new layer, no new tooling. One `git mv`, one `package.json`, and two sets of import rewrites.

## Ordering

First of the epics. It is the change the architecture review named as step one, and it shrinks what
`backend-gates` has to typecheck by giving `functions/` a real module boundary to import across.
