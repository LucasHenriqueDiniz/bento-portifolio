---
description: Arquitetura do monorepo — regras de dependencia entre camadas
globs: src/**/*
---

# Architecture Rules

Este projeto e um monorepo com portfolio pessoal.

```
artifacts/portfolio/     # Frontend (React + Vite + Tailwind)
artifacts/api-server/    # Backend (Express + proxy APIs externas)
lib/                     # Bibliotecas compartilhadas (schemas, clientes)
```

## Regras de dependencia

### `artifacts/portfolio/` — Frontend

- **Pode importar:** `lib/`, bibliotecas UI, utilitarios puros
- **NAO pode importar:** `artifacts/api-server/` diretamente (usa `lib/api-client-react`)
- **NAO pode ter:** segredos, tokens, credenciais hardcoded
- **Contem:** componentes React, hooks, paginas, estilos, assets

### `artifacts/api-server/` — Backend

- **Pode importar:** `lib/`, bibliotecas de servidor, SDKs externos
- **NAO pode importar:** codigo de frontend, componentes React
- **Contem:** rotas Express, controllers, middlewares, integracoes externas
- **Responsavel por:** proteger segredos, proxy de APIs externas

### `lib/` — Bibliotecas compartilhadas

- **Pode ser importado por:** qualquer artefato
- **NAO pode ter:** dependencias de framework (React, Express)
- **Contem:** schemas Zod, tipos TypeScript, utilitarios puros

## Convencoes

- Componentes React: PascalCase
- Hooks: prefixo `use`
- Utilitarios sem UI: `src/lib/`
- Schemas compartilhados: `lib/api-zod/`
- Cliente HTTP frontend: `lib/api-client-react/`

## Anti-patterns

- Mover segredos para frontend
- Importar backend no frontend sem passar pelo proxy
- Logica de negocio em handlers HTTP ou componentes React
- Codigo duplicado entre frontend e backend (extrair para `lib/`)
