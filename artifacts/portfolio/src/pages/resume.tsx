import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiPrinter, FiGithub, FiTwitter, FiMail, FiExternalLink, FiAward, FiBriefcase } from "react-icons/fi";
import { Moon, Sun, GraduationCap, Globe } from "lucide-react";
import { jobExperiences, academicExperiences, projects, certificates, languages, skillsData, ContactLinks } from "@/constants";
import { formatDateRange } from "@/lib/dateFormatter";
import { useResumeTranslation, getAvailableLocales } from "@/hooks/useResumeTranslation";

const ACCENT = "#3d72cc";

type ResumeFormat = "visual" | "professional";
type Locale = "en" | "pt-BR";

const iconMap: Record<string, React.ReactNode> = {
  "Palette": <FiBriefcase size={16} />,
  "Warehouse": <FiBriefcase size={16} />,
  "MessageSquare": <FiBriefcase size={16} />,
  "GraduationCap": <GraduationCap size={16} />,
};

const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  if (iconName.startsWith("/")) return null;
  return iconMap[iconName];
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

const logoMap: Record<string, string> = {
  "Lovable": "/timeline/lovable_dev_logo.webp",
  "HubSpot Academy": "/timeline/hubspot_academy_logo.webp",
  "EFSET": "/timeline/efset_logo.webp",
  "LinkedIn Learning": "/timeline/linkedin_logo.webp",
  "Include Gurias": "/timeline/include-gurias.webp",
  "Seu IoT": "/timeline/seu-iot-logo.jpg",
  "UERGS": "/timeline/uergs.webp",
  "Unicive": "/timeline/unicive.webp",
  "UniRitter": "/timeline/uniritter.webp",
  "Microsoft": "/timeline/microsoft_logo.webp",
  "Udemy": "/timeline/udemy_logo.webp",
  "BotsChannel": "/timeline/botschanell-logo.webp",
};

/**
 * VisualCV - Formato visual com logos e fotos
 */
function VisualCV({ isDark, locale }: { isDark: boolean; locale: Locale }) {
  const activeJobs = jobExperiences.filter(exp => exp.showInTimeline);
  const activeEducation = academicExperiences.filter(ed => ed.showInTimeline);
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* ── HEADER WITH PHOTO ── */}
      <motion.section {...fadeUp(0)} className="flex gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="shrink-0"
        >
          <img
            src="/selfie.webp"
            alt="Lucas Henrique Diniz"
            className="w-32 h-32 rounded-2xl object-cover border-2"
            style={{ borderColor: ACCENT }}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: isDark ? "#ffffff" : "#000000" }}>
            Lucas Henrique Diniz
          </h1>
          <p className="text-lg font-semibold mt-1" style={{ color: ACCENT }}>
            {locale === "en" ? "Full Stack Developer" : "Desenvolvedor Full Stack"}
          </p>
          <p className={`text-sm leading-relaxed max-w-2xl mt-3 ${isDark ? "text-gray-400" : "text-gray-700"}`}>
            {locale === "en"
              ? "Full Stack Developer with 5+ years building scalable web applications, IoT platforms, and AI-powered automation systems. Expertise in React, TypeScript, Node.js and cloud infrastructure."
              : "Desenvolvedor Full Stack com 5+ anos construindo aplicações web escaláveis, plataformas IoT e sistemas de automação com IA. Expertise em React, TypeScript, Node.js e infraestrutura cloud."}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <a href={`mailto:${ContactLinks.email}`} className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiMail size={14} />
              {ContactLinks.email}
            </a>
            <a href={ContactLinks.github} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiGithub size={14} />
              github.com/LucasHenriqueDiniz
            </a>
            <a href={ContactLinks.linkedin} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiExternalLink size={14} />
              LinkedIn
            </a>
          </div>
        </div>
      </motion.section>

      {/* ── EXPERIENCE ── */}
      <motion.section {...fadeUp(0.08)}>
        <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            {locale === "en" ? "Professional Experience" : "Experiência Profissional"}
          </h2>
        </div>
        <div className="space-y-6">
          {activeJobs.map((job, i) => (
            <motion.div key={job.id} {...fadeUp(0.12 + i * 0.04)} className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(243, 244, 246)" }}>
                {logoMap[job.institution] ? (
                  <img
                    src={logoMap[job.institution]}
                    alt={job.institution}
                    className="w-8 h-8 object-contain"
                  />
                ) : job.icon && job.icon.startsWith("/") ? (
                  <img
                    src={job.icon}
                    alt={job.institution}
                    className="w-8 h-8 object-contain"
                  />
                ) : getIcon(job.icon) ? (
                  <div style={{ color: ACCENT }}>{getIcon(job.icon)}</div>
                ) : (
                  <FiBriefcase size={16} style={{ color: ACCENT }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                      {job.title}
                    </h3>
                    <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {job.institution}
                    </p>
                  </div>
                  {!job.endDate && (
                    <span className="text-xs font-bold px-2 py-1 rounded shrink-0" style={{ color: ACCENT, backgroundColor: isDark ? "rgba(61, 114, 204, 0.15)" : "rgba(61, 114, 204, 0.1)" }}>
                      {locale === "en" ? "Current" : "Atual"}
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {formatDateRange(job.startDate, job.endDate)}
                </p>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {job.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── EDUCATION ── */}
      <motion.section {...fadeUp(0.28)}>
        <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            {locale === "en" ? "Education" : "Educação"}
          </h2>
        </div>
        <div className="space-y-5">
          {activeEducation.map((ed, i) => (
            <motion.div key={ed.id} {...fadeUp(0.30 + i * 0.04)} className="flex gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(243, 244, 246)" }}>
                {logoMap[ed.institution] ? (
                  <img
                    src={logoMap[ed.institution]}
                    alt={ed.institution}
                    className="w-8 h-8 object-contain"
                  />
                ) : ed.icon && ed.icon.startsWith("/") ? (
                  <img
                    src={ed.icon}
                    alt={ed.institution}
                    className="w-8 h-8 object-contain"
                  />
                ) : getIcon(ed.icon) ? (
                  <div style={{ color: ACCENT }}>{getIcon(ed.icon)}</div>
                ) : (
                  <GraduationCap size={16} style={{ color: ACCENT }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                      {ed.title}
                    </h3>
                    <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {ed.institution}
                    </p>
                  </div>
                  <span className={`text-xs shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {formatDateRange(ed.startDate, ed.endDate)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── SKILLS & LANGUAGES ── */}
      <motion.section {...fadeUp(0.36)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                {locale === "en" ? "Skills" : "Habilidades"}
              </h2>
            </div>
            <div className="space-y-3">
              {['frontend', 'backend', 'integration', 'devops'].map((category) => {
                const categorySkills = skillsData.filter(s => s.category === category);
                if (categorySkills.length === 0) return null;
                return (
                  <div key={category}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      {category === 'frontend' ? (locale === "en" ? "Frontend" : "Frontend") :
                       category === 'backend' ? (locale === "en" ? "Backend" : "Backend") :
                       category === 'integration' ? (locale === "en" ? "Integration" : "Integração") :
                       category === 'devops' ? (locale === "en" ? "Cloud & DevOps" : "Cloud & DevOps") : category}
                    </p>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {categorySkills.map(s => s.name).join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-4 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                {locale === "en" ? "Languages" : "Idiomas"}
              </h2>
            </div>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {lang.name}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                      {locale === "en" ? lang.levelLabel.en : lang.levelLabel.pt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FEATURED PROJECTS ── */}
      {featuredProjects.length > 0 && (
        <motion.section {...fadeUp(0.42)}>
          <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              {locale === "en" ? "Featured Projects" : "Projetos em Destaque"}
            </h2>
          </div>
          <div className="space-y-4">
            {featuredProjects.map((proj, i) => (
              <motion.div key={proj.id} {...fadeUp(0.44 + i * 0.04)}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-bold text-base" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                    {proj.name}
                  </h3>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className={`shrink-0 hover:opacity-70 transition-opacity ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p className={`text-sm leading-relaxed mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {proj.description}
                </p>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                  <span className="font-medium">Tech:</span> {proj.techStack.join(", ")}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── CERTIFICATES ── */}
      {certificates.length > 0 && (
        <motion.section {...fadeUp(0.48)}>
          <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              {locale === "en" ? "Certifications" : "Certificações"}
            </h2>
          </div>
          <div className="space-y-4">
            {certificates.map((cert, i) => (
              <motion.div key={cert.title} {...fadeUp(0.50 + i * 0.04)} className="flex gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5" style={{ backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(243, 244, 246)" }}>
                  <FiAward size={16} style={{ color: ACCENT }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-0.5">
                    <h3 className="font-bold text-sm" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                      {cert.title}
                    </h3>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noreferrer" className={`shrink-0 hover:opacity-70 transition-opacity ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {cert.issuer}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {cert.issueDate}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

/**
 * ProfessionalResume - Formato ATS compacto
 */
function ProfessionalResume({ isDark, locale }: { isDark: boolean; locale: Locale }) {
  const t = useResumeTranslation(locale);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* ── HEADER ── */}
      <motion.section {...fadeUp(0)}>
        <h1 className="text-4xl font-black tracking-tight" style={{ color: isDark ? "#ffffff" : "#000000" }}>
          Lucas Henrique Diniz
        </h1>
        <p className="text-xl font-semibold mt-2" style={{ color: ACCENT }}>
          {t.header.role}
        </p>
        <p className={`text-sm font-medium mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {t.header.subtitle}
        </p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <a href={`mailto:${ContactLinks.email}`} className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <FiMail size={14} />
            {ContactLinks.email}
          </a>
          <a href={ContactLinks.github} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <FiGithub size={14} />
            github.com/LucasHenriqueDiniz
          </a>
        </div>
      </motion.section>

      {/* ── SUMMARY ── */}
      <motion.section {...fadeUp(0.08)}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
          {t.summary.title}
        </h2>
        <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {t.summary.text}
        </p>
      </motion.section>

      {/* ── EXPERIENCE ── */}
      <motion.section {...fadeUp(0.12)}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
          {t.experience.title}
        </h2>
        <div className="space-y-6">
          {Object.values(t.experience.jobs).map((job: any, i: number) => (
            <motion.div key={i} {...fadeUp(0.14 + i * 0.03)}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="font-bold text-base" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                    {job.title}
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {job.company}
                  </p>
                </div>
                <span className={`text-xs shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {job.period}
                </span>
              </div>
              <ul className={`text-sm space-y-1 mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {job.bullets.map((bullet: string, j: number) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── PROJECTS ── */}
      <motion.section {...fadeUp(0.28)}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
          {t.projects.title}
        </h2>
        <div className="space-y-5">
          {Object.values(t.projects.projects).map((proj: any, i: number) => (
            <motion.div key={i} {...fadeUp(0.30 + i * 0.03)}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="font-bold text-base" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                    {proj.name}
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {proj.subtitle}
                  </p>
                </div>
                <a href={`https://${proj.url}`} target="_blank" rel="noreferrer" className={`shrink-0 hover:opacity-70 transition-opacity ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  <FiExternalLink size={14} />
                </a>
              </div>
              <ul className={`text-sm space-y-1 mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {proj.bullets.map((bullet: string, j: number) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                <span className="font-medium">Tech:</span> {proj.tech}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── SKILLS ── */}
      <motion.section {...fadeUp(0.36)}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
          {t.skills.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(t.skills.categories).map((skill: any, i: number) => (
            <motion.div key={i} {...fadeUp(0.38 + i * 0.02)}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                {skill.label}
              </p>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {skill.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── EDUCATION ── */}
      <motion.section {...fadeUp(0.42)}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
          {t.education.title}
        </h2>
        <div className="space-y-4">
          {Object.values(t.education.degrees).map((degree: any, i: number) => (
            <motion.div key={i} {...fadeUp(0.44 + i * 0.02)}>
              <h3 className="font-bold text-base" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                {degree.title}
              </h3>
              <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {degree.institution}
              </p>
              <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {degree.period}
              </p>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {degree.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── CERTIFICATIONS ── */}
      <motion.section {...fadeUp(0.48)}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
          {t.certifications.title}
        </h2>
        <ul className={`text-sm space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {Object.values(t.certifications.certs).map((cert: string, i: number) => (
            <motion.li key={i} {...fadeUp(0.50 + i * 0.02)} className="flex gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{cert}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}

/**
 * Main Resume Component with Toggle
 */
export default function ResumePage() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio-theme") === "dark"
      : false
  );
  const [locale, setLocale] = useState<Locale>(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("resume-locale") as Locale) || "en"
      : "en"
  );
  const [format, setFormat] = useState<ResumeFormat>("visual");

  const toggleDark = () => {
    setIsDark(d => {
      localStorage.setItem("portfolio-theme", !d ? "dark" : "light");
      return !d;
    });
  };

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "pt-BR" : "en";
    setLocale(newLocale);
    localStorage.setItem("resume-locale", newLocale);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark bg-[#0f0f0f] text-gray-100" : "bg-white text-gray-900"}`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          * { background: white !important; color: black !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className={`no-print sticky top-0 z-50 h-16 border-b ${isDark ? "bg-black/95 border-gray-800" : "bg-white border-gray-200"} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <FiArrowLeft size={14} />
            {locale === "en" ? "Back" : "Voltar"}
          </Link>

          {/* Format Tabs */}
          <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
            <button
              onClick={() => setFormat("visual")}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                format === "visual"
                  ? isDark
                    ? "bg-white/10 text-white"
                    : "bg-white text-gray-900"
                  : isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {locale === "en" ? "Visual" : "Visual"}
            </button>
            <button
              onClick={() => setFormat("professional")}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                format === "professional"
                  ? isDark
                    ? "bg-white/10 text-white"
                    : "bg-white text-gray-900"
                  : isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {locale === "en" ? "Professional" : "Profissional"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-gray-200" : "text-gray-600 border-gray-300 hover:text-gray-900"}`}
            >
              <Globe size={13} />
              <span>{locale === "en" ? "PT" : "EN"}</span>
            </button>

            <button onClick={() => window.print()} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-gray-200" : "text-gray-600 border-gray-300 hover:text-gray-900"}`}>
              <FiPrinter size={13} />
              <span>{locale === "en" ? "Print" : "Imprimir"}</span>
            </button>

            <button onClick={toggleDark} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "text-gray-500 hover:bg-gray-900" : "text-gray-600 hover:bg-gray-100"}`}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <motion.div
        key={format}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {format === "visual" ? (
          <VisualCV isDark={isDark} locale={locale} />
        ) : (
          <ProfessionalResume isDark={isDark} locale={locale} />
        )}
      </motion.div>

      {/* ── FOOTER ── */}
      <div className={`no-print text-center text-xs py-8 border-t ${isDark ? "border-gray-800 text-gray-600" : "border-gray-200 text-gray-500"}`}>
        <p>
          {locale === "en" ? "Generated from" : "Gerado a partir de"} <span style={{ color: ACCENT }} className="font-semibold">lucashdo.com</span>
        </p>
      </div>
    </div>
  );
}
