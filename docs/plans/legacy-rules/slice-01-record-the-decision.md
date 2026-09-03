---
status: done
kanban: c04f695c-849c-4bd8-9a58-0250770f7ffc
---

> **Unblocked and closed.** The owner chose *retire* on 2026-09-03. The decision is recorded in
> `docs/decisions/0001-legacy-rules.md`, which states `**Decision:** retire` and lists what that
> ruled out. Slice 2 shipped in the same change.

# Slice 1 — Record the rewrite-or-retire decision

## Delivers

`docs/decisions/0001-legacy-rules.md`: a decision record naming one of two options and what it
rules out. No `.claude/rules/*.md` file is touched in this slice.

## Needs

- The owner. This is the blocking input and there is no substitute for it.
- 20 min reading the four files (272 lines total) and `CLAUDE.md` sections 12 and 13, so the
  decision is made against what they actually say rather than against a summary.

## The two options, stated so they can be chosen between

| | Rewrite | Retire |
|---|---|---|
| `.claude/rules/*.md` | translated to English, tree corrected | deleted |
| `CLAUDE.md` section 13 | rewritten: these are the repo's own layer | deleted, with the `@`-imports |
| what the repo gains | a local layer under the plugin skills | one standard instead of two |
| what it costs | keeping four files honest as the tree moves | 272 lines of the owner's own writing |

## Tests

None. A decision record is not code and there is nothing to run against it.

## Done when

```
cd /Users/maxter/dev/pessoal/bento-portifolio && grep -Eiq '^\*\*Decision:\*\* (rewrite|retire)$' docs/decisions/0001-legacy-rules.md ; echo "exit=$?"
```

prints `exit=0` — the file exists and states exactly one of the two words, so slice 2 can read the
choice instead of guessing it.

## If stuck

If the owner does not want to choose, that is itself an answer and it is not "wait". Record
`**Decision:** rewrite` with a one-line scope of "translate and correct only, no new content" — it
is the option that destroys nothing and can be reversed later. Do not leave the slice blocked
indefinitely while the four files keep loading into every session.
