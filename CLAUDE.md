# CLAUDE.md

Canonical instructions for AI coding agents in this repository.

This is the **source of truth**. `AGENTS.md` is a thin pointer back here so
that any tool which doesn't read `CLAUDE.md` (Codex, Cursor, etc.) still lands
on the same instructions.

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

- pnpm workspaces (`pnpm@11.24.0`, pinned in the root `packageManager` field)
- Node.js `24.19.0`, pinned in `.nvmrc` — CI reads that file, so do not assume an older runtime
- TypeScript. ⚠️ `strict` is **not** enabled in `tsconfig.base.json`; individual flags are, and
  `strictFunctionTypes` and `noUnusedLocals` are explicitly `false`. Read the file before relying
  on a strict-mode guarantee.
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

### External integrations

All third-party calls live in `artifacts/portfolio/functions/api/[[path]].ts`.

- **MyAnimeList data** goes through **jikan-edge** (`https://jikan.lucashdo.com/v1`), **not** the
  legacy `api.jikan.moe/v4` Jikan API. Do not reintroduce the old base URL. The worker also answers on its
  original `jikan-edge.lucas-hdo.workers.dev` address, but the custom domain is the canonical one — use it.
  - Every response is wrapped in `{ data, meta: { cached, stale, refreshFailed, fetchedAt } }` — no Jikan-style
    `pagination` object. `meta.stale: true` is a valid cache-fallback response, not an error.
    Fields are camelCase (`malId`, `episodesWatched`, `startYear`, `imageUrl` as a flat string).
  - Handle `429`/rate limiting by honoring the `Retry-After` header (see `rateLimitDelayMs` in `[[path]].ts`).
  - Some Jikan routes are **not served** by jikan-edge (genre lists, club search, `top/reviews`, user
    history/external, per-episode forum, etc.) — check `https://jikan.lucashdo.com/docs` before
    depending on a new route.
  - jikan-edge is Lucas's own worker and evolves independently; if MAL numbers look wrong, verify against a
    live profile page before assuming the portfolio-side parsing is at fault — the bug may be upstream.
- Last.fm, Steam, Lyfta, and GitHub integrations follow the same pattern: fetched server-side, cached via
  `cached()`/KV, never exposed with raw credentials to the frontend.

## 9) Standard workflow for agents

1. Read relevant files before editing.
2. Implement the smallest viable change.
3. Run relevant checks.
4. Update docs when behavior or usage changes.
5. Prepare clear commit and PR notes.

## 10) Commands

From repository root — these are the scripts that actually exist in the root `package.json`:

```bash
pnpm install
pnpm dev              # runs the portfolio dev server
pnpm typecheck        # typecheck:libs, then every artifact's own typecheck
pnpm typecheck:libs   # tsc --build only
pnpm build            # typecheck, then each package's build
```

The root has no `dev:portfolio` and no `dev:api`. Lint and test live in the portfolio package:

```bash
pnpm --filter @workspace/portfolio lint
pnpm --filter @workspace/portfolio test
```

Verify a command against `package.json` before running it; do not invent one.

## 11) PR / delivery checklist

- [ ] Build/typecheck executed (or failure explained).
- [ ] No secrets in changes.
- [ ] No undocumented breaking changes.
- [ ] Docs updated when needed.

## 12) Where the house-style rules come from

The conventions this repo is held to are **skills in the `hexagram` plugin**, not files in this
tree. They are installed per machine (user scope, from the `imgabrieldev/hexagram` marketplace),
so a clone picks up whatever version the person cloning has installed — nothing here pins them:

`architecture` · `naming` · `git` · `language` · `testing` · `clean-code` · `diagrams` ·
`workflow` · `terraform` · `setup-machine` · `research` · `postmortem` · `lint`

**None of them is copied into `.claude/rules/`, and that is on purpose.** Copying a rule freezes
it at the version that was copied, and the copy is what gets read from then on. Look for a rule in
the plugin, not on disk — the absence of a local copy is not the absence of a standard.

## 13) Legacy local rules — superseded, not authoritative

⚠️ The files below predate the plugin above and are **not** the house style. They are still
`@`-imported into context, so they are listed here for the reader who sees them arrive:

- @.claude/rules/architecture-rules.md
- @.claude/rules/clean-code-rules.md
- @.claude/rules/testing-rules.md
- @.claude/rules/workflow-rules.md

`architecture-rules.md` describes an `artifacts/api-server/` (Express) and a top-level `lib/`;
neither exists in this tree, which runs Cloudflare Pages Functions instead. The `workflow-rules.md`
loop and the `.claude/skills/` copies of `pitch`/`research`/`postmortem`/`lint` (mirrored again
under `.agents/skills/`) point at a `docs/` directory this repo does not have, and shadow the
plugin's own skills of the same name. Where they disagree with section 12, section 12 wins.
Removing them is an open decision, not something this file has settled.

## 14) Skills

Reusable workflows live in `.claude/skills/` and are invoked as slash commands:

- `/lint` — run linters and formatters across the project
- `/pitch` — create a new pitch document in `docs/pitches/`
- `/postmortem` — move a completed pitch to postmortem with retrospective
- `/research` — research a topic using web search and fetch

---

Last updated: 2026-08-18

## Commit hook

`.githooks/commit-msg` strips AI attribution trailers from commit messages. Git does not version
`.git/hooks`, so what makes the hook run is one line of local config — and a fresh clone does not
have it. The root `prepare` script sets it on `pnpm install`, and only when nothing else claims it:

```
git config --get core.hooksPath >/dev/null 2>&1 || git config core.hooksPath .githooks
```

If you already point `core.hooksPath` somewhere else, the script leaves your value alone and this
repo's hook stays inert — wire it by hand, or move the file into whatever directory you do use.
