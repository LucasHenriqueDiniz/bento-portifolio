---
name: postmortem
description: Move a completed pitch to postmortem with retrospective
allowed-tools: Bash, Read, Write, Edit, Glob
---

Create a postmortem for pitch `$ARGUMENTS`.

Steps:

1. Find the pitch file matching the name in `docs/pitches/`.
2. Read the pitch content.
3. Create a postmortem file in `docs/postmortem/<slug>.md` and keep the original pitch as `docs/postmortem/pitch-<slug>.md`.
4. For the postmortem file:
   - Add `postmortem` and `shipped` to frontmatter tags
   - Change heading to reflect implementation status
   - Add link to original pitch
5. Add these sections:

```markdown
## What was built

(Summary of what was actually implemented)

## What Worked
- ...

## What Didn't Work
- ...

## Implementation Notes
- ...

## Lessons Learned
- ...
```

6. Move the pitch file to `docs/postmortem/pitch-<slug>.md`.
7. Update any links in other docs that pointed to the pitch.
8. Report the created file paths and remind the user to fill in the retrospective sections.
