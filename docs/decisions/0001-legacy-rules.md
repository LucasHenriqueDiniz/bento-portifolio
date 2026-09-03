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

Less than an earlier draft of this record claimed. That draft named two things as having "no plugin
equivalent"; read against the installed skill files, one is in the plugin verbatim and the other is
in it in form. Line numbers below are from the `hexagram` skills as installed when this was written
(`skills/<name>/SKILL.md`), so re-grep before trusting them:

- **The abbreviation table and the size limits are already in the plugin, and with these same
  numbers.** `clean-code/SKILL.md` sets soft 80 / hard 200 lines per function (lines 48–49) and soft
  500 / hard 1500 per file (lines 59–60) — it does not merely "state the principle". Its
  forbidden-abbreviation table (lines 16–30) is a strict superset of the deleted one: `stmt`, `ctx`,
  `cnt`, `idx`, `cfg`, `resp`, `qty` and `ts` are all in it, plus `req`, `ph`, `ws`, `db2`/`db3` and
  `kv`. Its "Allowed short names" (lines 36–38) likewise cover everything the deleted
  `Abreviacoes permitidas` allowed, and add `ms`, `ip` and `U`. `clean-code-rules.md` was a
  Portuguese translation of a subset of that skill — which is what the table above already says in
  the `clean-code` row, and what this section used to contradict. Nothing here is lost.
- **The test taxonomy's shape is the plugin's; only the layers were this repo's.**
  `testing/SKILL.md` numbers Layers 1–4 at lines 12, 23, 37 and 45, and asks for a single-command
  run in <5 seconds at line 161 — so neither the four-layer form nor the target was local. What
  differed is what the layers held: the deleted file's were React-shaped (pure `src/lib` utilities →
  hooks → components → endpoint E2E) against the plugin's hexagonal ones (domain → use case →
  integration → E2E). *That* mapping is the one thing on this list with no plugin equivalent, and it
  is a sentence long: here the four layers land as `artifacts/portfolio/src/lib` (7 test files),
  `src/hooks` (12), `src/components` (3) and the Cloudflare Pages Functions under
  `artifacts/portfolio/functions/api/` (3) — with no `application/` tier in between, because this
  repo has none. One `vitest run` covers all 25 files, so the plugin's <5-second target is a single
  command here and it already passes: 122 tests in 3.3s, measured 2026-09-03.

So the honest total is one sentence, written above. Do not "restore" the first two to the plugin's
`clean-code` or `testing` skill: it has them. And the layer mapping is about this tree, so it stays
here rather than becoming a local copy of a rule — section 12 explains why, a copy freezes at the
version copied and the copy is what gets read from then on. Finding less lost than the draft
assumed makes *retire* the stronger call, not the weaker one.

## Not decided here

`.agents/skills/` still holds byte-identical copies of the same four skills. It was adjacent to
this decision, not inside it, and it was left in place. Its survival is not a decision; the next
audit should still ask about it.
