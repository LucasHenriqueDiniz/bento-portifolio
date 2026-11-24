import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
// @ts-expect-error plain .mjs build script, no type declarations
import { ensureHistory, lastCommitDate, listRoutes, renderSitemap } from "./generate-sitemap.mjs";

const git = (cwd: string, args: string[], date?: string) =>
  execFileSync("git", args, {
    cwd,
    stdio: "ignore",
    env: { ...process.env, ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) },
  });

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-test-"));
  git(dir, ["init", "-q"]);
  git(dir, ["config", "user.email", "test@example.com"]);
  git(dir, ["config", "user.name", "Test"]);
  git(dir, ["config", "commit.gpgsign", "false"]);
  const commit = (file: string, date: string) => {
    fs.writeFileSync(path.join(dir, file), date);
    git(dir, ["add", file]);
    git(dir, ["commit", "-q", "--no-verify", "-m", file], `${date}T12:00:00Z`);
  };
  return { dir, commit };
}

describe("sitemap", () => {
  it("dates a page by the last commit that touched its own files", () => {
    const { dir, commit } = makeRepo();
    commit("home.tsx", "2026-01-10");
    commit("gallery.tsx", "2026-03-05");

    expect(lastCommitDate(["home.tsx"], dir)).toBe("2026-01-10");
    expect(lastCommitDate(["gallery.tsx"], dir)).toBe("2026-03-05");
    expect(lastCommitDate(["home.tsx", "gallery.tsx"], dir)).toBe("2026-03-05");
  });

  it("gives no date for files git has no history of, or outside a repository", () => {
    const { dir, commit } = makeRepo();
    commit("home.tsx", "2026-01-10");

    expect(lastCommitDate(["never-committed.tsx"], dir)).toBeNull();
    expect(lastCommitDate(["home.tsx"], fs.mkdtempSync(path.join(os.tmpdir(), "no-repo-")))).toBeNull();
  });

  it("gives no date in a shallow clone, where every file looks just changed", () => {
    const { dir, commit } = makeRepo();
    commit("home.tsx", "2026-01-10");
    commit("gallery.tsx", "2026-03-05");
    const shallow = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-shallow-"));
    git(shallow, ["clone", "-q", "--depth", "1", `file://${dir}`, "."]);

    expect(lastCommitDate(["home.tsx"], shallow)).toBeNull();
  });

  it("fetches the missing history of a shallow clone, after which the dates are right", () => {
    const { dir, commit } = makeRepo();
    commit("home.tsx", "2026-01-10");
    commit("gallery.tsx", "2026-03-05");
    const shallow = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-shallow-"));
    git(shallow, ["clone", "-q", "--depth", "1", `file://${dir}`, "."]);

    expect(ensureHistory(shallow)).toBe(true);
    expect(lastCommitDate(["home.tsx"], shallow)).toBe("2026-01-10");
  });

  it("lists the static pages and one page per project", () => {
    const routes = listRoutes('{ id: "alpha" }, { id: "beta" }').map((r: { route: string }) => r.route);

    expect(routes).toEqual(["/", "/projects", "/resume", "/contact", "/gallery", "/donate", "/projects/alpha", "/projects/beta"]);
  });

  it("writes lastmod only where a date is known", () => {
    const xml = renderSitemap([
      { route: "/", lastmod: "2026-01-10" },
      { route: "/donate", lastmod: null },
    ]);

    expect(xml).toContain("<loc>https://lucashdo.com/</loc>\n    <lastmod>2026-01-10</lastmod>\n    <changefreq>weekly</changefreq>");
    expect(xml).toContain("<loc>https://lucashdo.com/donate</loc>\n    <changefreq>monthly</changefreq>");
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
  });
});
