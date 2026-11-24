/**
 * The commits an account authored last, from GitHub's commit search. The Events API
 * stopped carrying commit lists in push events, so search is what still answers this.
 */

export interface RecentCommit {
  sha: string;
  /** First line of the commit message. */
  message: string;
  /** "owner/name". */
  repo: string;
  url: string;
  /** ISO date the commit was authored. */
  date: string;
}

interface SearchItem {
  sha?: string;
  html_url?: string;
  commit?: { message?: string; author?: { date?: string } };
  repository?: { full_name?: string; private?: boolean };
}

/**
 * Reads the last `limit` public commits by `userName`. `is:public` keeps private
 * repositories out of the search even when the token can read them, and the filter
 * after it is the same rule applied to the answer: a private commit message must never
 * reach the page.
 */
export async function fetchRecentCommits(userName: string, pat: string, limit = 6): Promise<RecentCommit[]> {
  const query = encodeURIComponent(`author:${userName} is:public`);
  const res = await fetch(
    `https://api.github.com/search/commits?q=${query}&sort=author-date&order=desc&per_page=${limit * 2}`,
    {
      headers: {
        "User-Agent": "portfolio-app/1.0",
        Accept: "application/vnd.github+json",
        ...(pat ? { Authorization: `Bearer ${pat}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error(`GitHub commit search answered ${res.status}`);

  const body = (await res.json()) as { items?: SearchItem[] };
  return (body.items ?? [])
    .filter((item) => item.repository?.private === false && item.sha && item.repository.full_name)
    .slice(0, limit)
    .map((item) => ({
      sha: item.sha as string,
      message: (item.commit?.message ?? "").split("\n")[0].trim(),
      repo: item.repository?.full_name as string,
      url: item.html_url ?? `https://github.com/${item.repository?.full_name}/commit/${item.sha}`,
      date: item.commit?.author?.date ?? "",
    }));
}
