import { describe, expect, it } from "vitest";
import { resumeSkillLines } from "./resumeSkills";
import type { SkillDataType } from "@/constants/skillsData";

const skills: SkillDataType[] = [
  { name: "TypeScript", category: "frontend", language: true, order: 1 },
  { name: "Go", category: "backend", language: true, order: 10 },
  { name: "React", category: "frontend", order: 2 },
  { name: "React Native", category: "mobile", order: 34 },
  { name: "Node.js", category: "backend", order: 8 },
  { name: "LLM Integration", category: "ai", order: 21 },
  { name: "GitHub Actions", category: "automation", order: 18 },
  { name: "Cloudflare", category: "devops", order: 25 },
  { name: "Figma", category: "design", order: 31 },
];

describe("resumeSkillLines", () => {
  it("puts the languages on their own first line and nowhere else", () => {
    const lines = resumeSkillLines(skills);

    expect(lines[0]).toEqual({ key: "languages", skills: ["TypeScript", "Go"] });
    expect(lines.slice(1).flatMap((l) => l.skills)).not.toContain("TypeScript");
  });

  it("folds mobile into frontend, AI into backend and automation into devops", () => {
    const byKey = Object.fromEntries(resumeSkillLines(skills).map((l) => [l.key, l.skills]));

    expect(byKey.frontend).toEqual(["React", "React Native"]);
    expect(byKey.backend).toEqual(["Node.js", "LLM Integration"]);
    // Infrastructure before automation, even though GitHub Actions has the lower order.
    expect(byKey.devops).toEqual(["Cloudflare", "GitHub Actions"]);
  });

  it("drops lines with no skills and leaves design tools off", () => {
    const lines = resumeSkillLines(skills);

    expect(lines.map((l) => l.key)).toEqual(["languages", "frontend", "backend", "devops"]);
    expect(lines.flatMap((l) => l.skills)).not.toContain("Figma");
  });

  it("keeps the languages line the resume showed before, now from skillsData", () => {
    expect(resumeSkillLines()[0].skills).toEqual(["TypeScript", "JavaScript", "Python", "Go", "SQL"]);
  });
});
