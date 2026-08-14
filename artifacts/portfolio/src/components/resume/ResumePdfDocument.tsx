import { Document, Link, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { TFunction } from "i18next";
import i18n from "@/i18n";
import {
  academicExperiences,
  certificates,
  ContactLinks,
  jobExperiences,
  projects,
  type JobExperience,
  type AcademicExperience,
} from "@/constants";
import { formatDateRange } from "@/lib/dateFormatter";

type Lang = "en" | "pt";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111111",
    lineHeight: 1.4,
  },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  role: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 2, color: "#3D72CC" },
  contactRow: { flexDirection: "row", gap: 10, marginTop: 6, fontSize: 9 },
  link: { color: "#111111", textDecoration: "none" },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#111111",
    paddingBottom: 3,
    marginTop: 14,
    marginBottom: 6,
  },
  itemTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  itemMeta: { fontSize: 9, color: "#444444" },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletMark: { width: 8, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9.5 },
  item: { marginBottom: 6 },
  skillLine: { fontSize: 9.5, marginBottom: 2 },
  skillLabel: { fontFamily: "Helvetica-Bold" },
  certLine: { fontSize: 9.5 },
});

function localized<T extends { title: string; titleEn?: string }>(item: T, lang: Lang): string {
  return lang === "en" ? item.titleEn || item.title : item.title || item.titleEn || "";
}

function localizedDescription(item: { description: string; descriptionEn?: string }, lang: Lang): string {
  return lang === "en" ? item.descriptionEn || item.description : item.description || item.descriptionEn || "";
}

function Bullets({ text }: { text: string }) {
  return (
    <>
      {text
        .split("\n")
        .filter(Boolean)
        .map((line, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>{line.replace(/^[-•]\s*/, "")}</Text>
          </View>
        ))}
    </>
  );
}

const JOB_PRIORITY: Record<string, number> = {
  "policia-federal-it": 1,
  "eng-futuro": 2,
  "comunica-mulher-work": 3,
  "bots-channel": 4,
  "include-gurias-work": 5,
  "eng-futuro-vol": 6,
  "freelance-design": 7,
};

const ATS_PROJECT_IDS = ["botschannel", "heartopia-guide", "weeb-profile", "context-tools"];

function getActiveJobs(): JobExperience[] {
  return [...jobExperiences]
    .filter((job) => job.showInTimeline)
    .sort((a, b) => (JOB_PRIORITY[a.id] || 99) - (JOB_PRIORITY[b.id] || 99));
}

function getActiveEducation(): AcademicExperience[] {
  return [...academicExperiences]
    .filter((edu) => edu.showInTimeline)
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });
}

export function ResumePdfDocument({ lang }: { lang: Lang }) {
  const t = i18n.getFixedT(lang, ["resume", "common"]) as TFunction;
  const dateLocale = lang === "en" ? "en-US" : "pt-BR";
  const presentLabel = t("status.present");
  const formatRange = (start: string, end: string | null | undefined) =>
    formatDateRange(start, end, dateLocale, presentLabel);

  const activeJobs = getActiveJobs();
  const activeEducation = getActiveEducation();
  const atsProjects = ATS_PROJECT_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is (typeof projects)[number] => Boolean(p),
  );
  const topCertificates = certificates.slice(0, 4);

  return (
    <Document title={`Lucas Henrique Diniz — ${t("header.role")}`} author="Lucas Henrique Diniz">
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>Lucas Henrique Diniz</Text>
        <Text style={styles.role}>{t("header.role")}</Text>
        <View style={styles.contactRow}>
          <Link style={styles.link} src={`mailto:${ContactLinks.email}`}>
            {ContactLinks.email}
          </Link>
          <Link style={styles.link} src={ContactLinks.github}>
            github.com/LucasHenriqueDiniz
          </Link>
          <Link style={styles.link} src={ContactLinks.linkedin}>
            linkedin.com/in/lucas-diniz-ostroski
          </Link>
        </View>

        <Text style={styles.sectionTitle}>{t("sections.experience")}</Text>
        {activeJobs.map((job) => (
          <View key={job.id} style={styles.item} wrap={false}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>
                {localized(job, lang)} - {job.institution}
              </Text>
              <Text style={styles.itemMeta}>{formatRange(job.startDate, job.endDate)}</Text>
            </View>
            <Bullets text={localizedDescription(job, lang)} />
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t("sections.projects")}</Text>
        {atsProjects.map((project) => (
          <View key={project.id} style={styles.item} wrap={false}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemTitle}>{project.name}</Text>
              {project.url && <Text style={styles.itemMeta}>{project.url.replace("https://", "")}</Text>}
            </View>
            <Bullets text={lang === "en" && project.descriptionEn ? project.descriptionEn : project.description} />
            <Text style={[styles.itemMeta, { marginTop: 2 }]}>
              {t("ats.tech")}: {project.techStack.join(", ")}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t("sections.skills")}</Text>
        <Text style={styles.skillLine}>
          <Text style={styles.skillLabel}>{t("ats.skills.languages")}: </Text>
          TypeScript, JavaScript, Python, Go, SQL
        </Text>
        <Text style={styles.skillLine}>
          <Text style={styles.skillLabel}>{t("ats.skills.frontend")}: </Text>
          React, Next.js, React Native, Expo, Tailwind CSS, Framer Motion
        </Text>
        <Text style={styles.skillLine}>
          <Text style={styles.skillLabel}>{t("ats.skills.backend")}: </Text>
          Node.js, NestJS, Prisma, REST APIs, WebSockets
        </Text>
        <Text style={styles.skillLine}>
          <Text style={styles.skillLabel}>{t("ats.skills.database")}: </Text>
          PostgreSQL, Supabase, Redis
        </Text>
        <Text style={styles.skillLine}>
          <Text style={styles.skillLabel}>{t("ats.skills.devops")}: </Text>
          AWS Lambda, Docker, Vercel, GitHub Actions
        </Text>

        <Text style={styles.sectionTitle}>{t("sections.education")}</Text>
        {activeEducation.map((edu) => (
          <View key={edu.id} style={styles.itemTitleRow} wrap={false}>
            <Text style={styles.itemTitle}>
              {localized(edu, lang)} - {edu.institution}
            </Text>
            <Text style={styles.itemMeta}>{formatRange(edu.startDate, edu.endDate)}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t("sections.certifications")}</Text>
        <Text style={styles.certLine}>
          {topCertificates.map((cert) => `${cert.title} (${cert.issueDate})`).join("   •   ")}
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadResumePdf(lang: Lang): Promise<void> {
  const blob = await pdf(<ResumePdfDocument lang={lang} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = lang === "en" ? "Lucas-Diniz-Resume.pdf" : "Lucas-Diniz-Curriculo.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
