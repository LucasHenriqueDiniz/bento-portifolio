---
status: done
epic: rules
board: false
---

# 0001 — Retire the pre-plugin local rules

Date: 2026-09-03
Pitch: [`docs/pitches/legacy-rules.md`](../pitches/legacy-rules.md)

**Decision:** retire

## Scope of the decision

Deleted, with no replacement written in this tree:

| Path | Lines | Why it goes |
|---|---|---|
| `.claude/rules/architecture-rules.md` | 51 | Portuguese; documents an `artifacts/api-server/` (Express) and a top-level `lib/` that never existed here |
| `.claude/rules/clean-code-rules.md` | 100 | Portuguese; the `clean-code` plugin skill covers the same ground |
| `.claude/rules/testing-rules.md` | 66 | Portuguese; the `testing` plugin skill covers the same ground |
| `.claude/rules/workflow-rules.md` | 55 | Portuguese; its pitch→research→plan loop is the `workflow` plugin skill |
| `.claude/skills/{lint,pitch,postmortem,research}/SKILL.md` | 4 files | The plugin ships a skill under each of those four names |

The four `@`-imports in `CLAUDE.md` section 13 went with them, so none of this reaches context
any more.

## What ruled out "rewrite"

The pitch framed this as rewrite-or-retire, and rewriting was the option that destroyed nothing.
It lost on the same test the pitch set for it: *nothing in `.claude/rules/` names a path that is
not in the tree.* Meeting that test for `architecture-rules.md` means discarding the dependency
rules between `artifacts/api-server/`, `lib/` and the frontend — which is the whole document. The
plan's own escape hatch says so:

> "Rewrite" that means "write four new files" is the retire option wearing a different name, and
> the owner should get to say so.

The owner said so.

## What is lost, stated plainly

These files were the repo's own writing, not a copy of a plugin skill, so deleting them destroys
content with no other home. Two things in them had no plugin equivalent and are recorded here
rather than silently dropped:

- **A concrete abbreviation table** (`stmt`→`statement`, `idx`→`index`, `resp`→`response`, …) and
  explicit function/file size limits (soft 80 / hard 200 lines per function; soft 500 / hard 1500
  per file). The `clean-code` skill states the principle; these were this repo's numbers.
- **A four-layer test taxonomy** (pure utilities, hooks, components, endpoint E2E) with a
  <5-second target for the lib+component loop.

If either turns out to be missed, it belongs in the plugin's `clean-code` or `testing` skill —
where every repo gets it — not back in this tree. Section 12 explains why: a local copy freezes
at the version copied, and the copy is what gets read from then on.

## Not decided here

`.agents/skills/` still holds byte-identical copies of the same four skills. It was adjacent to
this decision, not inside it, and it was left in place. Its survival is not a decision; the next
audit should still ask about it.
