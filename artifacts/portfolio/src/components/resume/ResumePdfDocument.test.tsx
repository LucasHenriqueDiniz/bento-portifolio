import { pdf } from "@react-pdf/renderer";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { ResumePdfDocument } from "./ResumePdfDocument";

async function renderPdfBytes(lang: "en" | "pt") {
  const blob = await pdf(<ResumePdfDocument lang={lang} />).toBlob();
  const buffer = await blob.arrayBuffer();
  return Buffer.from(buffer);
}

// Decompresses every FlateDecode content stream and returns the concatenated
// plain bytes, so we can assert on the actual text-show operators inside —
// the only way to tell real, ATS-extractable text apart from a rasterized
// image (which fonts/PDF renderers can silently fall back to).
function decompressStreams(pdfBytes: Buffer): string {
  const streamRe = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const chunks: Buffer[] = [];
  let match: RegExpExecArray | null;
  const text = pdfBytes.toString("latin1");
  while ((match = streamRe.exec(text))) {
    const raw = Buffer.from(match[1], "latin1");
    try {
      chunks.push(inflateSync(raw));
    } catch {
      // Not a zlib stream (e.g. an embedded font/image) — skip it.
    }
  }
  return Buffer.concat(chunks).toString("latin1");
}

// react-pdf/pdfkit splits a single line of text into several hex-string
// chunks inside one `TJ` array, interleaved with numeric kerning
// adjustments (e.g. `[<57> 30 <6f72> -15 <6b>] TJ` for "Work") — so a raw
// substring search over the compressed stream misses real text that
// happens to fall on a kerning boundary. This reconstructs each `Tj`/`TJ`
// text-show operator back into the plain string it renders on the page.
function extractTextRuns(content: string): string[] {
  const runs: string[] = [];
  const opRe = /(\[((?:<[0-9a-fA-F]*>|\([^)]*\)|[^\]])*)\]|\(([^)]*)\))\s*T[Jj]/g;
  let match: RegExpExecArray | null;
  while ((match = opRe.exec(content))) {
    const body = match[2] ?? match[3] ?? "";
    let run = "";
    const tokenRe = /<([0-9a-fA-F]*)>|\(([^)]*)\)/g;
    let token: RegExpExecArray | null;
    while ((token = tokenRe.exec(body))) {
      if (token[1] !== undefined) {
        run += Buffer.from(token[1], "hex").toString("latin1");
      } else if (token[2] !== undefined) {
        run += token[2];
      }
    }
    if (run) runs.push(run);
  }
  return runs;
}

describe("ResumePdfDocument", () => {
  it("renders a valid, non-trivial PDF for English", async () => {
    const bytes = await renderPdfBytes("en");
    expect(bytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(2000);
  });

  it("renders a valid, non-trivial PDF for Portuguese", async () => {
    const bytes = await renderPdfBytes("pt");
    expect(bytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(2000);
  });

  it("embeds the candidate's name as extractable text, not a rasterized image", async () => {
    const bytes = await renderPdfBytes("en");
    const runs = extractTextRuns(decompressStreams(bytes));
    expect(runs).toContain("Lucas Henrique Diniz");
  });

  it("renders the publications section with its localized heading", async () => {
    const enRuns = extractTextRuns(decompressStreams(await renderPdfBytes("en")));
    const ptRuns = extractTextRuns(decompressStreams(await renderPdfBytes("pt")));

    // styles.sectionTitle applies textTransform: uppercase, so the glyphs that
    // actually reach the page are the uppercased heading, not the i18n string.
    expect(enRuns).toContain("PUBLICATIONS");
    expect(ptRuns).toContain("PUBLICAÇÕES");
    expect(enRuns).toContain(
      "ChatBot Include Gurias: Conhecendo Mulheres das Ciências Exatas",
    );
  });

  it("localizes the role text per language", async () => {
    const enRuns = extractTextRuns(decompressStreams(await renderPdfBytes("en")));
    const ptRuns = extractTextRuns(decompressStreams(await renderPdfBytes("pt")));

    expect(enRuns).toContain("Software Engineer");
    expect(ptRuns).toContain("Engenheiro de Software");
    expect(ptRuns).not.toContain("Software Engineer");
  });
});
