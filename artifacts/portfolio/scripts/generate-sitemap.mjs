import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(dirname, "..");
const SITE_URL = "https://lucashdo.com";

const projectsSource = readFileSync(path.join(root, "src/constants/projects.ts"), "utf-8");
const projectIds = [...projectsSource.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);

const staticRoutes = ["/", "/projects", "/resume", "/contact", "/gallery", "/donate"];
const projectRoutes = projectIds.map((id) => `/projects/${id}`);
const routes = [...staticRoutes, ...projectRoutes];

const today = new Date().toISOString().split("T")[0];

const urlEntries = routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(path.join(root, "public/sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${routes.length} routes`);
