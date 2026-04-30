import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiPrinter, FiGithub, FiMail, FiExternalLink, FiAward, FiBriefcase, FiCode, FiLayout } from "react-icons/fi";
import { Moon, Sun, Globe, GraduationCap, MapPin, Linkedin } from "lucide-react";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { jobExperiences, academicExperiences, projects, certificates, languages, skillsData, ContactLinks } from "@/constants";
import { formatDateRange } from "@/lib/dateFormatter";

const ACCENT = "#3d72cc";
type ResumeFormat = "visual" | "ats";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
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

const projectImageMap: Record<string, string> = {
  "heartopia-guide": "/projects/heartopiaguide.webp",
  "weeb-profile": "/projects/weebprofile.webp",
  "windows-xp-online": "/projects/windows_xp_online.webp",
  "include-gurias": "/projects/include_gurias.webp",
  "botschannel-platform": "/projects/botschannel_plataform.webp",
  "resgate-rs": "/projects/rs_resgate.webp",
  "autowabba": "/projects/autowabba.webp",
  "itemmarketcap": "/projects/itemmarketcap.webp",
  "comunica-mulher": "/projects/comunicamulher.webp",
  "quizhub": "/projects/quizhub-thumbnail.webp",
};

const jobFallbackIcons: Record<string, any> = {
  "Autônomo": FiLayout,
};

// ─── Section Title Component ─────────────────────────────
function SectionTitle({ children, icon: Icon, delay = 0, isDark }: { children: React.ReactNode; icon?: any; delay?: number; isDark: boolean }) {
  return (
    <motion.div {...fadeUp(delay)} className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} style={{ color: ACCENT }} />}
      <h2 className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
        {children}
      </h2>
      <div className="flex-1 h-px ml-2" style={{ backgroundColor: isDark ? "rgba(61,114,204,0.2)" : "rgba(61,114,204,0.15)" }} />
    </motion.div>
  );
}

// ─── Skill Tag ───────────────────────────────────────────
function SkillTag({ name, isDark }: { name: string; isDark: boolean }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isDark ? "bg-white/[0.03] border-white/10 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
      {name}
    </span>
  );
}

// ─── Visual Resume ───────────────────────────────────────
function VisualResume({ isDark }: { isDark: boolean }) {
  const { t, i18n } = useTranslation(['resume', 'common']);
  const currentLang = i18n.language?.split("-")[0] || "pt";

  const activeJobs = useMemo(() => jobExperiences.filter(exp => exp.showInTimeline), []);
  const activeEducation = useMemo(() => academicExperiences
    .filter(ed => ed.showInTimeline)
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    }), []);
  const featuredProjects = useMemo(() => projects.filter(p => p.featured).slice(0, 3), []);

  const skillsByCategory = useMemo(() => {
    const cats = ['frontend', 'backend', 'integration', 'automation', 'database', 'devops', 'ai'];
    return cats.map(cat => ({
      category: cat,
      skills: skillsData.filter(s => s.category === cat).slice(0, 6),
    })).filter(g => g.skills.length > 0);
  }, []);

  const renderJobLogo = (job: any) => {
    if (job.icon && job.icon.startsWith("/")) {
      return (
        <div className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
          <img src={job.icon} alt="" className="w-7 h-7 object-contain" />
        </div>
      );
    }
    if (logoMap[job.institution]) {
      return (
        <div className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
          <img src={logoMap[job.institution]} alt="" className="w-7 h-7 object-contain" />
        </div>
      );
    }
    const FallbackIcon = jobFallbackIcons[job.institution];
    if (FallbackIcon) {
      return (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
          <FallbackIcon size={20} style={{ color: ACCENT }} />
        </div>
      );
    }
    return null;
  };

  const getJobTitle = (job: any) => currentLang === 'en' && job.titleEn ? job.titleEn : job.title;
  const getJobDescription = (job: any) => currentLang === 'en' && job.descriptionEn ? job.descriptionEn : job.description;
  const getProjectDescription = (proj: any) => currentLang === 'en' && proj.descriptionEn ? proj.descriptionEn : proj.description;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
      {/* ── HEADER ── */}
      <motion.section {...fadeUp(0)} className="flex gap-5 items-start">
        <img src="/selfie.webp" alt="Lucas" className="w-24 h-24 rounded-xl object-cover border-2 shrink-0" style={{ borderColor: ACCENT }} />
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: isDark ? "#fff" : "#000" }}>Lucas Henrique Diniz</h1>
          <p className="text-sm font-bold mt-1" style={{ color: ACCENT }}>{t('header.role')}</p>
          <p className={`text-[13px] leading-relaxed mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{t('header.summary')}</p>
          
          <div className="flex flex-wrap gap-4 mt-3 text-xs">
            <a href={`mailto:${ContactLinks.email}`} className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiMail size={12} style={{ color: "#EA4335" }} /> <span>{ContactLinks.email}</span>
            </a>
            <a href={ContactLinks.github} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiGithub size={12} style={{ color: isDark ? "#ccc" : "#333" }} /> <span>github.com/LucasHenriqueDiniz</span>
            </a>
            <a href={ContactLinks.linkedin} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <Linkedin size={12} style={{ color: "#0A66C2" }} /> <span>linkedin.com/in/lucas-diniz-ostroski</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* ── EXPERIENCE ── */}
      <section>
        <SectionTitle icon={FiBriefcase} delay={0.05} isDark={isDark}>{t('sections.experience')}</SectionTitle>
        <div className="relative pl-4 border-l border-dashed" style={{ borderColor: isDark ? "rgba(61,114,204,0.25)" : "rgba(61,114,204,0.2)" }}>
          {activeJobs.map((job, i) => (
            <motion.div key={job.id} {...fadeUp(0.08 + i * 0.03)} className="relative mb-4 last:mb-0">
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: isDark ? "#1f2937" : "#fff", borderColor: ACCENT }} />
              <div className="flex items-start gap-3">
                {renderJobLogo(job)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{getJobTitle(job)}</h3>
                    {!job.endDate && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: ACCENT, backgroundColor: isDark ? "rgba(61,114,204,0.12)" : "rgba(61,114,204,0.08)" }}>
                        {t('common:status.current')}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{job.institution}</p>
                  <p className={`text-[10px] mb-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>{formatDateRange(job.startDate, job.endDate)}</p>
                  <p className={`text-[12px] leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{getJobDescription(job)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section>
        <SectionTitle icon={FiCode} delay={0.15} isDark={isDark}>{t('sections.projects')}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {featuredProjects.map((proj, i) => {
            const imageSrc = projectImageMap[proj.id] || proj.image || "/logo.svg";
            return (
              <motion.a key={proj.id} href={proj.url} target="_blank" rel="noreferrer" {...fadeUp(0.18 + i * 0.04)} className={`group block rounded-xl border overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg ${isDark ? "bg-white/[0.02] border-white/8 hover:border-[#3d72cc]/30" : "bg-white border-gray-200 hover:border-[#3d72cc]/30"}`}>
                <div className="relative h-28 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={imageSrc} alt={proj.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2"><h3 className="text-sm font-bold text-white truncate">{proj.name}</h3></div>
                </div>
                <div className="p-3">
                  <div className="flex gap-1 flex-wrap mb-2">
                    {proj.techStack.slice(0, 3).map(t => <span key={t} className={`text-[9px] px-1.5 py-px rounded font-medium ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>{t}</span>)}
                  </div>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{getProjectDescription(proj)}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section>
        <SectionTitle icon={FiCode} delay={0.22} isDark={isDark}>{t('sections.skills')}</SectionTitle>
        <div className="space-y-2.5">
          {skillsByCategory.map((group) => (
            <motion.div key={group.category} {...fadeUp(0.24)} className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 w-20 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{t(`categories.${group.category}`)}</span>
              <div className="flex flex-wrap gap-1">
                {group.skills.map(s => <SkillTag key={s.name} name={s.name} isDark={isDark} />)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section>
        <SectionTitle icon={GraduationCap} delay={0.28} isDark={isDark}>{t('sections.education')}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeEducation.map((ed, i) => (
            <motion.div key={ed.id} {...fadeUp(0.30 + i * 0.03)} className={`flex gap-3 p-3 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/8" : "bg-white border-gray-200"}`}>
              {logoMap[ed.institution] ? (
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: isDark ? "rgba(61,114,204,0.3)" : "rgba(61,114,204,0.2)" }}>
                  <img src={logoMap[ed.institution]} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${isDark ? "bg-white/5" : "bg-gray-100"}`} style={{ borderColor: isDark ? "rgba(61,114,204,0.3)" : "rgba(61,114,204,0.2)" }}>
                  <GraduationCap size={20} style={{ color: ACCENT }} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{currentLang === 'en' && ed.titleEn ? ed.titleEn : ed.title}</h3>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{ed.institution}</p>
                <p className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>{formatDateRange(ed.startDate, ed.endDate)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section>
        <SectionTitle icon={MapPin} delay={0.35} isDark={isDark}>{t('sections.languages')}</SectionTitle>
        <div className="flex gap-4">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{lang.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-px rounded ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                {currentLang === 'en' ? lang.levelLabel.en : lang.levelLabel.pt}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CERTIFICATES ── */}
      <section>
        <SectionTitle icon={FiAward} delay={0.40} isDark={isDark}>{t('sections.certifications')}</SectionTitle>
        <div className="grid grid-cols-1 gap-y-1">
          {certificates.map((cert) => (
            <a key={cert.title} href={cert.url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-[11px] py-1 hover:opacity-70 transition-opacity group ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <span style={{ color: ACCENT }}>•</span>
              <span className="flex-1 truncate">{cert.title}</span>
              <span className={`text-[10px] shrink-0 ${isDark ? "text-gray-600" : "text-gray-400"}`}>({cert.issueDate})</span>
              {cert.url && <FiExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: ACCENT }} />}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── ATS Resume ──────────────────────────────────────────
function ATSResume({ isDark }: { isDark: boolean }) {
  const { t, i18n } = useTranslation(['resume', 'common']);
  const currentLang = i18n.language?.split("-")[0] || "pt";

  const activeJobs = useMemo(() => jobExperiences.filter(exp => exp.showInTimeline), []);
  const activeEducation = useMemo(() => academicExperiences.filter(ed => ed.showInTimeline), []);
  const featuredProjects = useMemo(() => projects.filter(p => p.featured).slice(0, 3), []);

  const getJobTitle = (job: any) => currentLang === 'en' && job.titleEn ? job.titleEn : job.title;
  const getJobDescription = (job: any) => currentLang === 'en' && job.descriptionEn ? job.descriptionEn : job.description;

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8 space-y-5">
      <section>
        <h1 className="text-2xl font-black" style={{ color: isDark ? "#fff" : "#000" }}>Lucas Henrique Diniz</h1>
        <p className="text-sm font-bold mt-0.5" style={{ color: ACCENT }}>{t('header.role')}</p>
        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{ContactLinks.email} | github.com/LucasHenriqueDiniz | linkedin.com/in/lucas-diniz-ostroski</p>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>{t('header.role')}</h2>
        <p className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{t('header.summary')}</p>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('sections.experience')}</h2>
        <div className="space-y-3">
          {activeJobs.map(job => (
            <div key={job.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{getJobTitle(job)}</h3>
                <span className={`text-[10px] shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{formatDateRange(job.startDate, job.endDate)}</span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{job.institution}</p>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{getJobDescription(job)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('sections.projects')}</h2>
        <div className="space-y-2.5">
          {featuredProjects.map(proj => (
            <div key={proj.id}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{proj.name}</h3>
                {proj.url && <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{proj.url.replace('https://', '')}</span>}
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{currentLang === 'en' && proj.descriptionEn ? proj.descriptionEn : proj.description}</p>
              <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Tech: {proj.techStack.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('sections.skills')}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>{t('categories.frontend')}:</span> TypeScript, JavaScript, Python, Go, SQL</p>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>{t('categories.backend')}:</span> React, Next.js, React Native, Expo, Tailwind CSS</p>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>{t('categories.integration')}:</span> Node.js, PostgreSQL, Supabase, Redis, Prisma</p>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>{t('categories.devops')}:</span> AWS Lambda, Docker, Vercel, GitHub Actions</p>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t('sections.education')}</h2>
        <div className="space-y-1.5">
          {activeEducation.map(ed => (
            <div key={ed.id} className="flex items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{currentLang === 'en' && ed.titleEn ? ed.titleEn : ed.title}</span>
                <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-600"}`}> — {ed.institution}</span>
              </div>
              <span className={`text-[10px] shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{formatDateRange(ed.startDate, ed.endDate)}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>{t('sections.certifications')}</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          {certificates.map(cert => (
            <span key={cert.title} className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>• {cert.title} ({cert.issueDate})</span>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────
export default function ResumePage() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio-theme") === "dark"
      : false
  );
  const [format, setFormat] = useState<ResumeFormat>("visual");
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language?.split("-")[0] || "pt";

  useEffect(() => {
    const suffix = currentLang === "en" ? "Resume" : "Curriculo";
    document.title = `Lucas-Henrique-Diniz-${suffix}`;
    return () => {
      document.title = "lucashdo — Lucas Henrique Diniz";
    };
  }, [currentLang]);

  const toggleDark = () => {
    setIsDark(d => {
      localStorage.setItem("portfolio-theme", !d ? "dark" : "light");
      return !d;
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark bg-[#0f0f0f] text-gray-100" : "bg-white text-gray-900"}`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-black { color: black !important; }
          a { text-decoration: none !important; color: black !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      <header className={`no-print sticky top-0 z-50 h-14 border-b ${isDark ? "bg-black/95 border-gray-800" : "bg-white border-gray-200"} backdrop-blur-sm`}>
        <div className="max-w-[900px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <FiArrowLeft size={14} /> {t('buttons.back')}
          </Link>

          <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
            <button onClick={() => setFormat("visual")} className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${format === "visual" ? (isDark ? "bg-white/10 text-white" : "bg-white text-gray-900") : (isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900")}`}>Visual</button>
            <button onClick={() => setFormat("ats")} className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${format === "ats" ? (isDark ? "bg-white/10 text-white" : "bg-white text-gray-900") : (isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900")}`}>ATS</button>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher isDark={isDark} />
            <button onClick={() => window.print()} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-gray-200" : "text-gray-600 border-gray-300 hover:text-gray-900"}`}>
              <FiPrinter size={13} /> <span>{t('buttons.print')}</span>
            </button>
            <button onClick={toggleDark} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "text-gray-500 hover:bg-gray-900" : "text-gray-600 hover:bg-gray-100"}`}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      <motion.div key={format} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        {format === "visual" ? <VisualResume isDark={isDark} /> : <ATSResume isDark={isDark} />}
      </motion.div>

      <div className={`no-print text-center text-[10px] py-6 border-t ${isDark ? "border-gray-800 text-gray-600" : "border-gray-200 text-gray-400"}`}>
        {t('footer.generatedFrom')} <span style={{ color: ACCENT }} className="font-semibold">lucashdo.com</span>
      </div>
    </div>
  );
}
