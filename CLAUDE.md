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
4. The `hexagram` plugin skills — the house style, installed per machine, not stored here (section 12)

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

`architecture` · `board` · `clean-code` · `diagrams` · `git` · `init-project` · `language` ·
`lint` · `naming` · `pitch` · `postmortem` · `research` · `setup-machine` · `terraform` ·
`testing` · `workflow`

**None of them is copied into this tree, and that is on purpose.** Copying a rule freezes it at
the version that was copied, and the copy is what gets read from then on. Look for a rule in the
plugin, not on disk — the absence of a local copy is not the absence of a standard. There is no
`.claude/rules/` and no `.claude/skills/` here, and that absence is the correct state.

## 13) Legacy local rules — retired

The decision is closed: the four `.claude/rules/*.md` files and the `.claude/skills/` copies of
`lint`/`pitch`/`postmortem`/`research` are **deleted**, and the `@`-imports that pulled the rules
into every session are gone with them. `docs/decisions/0001-legacy-rules.md` records why. Section
12 is now the only standard, which is what it always claimed to be.

⚠️ **One mirror survived.** `.agents/skills/` still holds byte-identical copies of the same four
skills, for the agents that read that directory instead of `.claude/`. It was outside the scope of
the retirement and was left deliberately — its survival is not a second decision, and it is still
open. Two of those copies write to `docs/postmortem/` and `docs/research/`, neither of which
exists in this tree.

## 14) Skills

Skills come from the `hexagram` plugin (section 12) and are invoked by name. Nothing in this repo
defines a skill, so a clone with the plugin missing has none of these — that is expected:

- `lint` — detects the stack from the files present and reports per tool
- `pitch` — create a pitch in `docs/pitches/`
- `postmortem` — record what a finished piece of work cost to learn
- `research` — research a topic and keep each source as its own file
- `board` — project `docs/pitches/` and `docs/plans/` onto a kanban board

---

Last updated: 2026-09-03

## Commit hook

`.githooks/commit-msg` strips AI attribution trailers from commit messages. Git does not version
`.git/hooks`, so what makes the hook run is one line of local config — and a fresh clone does not
have it. The root `prepare` script sets it on `pnpm install`, and only when nothing else claims it:

```
git config --get core.hooksPath >/dev/null 2>&1 || git config core.hooksPath .githooks
```

If you already point `core.hooksPath` somewhere else, the script leaves your value alone and this
repo's hook stays inert — wire it by hand, or move the file into whatever directory you do use.
