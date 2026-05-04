# AGENTDS.md

Guia universal para agentes (IA e automacoes) trabalhando neste repositorio.
Este arquivo consolida e atualiza o que estava espalhado em `.opencode/`.

## 1) Objetivo do projeto

- Portfolio pessoal em arquitetura monorepo.
- Frontend: React + Vite (Bento UI/UX).
- Backend: Cloudflare Pages Functions como proxy para APIs externas e protecao de segredos.

## 2) Estrutura do monorepo

```
artifacts/
  portfolio/      # app frontend
```

## 3) Stack atual (fonte: package.json)

- Workspace: pnpm workspaces
- Node: 18+
- TypeScript: ~5.9.2
- Frontend: React 19.1, Vite 7, Tailwind 4, Wouter, TanStack Query, Framer Motion, Radix UI
- Backend: Cloudflare Pages Functions
- Deploy: Cloudflare Pages (frontend + functions)

## 4) Comandos padrao

Na raiz do repo:

```bash
pnpm install
pnpm dev
pnpm dev:portfolio
pnpm dev:api
pnpm typecheck
pnpm build
```

Testes frontend:

```bash
pnpm --filter @workspace/portfolio test
```

## 5) Regras para agentes

### 5.1 Escopo e seguranca

- Nao commitar `.env` nem segredos.
- Nao mover segredos para frontend.
- Integracoes externas devem continuar via backend (Pages Functions em `artifacts/portfolio/functions`).

### 5.2 Convencoes de codigo

- TypeScript estrito e sem `any` desnecessario.
- Componentes React em PascalCase.
- Hooks com prefixo `use`.
- Utilitarios sem dependencia de UI em `src/lib`.
- Reutilizar schemas locais em `artifacts/portfolio` quando houver validacao compartilhada.

### 5.3 Mudancas em UI

- Preservar linguagem visual Bento (cards modulares, grid responsivo, interacoes suaves).
- Priorizar acessibilidade (Radix + atributos ARIA quando necessario).
- Evitar alteracoes visuais grandes sem alinhamento com o design existente.

### 5.4 Mudancas em API/backend

- Endpoint novo deve ter validacao de entrada e tratamento de erro consistente.
- Se impactar frontend, atualizar cliente local em `artifacts/portfolio`.
- Nao quebrar contratos existentes sem documentar migracao.

## 6) Fluxo recomendado para contribuicao

1. Ler contexto do modulo alvo (`artifacts/portfolio`).
2. Implementar menor mudanca possivel para resolver o problema.
3. Rodar `pnpm typecheck`.
4. Rodar testes afetados.
5. Se alterar comportamento, atualizar documentacao relevante.

## 7) Checklist de PR/entrega

- [ ] Build/typecheck passam.
- [ ] Sem segredos em commit.
- [ ] Sem quebra de API sem nota de migracao.
- [ ] UI responsiva (mobile e desktop).
- [ ] Documentacao atualizada (se aplicavel).

## 8) Fonte da verdade e manutencao

- Fonte de stack e scripts: `package.json` da raiz e dos pacotes.
- Fonte de arquitetura e regras: `.opencode/rules/` e `.opencode/OPENCODE.md`.
- Quando houver divergencia, confiar primeiro nos `package.json` e no codigo atual.

---

Ultima revisao: 2026-04-28
