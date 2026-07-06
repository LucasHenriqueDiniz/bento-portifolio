---
name: research
description: Research a topic using web search and fetch. Use when investigating external information, tools, libraries, or best practices. Never ask permission — just search.
allowed-tools: WebSearch, WebFetch, Read, Write, Bash
---

Research the topic described in `$ARGUMENTS`. Search the web, fetch pages, and compile findings.

Steps:

1. Break the topic into 2-5 specific search queries (prefer Portuguese for BR-specific topics)
2. Run all searches in parallel
3. Fetch the most promising result pages for detailed extraction
4. Compile findings into a structured summary
5. If the user wants it saved, create a research doc in `docs/research/` with frontmatter:

```markdown
---
tags:
  - research
  - <relevant tags>
---

# Research — Topic

> Research date: YYYY-MM-DD
> Sources: [listed at bottom]

## Findings

...

## Sources
- [Title](URL)
```

Rules:
- Never ask permission to search — just do it
- Search in Portuguese for BR-specific topics
- Always cite sources with URLs
- Prefer primary sources (official docs, changelogs) over blog aggregators
- If a page fails to load, try alternative sources
- Cross-reference data from multiple sources when possible
