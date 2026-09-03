---
status: active
epic: rename
---

# Settle the repository name

## The problem

The remote carries a typo that nothing else in the project shares:

```
$ git remote -v
origin	git@github.com:LucasHenriqueDiniz/bento-portifolio.git (fetch)
origin	git@github.com:LucasHenriqueDiniz/bento-portifolio.git (push)
```

Inside, everything is spelled correctly: the artifact directory is `artifacts/portfolio/`, the
package is `@workspace/portfolio`, and `wrangler.toml` deploys `name = "lucashdo-portfolio"`.

The typo has leaked into eight tracked lines:

```
$ git grep -ni portifolio
artifacts/portfolio/public/.well-known/api-catalog:5    (and 6 more)
artifacts/portfolio/src/constants/projects.ts:903:    repoUrl: "https://github.com/LucasHenriqueDiniz/bento-portifolio",
```

`api-catalog` is served to the public at `/.well-known/api-catalog`, and `projects.ts:903` is the
"source" link the portfolio shows for itself.

## Why it is worth doing

The `naming` skill's argument is that a repo name travels alone: it is the clone URL, the search
result, and the directory left behind by `git clone`. Nobody sees it next to the correct spelling to
notice the difference.

## Why it is not a `git mv`

Renaming means renaming on GitHub, re-pointing `origin` on every clone, and re-checking anything
GitHub-side that binds to the repo name — Pages/Cloudflare project links, badges, and any external
link to the old URL. GitHub redirects the old name, but a redirect is a grace period, not a fix.

The rename itself needs the owner logged in to GitHub. That step is blocked here on purpose; the
follow-up that cleans the eight lines is not, and waits behind it.

## Scope note

This settles `portifolio` -> `portfolio`. Whether the `bento-` prefix stays is the owner's call and
rides along with the same rename; the plan does not assume an answer.
