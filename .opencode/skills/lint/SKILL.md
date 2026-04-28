---
name: lint
description: Run linters and formatters across the project
---

Run linting and format checking. If `$ARGUMENTS` specifies a target, only lint that. Otherwise lint everything.

## Commands

```bash
# Typecheck (raiz)
pnpm typecheck

# Lint frontend
cd artifacts/portfolio && pnpm exec eslint . --ext .ts,.tsx

# Format check (raiz)
pnpm exec prettier --check "**/*.{ts,tsx,json,md}"

# Format write (raiz)
pnpm exec prettier --write "**/*.{ts,tsx,json,md}"
```

## Output

Report results per tool:
- Number of format violations (if any), with file:line references
- Number of lint violations (if any), with file:line and rule name
- Type errors (if any)
- "All clean" if everything passes
