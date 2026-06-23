---
description: Workflow de desenvolvimento — pitch → research → plan → implement → postmortem
globs: "**/*"
---

# Feature Development Workflow

Ao implementar uma nova feature, SIGA este workflow em ordem. Nao pule passos.

## 1. Escreva o Pitch

Crie um pitch em `docs/pitches/` usando o skill `/pitch`. O pitch define:
- Problema sendo resolvido
- Abordagem da solucao
- Arquitetura
- APIs/interfaces afetados
- Escopo (in/out)
- Research necessario
- Estrategia de testes
- Criterios de sucesso

Obtenha aprovacao do usuario no pitch antes de prosseguir.

## 2. Research

Para cada questao tecnica nao-trivial no pitch:
- Pesquise o topico (docs oficiais, padroes existentes)
- Escreva docs de research em `docs/research/` com tags no frontmatter
- Link research ao pitch

## 3. Crie o Plano de Implementacao

Entre em plan mode e crie um plano detalhado:
- Lista ordenada de arquivos para criar/modificar
- Mudancas de schema, migrations, config
- Mudancas de API/interface

Obtenha aprovacao do usuario no plano antes de prosseguir.

## 4. Implemente

Siga o plano aprovado passo a passo. Escreva testes junto com o codigo.

## 5. Pos-Implementacao

Apos entregar:
- Crie postmortem usando `/postmortem`
- Commit com mensagem significativa
- Atualize docs/roadmap/ se relevante

## Enforcement

- NUNCA comece a escrever codigo de producao antes de completar passos 1-3
- Se o usuario disser "implemente X", comece com o pitch — NAO pule para codigo
- Excecao: mudancas triviais (typo, pequenos refactors, bug fixes) podem pular o pitch
