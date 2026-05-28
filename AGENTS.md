# AGENTS.md

Universal instructions for AI coding agents in this repository.

Compatible with:
- Codex / OpenAI coding agents
- OpenCode
- Claude Code

> If your tool supports `CLAUDE.md`, `CODEX.md`, or `OPENCODE.md`, those files should point here to avoid duplicated rules.

## 1) Mission

Maintain and evolve this personal **Bento-style portfolio monorepo** with small, safe, and verifiable changes.

## 2) Source of truth

1. Current code
2. `package.json` scripts and workspace config
3. This `AGENTS.md`
4. `.opencode/rules/*` and `.opencode/OPENCODE.md`

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

---

Last updated: 2026-05-28
