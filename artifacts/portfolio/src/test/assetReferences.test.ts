import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..", "..");

const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|css)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });

// Paths like "/projects/x.webp" written in the source are served from public/. A typo or a
// deleted file there shows up as a broken image in production and nowhere else.
const ASSET_PATH = /["'`](\/(?:projects|photos|gallery|timeline|banners|documents|svgs)\/[^"'`$]+\.(?:webp|png|jpe?g|svg|gif|mp4|pdf))["'`]/g;

describe("asset references", () => {
  it("every public asset path written in src exists in public/", () => {
    const missing: string[] = [];
    let checked = 0;
    for (const file of sourceFiles(path.join(root, "src"))) {
      for (const [, assetPath] of fs.readFileSync(file, "utf8").matchAll(ASSET_PATH)) {
        checked++;
        if (!fs.existsSync(path.join(root, "public", assetPath))) missing.push(`${path.relative(root, file)} -> ${assetPath}`);
      }
    }

    expect(checked).toBeGreaterThan(50);
    expect(missing).toEqual([]);
  });
});
