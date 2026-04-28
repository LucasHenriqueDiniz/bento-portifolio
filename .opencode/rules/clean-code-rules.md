---
description: Regras de clean code — nomenclatura, tamanho, error handling
globs: src/**/*
---

# Clean Code Rules

## Nomenclatura

### Abreviacoes proibidas

| Ruim | Bom |
|---|---|
| `stmt` | `statement` |
| `ctx` (nao for context type real) | `context` |
| `cnt` | `count` |
| `idx` | `index` |
| `cfg` | `config` |
| `resp` | `response` |
| `qty` | `quantity` |
| `ts` (nao for Timestamp literal) | `timestamp` |

### Abreviacoes permitidas

- `id`, `db` (como parametro), `ok`, `err`, `e` (closures de 1 linha)
- Contadores de loop `i`, `j`
- Tipos genericos `T`, `K`, `V`

### Funcoes/metodos

- `verboSubstantivo` para acoes: `createUser`, `deleteLink`, `fetchProfile`
- `isX` / `hasX` / `shouldX` para predicados: `isAdmin`, `hasData`
- Sem prefixos fluff: `my_`, `do_`, `handleXxxHelper`

## Tamanho de funcao

- **Limite soft:** 80 linhas por funcao. Split se maior.
- **Limite hard:** 200 linhas. Refatorar antes de merge.

## Tamanho de arquivo

- **Limite soft:** 500 linhas. Candidato a refatoracao.
- **Limite hard:** 1500 linhas. Bloquear PRs.

## Error handling

### Use erros tipados, nao strings

```typescript
// RUIM
function process() { throw new Error("algo deu errado"); }

// BOM
enum ApiError {
  NotFound = "NOT_FOUND",
  Unauthorized = "UNAUTHORIZED",
  ValidationFailed = "VALIDATION_FAILED",
}
```

### Nunca ignore erros silenciosamente

```typescript
// RUIM
await cache.invalidate(key);

// BOM
await cache.invalidate(key).catch(e => console.warn("cache invalidate failed:", e));
```

### Map erros para status HTTP no boundary

- 401: credenciais invalidas
- 403: sem permissao
- 404: nao encontrado
- 400: validacao
- 409: conflito
- 5xx: erro servidor

## Dead code

Antes de mergear, remover:
- Handlers/orphaned functions sem rota registrada
- DTOs que so re-exportam
- Blocos comentados "para depois"
- Imports nao usados

## Comentarios

Padrao: **sem comentarios**. Bons nomes + funcoes pequenas se documentam.

Escreva comentario apenas quando o **porque** nao e obvio:
- Constraint escondida
- Workaround para bug especifico (link para issue)
- Comportamento que surpreenderia o leitor

**Nao** escreva comentarios que:
- Explicam **o que** o codigo faz
- Referenciam task/callers atuais
- Estao desatualizados
