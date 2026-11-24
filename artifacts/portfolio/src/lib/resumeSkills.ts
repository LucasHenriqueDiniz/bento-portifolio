import { skillsData, type SkillCategory, type SkillDataType } from "@/constants/skillsData";

export type ResumeSkillLineKey = "languages" | "frontend" | "backend" | "database" | "devops";

export interface ResumeSkillLine {
  key: ResumeSkillLineKey;
  skills: string[];
}

// Which categories feed each text line. Languages are pulled onto their own line first,
// so TypeScript shows once, under Languages, rather than again under Frontend.
const LINES: Array<{ key: Exclude<ResumeSkillLineKey, "languages">; categories: SkillCategory[] }> = [
  { key: "frontend", categories: ["frontend", "mobile", "desktop"] },
  { key: "backend", categories: ["backend", "integration", "ai"] },
  { key: "database", categories: ["database"] },
  { key: "devops", categories: ["devops", "automation"] },
];

// Category order first (as listed for the line), then each skill's own order.
const namesInOrder = (skills: SkillDataType[], categories: SkillCategory[] = []) =>
  [...skills]
    .sort(
      (a, b) =>
        categories.indexOf(a.category) - categories.indexOf(b.category) || (a.order ?? 999) - (b.order ?? 999)
    )
    .map((skill) => skill.name);

/**
 * The resume's skill lines, for the ATS text block and the PDF. Both used to carry their
 * own hardcoded lists, which drifted from skillsData and from each other's purpose.
 */
export function resumeSkillLines(skills: SkillDataType[] = skillsData): ResumeSkillLine[] {
  const lines: ResumeSkillLine[] = [
    { key: "languages", skills: namesInOrder(skills.filter((skill) => skill.language)) },
    ...LINES.map(({ key, categories }) => ({
      key,
      skills: namesInOrder(
        skills.filter((skill) => !skill.language && categories.includes(skill.category)),
        categories
      ),
    })),
  ];
  return lines.filter((line) => line.skills.length > 0);
}
