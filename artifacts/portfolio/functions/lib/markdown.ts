import { projects } from "../../src/constants/projects";
import { contacts, ContactLinks } from "../../src/constants/contacts";
import { jobExperiences } from "../../src/constants/jobExperiences";
import { academicExperiences, certificates } from "../../src/constants/academicExperiences";
import { skillsData } from "../../src/constants/skillsData";
import { languages } from "../../src/constants/languages";

const SITE_URL = "https://lucashdo.com";

function frontMatter(title: string, description: string): string {
  return `---\ntitle: "${title}"\ndescription: "${description}"\nsource: "${SITE_URL}"\n---\n\n`;
}

function dateRange(start: string, end?: string | null): string {
  return `${start} — ${end ?? "presente"}`;
}

function contactLine(platform: string, label: string, url: string): string {
  const isLink = /^(https?:|mailto:)/.test(url);
  return isLink ? `- **${platform}**: [${label}](${url})` : `- **${platform}**: ${label}`;
}

export function homeMarkdown(): string {
  const featured = projects.filter((p) => p.featured).sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  const lines = [
    frontMatter("Lucas Diniz — Full-stack Developer", "Portfolio de Lucas Diniz, desenvolvedor full-stack."),
    "# Lucas Diniz",
    "",
    "Desenvolvedor full-stack apaixonado por código, design e transformar ideias em realidade.",
    "",
    "## Contato",
    "",
    ...contacts.map((c) => contactLine(c.platform, c.label, c.url)),
    "",
    "## Projetos em destaque",
    "",
    ...featured.map(
      (p) =>
        `### ${p.name}\n\n${p.description}\n\n**Stack:** ${p.techStack.join(", ")}${p.url ? `\n\n[Ver projeto](${p.url})` : ""}\n`
    ),
    "## Páginas",
    "",
    `- [Projetos](${SITE_URL}/projects)`,
    `- [Currículo](${SITE_URL}/resume)`,
    `- [Contato](${SITE_URL}/contact)`,
    `- [Galeria](${SITE_URL}/gallery)`,
  ];
  return lines.join("\n");
}

export function projectsListMarkdown(): string {
  const lines = [
    frontMatter("Projetos — Lucas Diniz", "Lista de projetos desenvolvidos por Lucas Diniz."),
    "# Projetos",
    "",
    ...projects.map(
      (p) =>
        `## ${p.name}\n\n${p.description}\n\n**Stack:** ${p.techStack.join(", ")}\n**Status:** ${p.status ?? "n/a"}${p.url ? `\n**URL:** ${p.url}` : ""}${p.repoUrl ? `\n**Repositório:** ${p.repoUrl}` : ""}\n\n[Detalhes](${SITE_URL}/projects/${p.id})\n`
    ),
  ];
  return lines.join("\n");
}

export function projectDetailMarkdown(id: string): string | null {
  const p = projects.find((proj) => proj.id === id);
  if (!p) return null;
  const lines = [
    frontMatter(`${p.name} — Lucas Diniz`, p.highlight),
    `# ${p.name}`,
    "",
    p.description,
    "",
    `**Destaque:** ${p.highlight}`,
    "",
    `**Stack:** ${p.techStack.join(", ")}`,
    `**Categoria:** ${p.category}`,
    `**Status:** ${p.status ?? "n/a"}`,
    p.role ? `**Função:** ${p.role}` : "",
    p.year ? `**Ano:** ${p.year}` : "",
    p.url ? `**URL:** ${p.url}` : "",
    p.repoUrl ? `**Repositório:** ${p.repoUrl}` : "",
    "",
    `[Ver todos os projetos](${SITE_URL}/projects)`,
  ];
  return lines.filter((l) => l !== "").join("\n");
}

export function resumeMarkdown(): string {
  const byCategory = new Map<string, string[]>();
  for (const s of skillsData) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s.name);
    byCategory.set(s.category, list);
  }

  const lines = [
    frontMatter("Currículo — Lucas Diniz", "Experiência profissional, formação e habilidades de Lucas Diniz."),
    "# Currículo",
    "",
    "## Experiência profissional",
    "",
    ...jobExperiences.map(
      (j) => `### ${j.title} — ${j.institution}\n\n${dateRange(j.startDate, j.endDate)}\n\n${j.description}\n`
    ),
    "## Formação acadêmica",
    "",
    ...academicExperiences.map(
      (a) => `### ${a.title} — ${a.institution}\n\n${dateRange(a.startDate, a.endDate)}\n\n${a.description}\n`
    ),
    "## Certificados",
    "",
    ...certificates.map((c) => `- **${c.title}** — ${c.issuer} (${c.issueDate})`),
    "",
    "## Habilidades",
    "",
    ...Array.from(byCategory.entries()).map(([category, names]) => `- **${category}:** ${names.join(", ")}`),
    "",
    "## Idiomas",
    "",
    ...languages.map((l) => `- **${l.name}:** ${l.levelLabel.pt}`),
  ];
  return lines.join("\n");
}

export function contactMarkdown(): string {
  const lines = [
    frontMatter("Contato — Lucas Diniz", "Formas de contato com Lucas Diniz."),
    "# Contato",
    "",
    ...contacts.map((c) => contactLine(c.platform, c.label, c.url)),
    "",
    `- **WhatsApp**: ${ContactLinks.whatsapp}`,
  ];
  return lines.join("\n");
}
