---
status: done
kanban: 71840f06-b883-494c-87d6-0267ad8feb6b
---

# Slice 2 — Apply it, and leave nothing dangling

## Delivers

The decision executed: either four English rule files that describe this tree, or four deleted files
and a `CLAUDE.md` that no longer imports them. Either way, no session loads Portuguese rules or a
path that is not in the repo.

## Needs

- Slice 1 merged, with a decision to read.
- 30 min if retiring (delete, then unpick `CLAUDE.md` sections 12-13). 2-3 h if rewriting: the
  correction is not a translation job — `architecture-rules.md` documents an Express
  `artifacts/api-server/` and a top-level `lib/` that never existed, so the content has to be
  rewritten against Cloudflare Pages Functions and the single `artifacts/portfolio` artifact before
  it is worth translating.

## Design constraint

If rewriting, do not re-import from the `hexagram` plugin. `CLAUDE.md` section 12 is explicit that
copying a rule freezes it at the copied version — whatever survives here has to be the repo's own
content, saying something the plugin does not.

## Design constraint

`.agents/skills/` mirrors `.claude/skills/` (`lint`, `pitch`, `postmortem`, `research` in both), and
`CLAUDE.md` says those copies also point at a `docs/` directory that did not exist. That mirror is
adjacent, not in scope: this slice covers `.claude/rules/` and the `CLAUDE.md` text that imports it.
If the decision was "retire", note in the commit that the skill copies are still there, so the next
audit does not read their survival as a decision.

## Tests

None to run — these are context files, not code. The proof is the greps below, which is why they are
written as two independent checks rather than one.

## Done when

No Portuguese left in the rules directory:

```
cd /Users/maxter/dev/pessoal/bento-portifolio && grep -rniE '(arquitetura|regras de|nao pode|convencoes|este projeto|bibliotecas compartilhadas)' .claude/rules 2>/dev/null | wc -l
```

prints `0` — which holds whether the files were rewritten or deleted.

And every `@`-import in `CLAUDE.md` resolves:

```
cd /Users/maxter/dev/pessoal/bento-portifolio && grep -o '@[A-Za-z0-9_./-]*\.md' CLAUDE.md | sed 's/^@//' | while read -r f; do test -f "$f" || echo "MISSING $f"; done
```

prints nothing.

And no rule names a path the tree does not have:

```
cd /Users/maxter/dev/pessoal/bento-portifolio && grep -rn 'artifacts/api-server' CLAUDE.md .claude 2>/dev/null ; echo "exit=$?"
```

prints `exit=1` with no matches above it.

## If stuck

If rewriting turns out to mean rewriting all four files from scratch — which is likely for
`architecture-rules.md` and possible for `workflow-rules.md`, whose loop points at a `docs/` layout
this repo is only now growing — stop and go back to slice 1. "Rewrite" that means "write four new
files" is the retire option wearing a different name, and the owner should get to say so.
