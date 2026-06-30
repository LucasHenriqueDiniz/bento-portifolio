# Bento Portfolio

A Bento-style personal portfolio built with React, Vite, TypeScript, Tailwind CSS, and Cloudflare Pages Functions.

The project presents professional experience, projects, skills, social links, and live integrations in a responsive card-based interface. External service credentials stay behind Cloudflare Functions; the frontend consumes only the API surface it needs.

> Previous version: [old-lucas-portfolio](https://github.com/LucasHenriqueDiniz/old-lucas-portfolio)

## Preview

![Bento Portfolio preview](./.github/assets/preview.png)

## Stack

- **Workspace:** pnpm workspaces
- **Frontend:** React 19, Vite 7, TypeScript, Tailwind CSS 4
- **UI:** Radix UI, Framer Motion, lucide-react, shadcn-style components
- **Data:** TanStack Query, i18next
- **Backend:** Cloudflare Pages Functions
- **Deploy:** Cloudflare Pages

## Features

- Responsive Bento grid for profile, projects, experience, and activity cards
- Internationalized content with English and Portuguese locales
- Project, resume, gallery, contact, and donation pages
- API integrations for GitHub, Discord, Steam, Last.fm, MyAnimeList, Lyfta, weather, and contact notifications
- Cloudflare KV-backed cache support through the `PORTFOLIO_CACHE` binding

## Project Structure

```txt
artifacts/
  portfolio/
    functions/   # Cloudflare Pages Functions API
    public/      # Static assets, documents, images, and locale files
    scripts/     # Build and maintenance scripts
    src/         # React application source
```

## Requirements

- Node.js 18+
- pnpm

## Setup

Install dependencies from the repository root:

```bash
pnpm install
```

Create the environment files:

```bash
cp .env.example .env
cp artifacts/portfolio/.env.example artifacts/portfolio/.env
```

Root `.env` values are used by the backend functions and third-party integrations. `artifacts/portfolio/.env` contains frontend Vite variables such as `VITE_API_URL`.

## Development

Run the portfolio app:

```bash
pnpm dev
```

The root `dev` script runs the Vite app from `artifacts/portfolio`.

## Scripts

From the repository root:

```bash
pnpm dev
pnpm typecheck
pnpm build
```

From `artifacts/portfolio`:

```bash
pnpm dev
pnpm serve
pnpm typecheck
pnpm build
```

## Deployment

The Cloudflare Pages configuration lives in `artifacts/portfolio/wrangler.toml`.

Build output is written to:

```txt
artifacts/portfolio/dist/public
```

Required production secrets should be configured in Cloudflare, not committed to this repository.

## License

MIT
