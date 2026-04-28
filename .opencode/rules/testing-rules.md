---
description: Regras de testes — escrever junto com o codigo, nao depois
globs: src/**/*
---

# Testing Rules

**Escreva testes como parte da implementacao.** Nao como tarefa posterior.

## O que testar

### Layer 1: Testes de utilitarios puros (obrigatorio)

Cada arquivo em `src/lib/` ou `lib/` com logica executavel precisa de testes:

- Helpers de data, slug, calculo, parsers
- Funcoes puras sem efeitos colaterais

Zero mocks — sao funcoes puras, chamam com inputs de fixture.

### Layer 2: Testes de hooks (quando aplicavel)

Hooks customizados com logica complexa:
- Um teste happy path
- Um teste de erro/edge case

Use `@testing-library/react-hooks` ou teste via componente wrapper.

### Layer 3: Testes de componentes (quando aplicavel)

Componentes com logica interna complexa:
- Renderizacao basica
- Interacoes (click, input)
- Estados de loading/erro

Use `@testing-library/react` + `vitest`.

### Layer 4: Testes E2E (obrigatorio para endpoints novos)

Qualquer endpoint novo no backend:
- Happy path
- Auth guard (401/403)
- Caso de erro principal (400/404)

## Regras

- Teste **happy path E casos de erro** (minimo um de cada)
- Nomeie descritivamente: `shouldRejectDuplicateEmail`, nao `test_1`
- Mock APIs externas — **nunca acesse servicos reais** em testes
- Sem testes placeholder: `expect(true).toBe(true)` e dead code — delete
- Novo hook/componente complexo sem teste: **bloqueado** em pre-PR review

## Violacoes comuns

- "Vou adicionar testes depois" — testes saem com o codigo, ponto final
- Teste que chama API real ao inves de mock
- Logica pura enterrada em componente — extrair e testar a parte pura
- Test files que importam de infra em testes de hooks

## Fast test loop

Alvo: rodar testes de lib + components em <5 segundos.

Se mais lento:
- Split tests rapidos (watch mode) de lentos (CI)
- Use `vitest --watch` para desenvolvimento
