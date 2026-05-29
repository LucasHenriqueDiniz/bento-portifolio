# Bento Portfolio

A modular **Bento-style personal portfolio** built as a monorepo with a React/Vite frontend and Cloudflare Pages Functions for secure API integrations.

> Looking for the previous version? See: [old-lucas-portfolio](https://github.com/LucasHenriqueDiniz/old-lucas-portfolio)

## Showcase

![Bento Portfolio showcase](./.github/assets/preview.png)

The interface highlights real-world data (GitHub activity, music, games, anime, workouts, weather, and professional experience) inside responsive cards with smooth motion and clean typography.

## Project Description

This project is designed to present a complete developer profile in a single interactive page:

- **Who I am**: intro, bio, and social links.
- **What I build**: featured projects and technical stack.
- **What I do**: professional timeline and resume access.
- **What I track**: integrations with external platforms and personal metrics.

The architecture keeps secrets on the backend via Cloudflare Functions, while the frontend focuses on performance, UI consistency, and accessibility.

## Suggested Repository Metadata

If you want to optimize GitHub discoverability, you can use:

- **Repository name (recommended):** `bento-portfolio`
- **Current name:** `bento-portifolio`
- **Note:** `portfolio` is the standard English spelling, so renaming improves professionalism and searchability.

### Short description (GitHub "About")

`Bento-style developer portfolio built with React, Vite, and Cloudflare Pages Functions, featuring real-time integrations and modular UI cards.`

### Topics / tags

`portfolio`, `bento-ui`, `react`, `vite`, `typescript`, `tailwindcss`, `cloudflare-pages`, `cloudflare-functions`, `frontend`, `fullstack`, `personal-website`, `web-performance`

## Tech Stack

- **Monorepo / Workspace:** pnpm workspaces
- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Wouter, TanStack Query, Framer Motion, Radix UI
- **Backend:** Cloudflare Pages Functions
- **Language:** TypeScript
- **Deploy:** Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Install

```bash
pnpm install
```

### Environment variables

```bash
cp .env.example .env
```

Then fill your `.env` with your own credentials.

## Development

```bash
pnpm dev
```

Useful alternatives:

```bash
pnpm dev:portfolio
pnpm dev:api
pnpm typecheck
pnpm build
```

## Project Structure

```bash
artifacts/
  portfolio/      # React + Vite app (frontend + Cloudflare functions)
```

## License

For now, this project is private/personal use unless a LICENSE file is added.
