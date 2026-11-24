import { execFileSync } from "child_process";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "..");
const SITE_URL = "https://lucashdo.com";

// The files whose content each page shows. A page's lastmod is the date of the last
// commit that touched any of them, so it moves only when the page really changed.
// It used to be the build date for every URL, which told crawlers nothing and left
// the committed sitemap.xml modified after every build.
const PROJECT_SOURCES = ["src/constants/projects.ts", "public/projects"];
const ROUTE_SOURCES = {
  "/": ["src/pages/home.tsx", "src/components/home", "src/constants", "functions/api"],
  "/projects": ["src/pages/projects.tsx", ...PROJECT_SOURCES],
  "/resume": ["src/pages/resume.tsx", "src/components/resume", "src/constants"],
  "/contact": ["src/pages/contact.tsx", "src/constants/contacts.ts"],
  "/gallery": ["src/pages/gallery.tsx", "src/components/gallery", "public/gallery"],
  "/donate": ["src/pages/donate.tsx"],
  "/games/voxel-zombie": ["src/pages/voxel-game.tsx", "src/constants/voxelGame.ts", "public/games/voxel-zombie"],
};
const PROJECT_DETAIL_SOURCES = ["src/pages/project-detail.tsx", ...PROJECT_SOURCES];

export function listRoutes(projectsSource) {
  const projectIds = [...projectsSource.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
  return [
    ...Object.keys(ROUTE_SOURCES).map((route) => ({ route, sources: ROUTE_SOURCES[route] })),
    ...projectIds.map((id) => ({ route: `/projects/${id}`, sources: PROJECT_DETAIL_SOURCES })),
  ];
}

const git = (args, cwd) =>
  execFileSync("git", args, { cwd, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).trim();

const isShallow = (cwd) => git(["rev-parse", "--is-shallow-repository"], cwd) !== "false";

// Hosted builds (Cloudflare Pages) clone only the latest commit. Fetching the rest of
// the history lets the dates be read; when the fetch is not possible the clone stays
// shallow and the sitemap goes out without lastmod.
export function ensureHistory(cwd = root) {
  try {
    if (!isShallow(cwd)) return true;
    execFileSync("git", ["fetch", "--quiet", "--unshallow"], { cwd, stdio: "ignore", timeout: 60_000 });
    return !isShallow(cwd);
  } catch {
    return false;
  }
}

// Date (YYYY-MM-DD) of the last commit touching the paths, or null when git cannot say:
// no git, no history for the paths, or a shallow clone, where every file looks as if it
// changed in the one commit that was fetched.
export function lastCommitDate(paths, cwd = root) {
  try {
    if (isShallow(cwd)) return null;
    const out = git(["log", "-1", "--format=%cs", "--", ...paths], cwd);
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

export function renderSitemap(entries) {
  const urls = entries
    .map(
      ({ route, lastmod }) => `  <url>
    <loc>${SITE_URL}${route}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * Writes sitemap.xml into the build output. It is generated, so it is not committed:
 * a URL whose date git cannot tell gets no lastmod rather than an invented one.
 */
export function generateSitemap(outFile = path.join(root, "dist/public/sitemap.xml")) {
  if (!ensureHistory()) console.warn("sitemap: no git history available, writing it without lastmod");
  const projectsSource = readFileSync(path.join(root, "src/constants/projects.ts"), "utf-8");
  const entries = listRoutes(projectsSource).map(({ route, sources }) => ({
    route,
    lastmod: lastCommitDate(sources),
  }));
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, renderSitemap(entries));
  const dated = entries.filter((entry) => entry.lastmod).length;
  console.log(`Generated sitemap.xml with ${entries.length} routes (${dated} with a lastmod from git)`);
  return entries;
}
