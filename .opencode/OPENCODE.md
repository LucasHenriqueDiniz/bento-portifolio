# About the user

**Nome:** Lucas Diniz
**Localizacao:** Brasilia, Brasil
**Stack principal:** TypeScript, React, Node.js, Express, Tailwind CSS

## Ambiente
- **SO:** Windows 11
- **Shell preferido:** PowerShell
- **Package manager:** pnpm
- **Editor:** VS Code

## Preferencias de interacao
- Idioma: Portugues (pt-BR)
- Tom: Direto, sem rodeios, focado em resultado
- Detalhes: Mostre acoes concretas, nao explique demais

## Contexto do Projeto

Este e um monorepo de portfolio pessoal:
- **Frontend:** React 19 + Vite 7 + Tailwind 4 + Framer Motion + Radix UI
- **Backend:** Express 5 como proxy para APIs externas
- **Arquitetura:** Bento UI/UX, grid responsivo, cards modulares
- **Workspace:** pnpm workspaces
- **Deploy:** Cloudflare Pages (frontend estatico)

## Comandos uteis

```powershell
# Dev local (frontend + backend)
pnpm dev

# Apenas frontend
pnpm dev:portfolio

# Apenas backend
pnpm dev:api

# Typecheck completo
pnpm typecheck

# Build para producao
pnpm build
```

## Notas importantes

- Este setup roda em **Windows nativo**, sem WSL
- Prefira comandos PowerShell sobre bash quando possivel
- Nao commite `.env` nem segredos
- Integracoes externas sempre via backend (`artifacts/api-server`)
- UI em linguagem visual Bento (cards, grid, interacoes suaves)
- Deploy no Cloudflare Pages: o frontend e buildado estaticamente; o backend Express **nao** vai para o Cloudflare (roda localmente ou em outro host se necessario)
