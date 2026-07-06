---
name: pitch
description: Create a new pitch document in docs/pitches/
allowed-tools: Bash, Read, Write, Glob
---

Create a new pitch document for the feature described in `$ARGUMENTS`.

Steps:

1. Generate a kebab-case slug from the feature name.
2. Create `docs/pitches/<slug>.md` with this template:

```markdown
---
tags:
  - pitch
  - <relevant tags>
---

# Pitch — Feature Title

## Problem

What problem does this solve? Why do we need this?

## Solution

High-level approach. What will be built?

## Architecture

High-level components, data flow, integrations.

## Schema / Data Changes

Database migrations, config files, state affected.

## Interfaces / APIs

| Method | Route / Entry point | Auth | Description |
|--------|---------------------|------|-------------|

## Scope

### In Scope
- [ ] ...

### Out of Scope
- ...

## Research Needed
- [ ] ...

## Testing Strategy
- ...

## Success Criteria
- [ ] ...
```

3. Fill in the Problem section based on what the user described. Fill in relevant sections if enough context is available. Leave others as templates.
4. Report the created file path.
