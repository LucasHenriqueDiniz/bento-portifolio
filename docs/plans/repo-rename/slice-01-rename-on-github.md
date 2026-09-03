---
status: blocked
kanban: cd668dfe-b84c-493f-ae79-03785d929b2c
---

> **Blocked on the owner.** Renaming a repository is a settings change on the GitHub account and a
> product call on the final name (does the `bento-` prefix stay?). `gh auth status` reports this
> machine logged in as `LucasHenriqueDiniz`, so the CLI *could* do it — that is exactly why it is
> marked blocked rather than left to be discovered: an agent must not rename the owner's repository
> off its own judgement. Slice 2 waits on this.

# Slice 1 — Rename the repository on GitHub

## Delivers

The GitHub repository no longer spelled `portifolio`. Nothing in the working tree changes in this
slice.

## Needs

- The owner, twice: to choose the final name, and to perform the rename.
- 5 min, once decided. GitHub's rename is one form field.
- Before pressing it, a check of what binds to the name: the Cloudflare Pages project connected to
  this repository, any README badge, and any external link to
  `github.com/LucasHenriqueDiniz/bento-portifolio`. GitHub redirects the old path, but a redirect is
  a grace period, not a fix — and a Pages/Actions integration that stores the repo name rather than
  its id will not follow one.

## Design constraint

`wrangler.toml` deploys `name = "lucashdo-portfolio"`, and that is the *Cloudflare* project name,
not the repository name. Renaming on GitHub must not turn into renaming the Worker: that one is a
live deployment target and changing it is a different, larger decision that this epic does not ask
for.

## Tests

None. There is nothing in this repository to run against a GitHub-side rename.

## Done when

```
gh api repos/LucasHenriqueDiniz/bento-portifolio --jq .name
```

follows GitHub's redirect and prints the new name — a name that does not contain the string
`portifolio`. If it still prints `bento-portifolio`, the rename has not happened.

## If stuck

If the owner would rather not rename at all, that closes the epic: mark this slice and slice 2
`done` with a decision record saying the typo is accepted, and delete the epic. What is not
acceptable is leaving it undecided while `projects.ts:903` keeps publishing the misspelled URL as
the portfolio's own source link.
