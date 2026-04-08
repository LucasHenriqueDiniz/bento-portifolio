# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Portfolio site inspired by ana.sh with bento-grid layout, live data widgets, and animated projects page.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Framer Motion + GSAP

## Artifacts

### Portfolio (`artifacts/portfolio`)
- **Preview path**: `/` (root)
- **Type**: react-vite
- Dark bento-grid personal portfolio
- Home page with live data widgets: Now Playing (Last.fm), Discord status, Steam games, Workout stats, GitHub stats, Top Artists
- Projects page with GridMotion (GSAP parallax grid)
- All data currently mocked via API — ready for real API key integration

### API Server (`artifacts/api-server`)
- **Preview path**: `/api`
- Express 5 REST API with all portfolio endpoints mocked
- Endpoints: `/api/portfolio/now-playing`, `/api/portfolio/top-artists`, `/api/portfolio/discord`, `/api/portfolio/steam`, `/api/portfolio/workout`, `/api/portfolio/projects`, `/api/portfolio/stats`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/portfolio run dev` — run portfolio frontend

## Future Integrations (currently mocked)
- Last.fm API — real music data
- Discord Lanyard — real presence/status
- Steam API — real game data
- Fitness tracker API (e.g. Hevy/Strong) — real workout data
- GitHub GraphQL API — real contribution data

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
