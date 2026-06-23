# CLAUDE.md

Canonical instructions for AI coding agents in this repository.

This is the **source of truth**. Other tool-specific entry points
(`AGENTS.md`, `CODEX.md`, `.opencode/OPENCODE.md`) are thin pointers back here
to avoid duplicated rules.

Compatible with:
- Claude Code
- Codex / OpenAI coding agents
- OpenCode

## 1) Mission

Maintain and evolve this personal **Bento-style portfolio monorepo** with small, safe, and verifiable changes.

## 2) Source of truth

1. Current code
2. `package.json` scripts and workspace config
3. This `CLAUDE.md`
4. `.claude/rules/*` (detailed rules) and `.claude/skills/*` (reusable workflows)

When in doubt, trust the code and scripts currently in the repository.

## 3) Repository map

```txt
artifacts/
  portfolio/   # React + Vite frontend + Cloudflare Pages Functions
```

## 4) Core stack

- pnpm workspaces
- Node.js 18+
- TypeScript (strict)
- React + Vite + Tailwind
- Cloudflare Pages Functions

## 5) Non-negotiable safety rules

- Never commit secrets (`.env`, tokens, API keys).
- Never move private keys/secrets into frontend runtime.
- External integrations must stay behind backend functions (`artifacts/portfolio/functions`).
- Do not make unrelated refactors.

## 6) Coding conventions

- Prefer strict typing; avoid unnecessary `any`.
- React components: PascalCase.
- Hooks: `use*`.
- UI-agnostic utilities belong in `src/lib`.
- Keep changes minimal and localized.

## 7) UI/UX guardrails

- Preserve Bento visual language (modular cards, responsive grid, smooth interactions).
- Prioritize accessibility (semantic markup, ARIA when necessary, keyboard support).
- Avoid large visual redesigns unless explicitly requested.

## 8) API/backend guardrails

- Validate inputs for new endpoints.
- Handle errors consistently.
- If frontend contracts change, update client usage in the same change.
- Document any breaking change.

## 9) Standard workflow for agents

1. Read relevant files before editing.
2. Implement the smallest viable change.
3. Run relevant checks.
4. Update docs when behavior or usage changes.
5. Prepare clear commit and PR notes.

## 10) Commands

From repository root:

```bash
pnpm install
pnpm dev
pnpm dev:portfolio
pnpm dev:api
pnpm typecheck
pnpm build
pnpm --filter @workspace/portfolio test
```

## 11) PR / delivery checklist

- [ ] Build/typecheck executed (or failure explained).
- [ ] No secrets in changes.
- [ ] No undocumented breaking changes.
- [ ] Docs updated when needed.

## 12) Detailed rules

The following rule files contain the full conventions for this repo and are
imported into context:

- @.claude/rules/architecture-rules.md
- @.claude/rules/clean-code-rules.md
- @.claude/rules/testing-rules.md
- @.claude/rules/workflow-rules.md

## 13) Skills

Reusable workflows live in `.claude/skills/` and are invoked as slash commands:

- `/lint` — run linters and formatters across the project
- `/pitch` — create a new pitch document in `docs/pitches/`
- `/postmortem` — move a completed pitch to postmortem with retrospective
- `/research` — research a topic using web search and fetch

---

Last updated: 2026-06-23
