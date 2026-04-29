import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { FiArrowLeft, FiPrinter, FiGithub, FiMail, FiExternalLink, FiAward, FiBriefcase, FiCode } from "react-icons/fi";
import { Moon, Sun, Globe, GraduationCap, MapPin, Linkedin } from "lucide-react";
import { SiInstagram, SiDiscord, SiGithub, SiSteam } from "react-icons/si";
import { jobExperiences, academicExperiences, projects, certificates, languages, skillsData, ContactLinks } from "@/constants";
import { formatDateRange } from "@/lib/dateFormatter";

const ACCENT = "#3d72cc";
type ResumeFormat = "visual" | "ats";
type Locale = "en" | "pt-BR";

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

// Social links with colors
const socialLinks = [
  { icon: SiGithub, href: ContactLinks.github, label: "GitHub", color: "#333" },
  { icon: SiInstagram, href: ContactLinks.instagram, label: "Instagram", color: "#E4405F" },
  { icon: SiDiscord, href: `https://discord.com/users/${ContactLinks.discord}`, label: "Discord", color: "#5865F2" },
  { icon: SiSteam, href: ContactLinks.steam, label: "Steam", color: "#1b2838" },
];

// ─── Social Links Component ──────────────────────────────
function SocialLinks({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-2 mt-3">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"}`}
          style={{ color: social.color }}
          title={social.label}
        >
          <social.icon size={16} />
        </a>
      ))}
      {/* LinkedIn with lucide icon */}
      <a
        href={ContactLinks.linkedin}
        target="_blank"
        rel="noreferrer"
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"}`}
        style={{ color: "#0A66C2" }}
        title="LinkedIn"
      >
        <Linkedin size={16} />
      </a>
      <a
        href={`mailto:${ContactLinks.email}`}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"}`}
        style={{ color: "#EA4335" }}
        title="Email"
      >
        <FiMail size={16} />
      </a>
    </div>
  );
}

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
function VisualResume({ isDark, locale }: { isDark: boolean; locale: Locale }) {
  const activeJobs = useMemo(() => jobExperiences.filter(exp => exp.showInTimeline), []);
  const activeEducation = useMemo(() => academicExperiences
    .filter(ed => ed.showInTimeline)
    .sort((a, b) => {
      // Sort by start date descending (most recent first)
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    }), []);
  const featuredProjects = useMemo(() => projects.filter(p => p.featured).slice(0, 3), []);

  const skillsByCategory = useMemo(() => {
    const cats = ['frontend', 'backend', 'integration', 'automation', 'database', 'devops'];
    return cats.map(cat => ({
      category: cat,
      skills: skillsData.filter(s => s.category === cat).slice(0, 6),
    })).filter(g => g.skills.length > 0);
  }, []);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
      {/* ── HEADER ── */}
      <motion.section {...fadeUp(0)} className="flex gap-5 items-start">
        <img src="/selfie.webp" alt="Lucas" className="w-24 h-24 rounded-xl object-cover border-2 shrink-0" style={{ borderColor: ACCENT }} />
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: isDark ? "#fff" : "#000" }}>Lucas Henrique Diniz</h1>
          <p className="text-sm font-bold mt-1" style={{ color: ACCENT }}>
            {locale === "en" ? "Full Stack Developer" : "Desenvolvedor Full Stack"}
          </p>
          <p className={`text-[13px] leading-relaxed mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {locale === "en"
              ? "5+ years building scalable web apps, IoT platforms & AI automation. React, TypeScript, Node.js, AWS."
              : "5+ anos construindo apps web, plataformas IoT e automação com IA. React, TypeScript, Node.js, AWS."}
          </p>
          
          {/* Contact links with icons */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <a href={`mailto:${ContactLinks.email}`} className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiMail size={12} style={{ color: "#EA4335" }} /> 
              <span>{ContactLinks.email}</span>
            </a>
            <a href={ContactLinks.github} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <SiGithub size={12} style={{ color: "#333" }} /> 
              <span>github.com/LucasHenriqueDiniz</span>
            </a>
            <a href={ContactLinks.linkedin} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <Linkedin size={12} style={{ color: "#0A66C2" }} /> 
              <span>linkedin.com/in/lucas-diniz-ostroski</span>
            </a>
          </div>
          
          {/* Social icons */}
          <SocialLinks isDark={isDark} />
        </div>
      </motion.section>

      {/* ── EXPERIENCE (Timeline layout) ── */}
      <section>
        <SectionTitle icon={FiBriefcase} delay={0.05} isDark={isDark}>
          {locale === "en" ? "Experience" : "Experiência"}
        </SectionTitle>
        <div className="relative pl-4 border-l border-dashed" style={{ borderColor: isDark ? "rgba(61,114,204,0.25)" : "rgba(61,114,204,0.2)" }}>
          {activeJobs.map((job, i) => (
            <motion.div key={job.id} {...fadeUp(0.08 + i * 0.03)} className="relative mb-4 last:mb-0">
              {/* Dot */}
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: isDark ? "#1f2937" : "#fff", borderColor: ACCENT }} />
              <div className="flex items-start gap-3">
                {logoMap[job.institution] && (
                  <img src={logoMap[job.institution]} alt="" className="w-8 h-8 rounded object-contain shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{job.title}</h3>
                    {!job.endDate && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: ACCENT, backgroundColor: isDark ? "rgba(61,114,204,0.12)" : "rgba(61,114,204,0.08)" }}>
                        {locale === "en" ? "Current" : "Atual"}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>{job.institution}</p>
                  <p className={`text-[10px] mb-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>{formatDateRange(job.startDate, job.endDate)}</p>
                  <p className={`text-[12px] leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{job.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS (Cards with images) ── */}
      <section>
        <SectionTitle icon={FiCode} delay={0.15} isDark={isDark}>
          {locale === "en" ? "Featured Projects" : "Projetos em Destaque"}
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {featuredProjects.map((proj, i) => (
            <motion.a
              key={proj.id}
              href={proj.url}
              target="_blank"
              rel="noreferrer"
              {...fadeUp(0.18 + i * 0.04)}
              className={`group block rounded-xl border overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg ${isDark ? "bg-white/[0.02] border-white/8 hover:border-[#3d72cc]/30" : "bg-white border-gray-200 hover:border-[#3d72cc]/30"}`}
            >
              {/* Project Image */}
              <div className="relative h-24 overflow-hidden">
                <img 
                  src={proj.image || "/logo.svg"} 
                  alt={proj.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-sm font-bold text-white truncate">{proj.name}</h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-3">
                <div className="flex gap-1 flex-wrap mb-2">
                  {proj.techStack.slice(0, 3).map(t => (
                    <span key={t} className={`text-[9px] px-1.5 py-px rounded font-medium ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>{t}</span>
                  ))}
                </div>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{proj.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── SKILLS (Tag cloud) ── */}
      <section>
        <SectionTitle icon={FiCode} delay={0.22} isDark={isDark}>
          {locale === "en" ? "Skills" : "Habilidades"}
        </SectionTitle>
        <div className="space-y-2">
          {skillsByCategory.map((group) => (
            <div key={group.category} className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 w-20 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {group.category}
              </span>
              <div className="flex flex-wrap gap-1">
                {group.skills.map(s => <SkillTag key={s.name} name={s.name} isDark={isDark} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION (Compact horizontal) ── */}
      <section>
        <SectionTitle icon={GraduationCap} delay={0.28} isDark={isDark}>
          {locale === "en" ? "Education" : "Educação"}
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeEducation.map((ed, i) => (
            <motion.div key={ed.id} {...fadeUp(0.30 + i * 0.03)} className={`flex gap-3 p-3 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/8" : "bg-white border-gray-200"}`}>
              {logoMap[ed.institution] && (
                <img src={logoMap[ed.institution]} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0" />
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{ed.title}</h3>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{ed.institution}</p>
                <p className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>{formatDateRange(ed.startDate, ed.endDate)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LANGUAGES (Compact inline) ── */}
      <section>
        <SectionTitle icon={MapPin} delay={0.35} isDark={isDark}>
          {locale === "en" ? "Languages" : "Idiomas"}
        </SectionTitle>
        <div className="flex gap-4">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{lang.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-px rounded ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                {locale === "en" ? lang.levelLabel.en : lang.levelLabel.pt}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CERTIFICATES (Ultra compact grid) ── */}
      <section>
        <SectionTitle icon={FiAward} delay={0.40} isDark={isDark}>
          {locale === "en" ? "Certifications" : "Certificações"}
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
          {certificates.map((cert) => (
            <a key={cert.title} href={cert.url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-[11px] py-1 hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <span style={{ color: ACCENT }}>•</span>
              <span className="truncate">{cert.title}</span>
              <span className={`text-[10px] shrink-0 ${isDark ? "text-gray-600" : "text-gray-400"}`}>({cert.issueDate})</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── ATS Resume (text-only, dense) ───────────────────────
function ATSResume({ isDark, locale }: { isDark: boolean; locale: Locale }) {
  const t = useMemo(() => {
    // Inline translations to avoid JSON import issues
    const data = {
      en: {
        header: { role: "Full Stack Developer", subtitle: "IoT & Automation Specialist" },
        summary: { title: "Professional Summary", text: "Full Stack Developer with 5+ years building scalable web applications, IoT platforms, and AI-powered automation systems. Expertise in React, TypeScript, Node.js, and cloud infrastructure (AWS, Supabase). Proven track record architecting SaaS platforms, implementing real-time systems, and leading technical initiatives." },
        experience: { title: "Professional Experience" },
        projects: { title: "Selected Projects" },
        skills: { title: "Technical Skills" },
        education: { title: "Education" },
        certifications: { title: "Certifications" },
      },
      'pt-BR': {
        header: { role: "Desenvolvedor Full Stack", subtitle: "Especialista em IoT & Automação" },
        summary: { title: "Resumo Profissional", text: "Desenvolvedor Full Stack com 5+ anos construindo aplicações web escaláveis, plataformas IoT e sistemas de automação com IA. Expertise em React, TypeScript, Node.js e infraestrutura cloud (AWS, Supabase)." },
        experience: { title: "Experiência Profissional" },
        projects: { title: "Projetos em Destaque" },
        skills: { title: "Habilidades Técnicas" },
        education: { title: "Educação" },
        certifications: { title: "Certificações" },
      }
    };
    return data[locale] || data.en;
  }, [locale]);

  const activeJobs = useMemo(() => jobExperiences.filter(exp => exp.showInTimeline), []);
  const activeEducation = useMemo(() => academicExperiences.filter(ed => ed.showInTimeline), []);
  const featuredProjects = useMemo(() => projects.filter(p => p.featured).slice(0, 3), []);

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8 space-y-5">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-black" style={{ color: isDark ? "#fff" : "#000" }}>Lucas Henrique Diniz</h1>
        <p className="text-sm font-bold mt-0.5" style={{ color: ACCENT }}>{t.header.role}</p>
        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{ContactLinks.email} | github.com/LucasHenriqueDiniz | linkedin.com/in/lucas-diniz-ostroski</p>
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>{t.summary.title}</h2>
        <p className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{t.summary.text}</p>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t.experience.title}</h2>
        <div className="space-y-3">
          {activeJobs.map(job => (
            <div key={job.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{job.title}</h3>
                <span className={`text-[10px] shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{formatDateRange(job.startDate, job.endDate)}</span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>{job.institution}</p>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t.projects.title}</h2>
        <div className="space-y-2.5">
          {featuredProjects.map(proj => (
            <div key={proj.id}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{proj.name}</h3>
                {proj.url && <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{proj.url.replace('https://', '')}</span>}
              </div>
              <p className={`text-[11px] leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{proj.description}</p>
              <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>Tech: {proj.techStack.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t.skills.title}</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>Languages:</span> TypeScript, JavaScript, Python, Go, SQL</p>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>Frontend:</span> React, Next.js, React Native, Expo, Tailwind CSS</p>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>Backend:</span> Node.js, PostgreSQL, Supabase, Redis, Prisma</p>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}><span className="font-semibold" style={{ color: isDark ? "#fff" : "#000" }}>Cloud:</span> AWS Lambda, Docker, Vercel, GitHub Actions</p>
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{t.education.title}</h2>
        <div className="space-y-1.5">
          {activeEducation.map(ed => (
            <div key={ed.id} className="flex items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{ed.title}</span>
                <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-600"}`}> — {ed.institution}</span>
              </div>
              <span className={`text-[10px] shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>{formatDateRange(ed.startDate, ed.endDate)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>{t.certifications.title}</h2>
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
      <style>{`@media print {.no-print{display:none!important}body{background:white!important}*{background:white!important;color:black!important}}`}</style>

      {/* ── NAV ── */}
      <header className={`no-print sticky top-0 z-50 h-14 border-b ${isDark ? "bg-black/95 border-gray-800" : "bg-white border-gray-200"} backdrop-blur-sm`}>
        <div className="max-w-[900px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <FiArrowLeft size={14} /> {locale === "en" ? "Back" : "Voltar"}
          </Link>

          {/* Format Tabs */}
          <div className={`flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
            <button onClick={() => setFormat("visual")} className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${format === "visual" ? (isDark ? "bg-white/10 text-white" : "bg-white text-gray-900") : (isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900")}`}>
              Visual
            </button>
            <button onClick={() => setFormat("ats")} className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${format === "ats" ? (isDark ? "bg-white/10 text-white" : "bg-white text-gray-900") : (isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900")}`}>
              ATS
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleLocale} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-gray-200" : "text-gray-600 border-gray-300 hover:text-gray-900"}`}>
              <Globe size={13} /> <span>{locale === "en" ? "PT" : "EN"}</span>
            </button>
            <button onClick={() => window.print()} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-gray-200" : "text-gray-600 border-gray-300 hover:text-gray-900"}`}>
              <FiPrinter size={13} /> <span>{locale === "en" ? "Print" : "Imprimir"}</span>
            </button>
            <button onClick={toggleDark} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "text-gray-500 hover:bg-gray-900" : "text-gray-600 hover:bg-gray-100"}`}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <motion.div key={format} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        {format === "visual" ? <VisualResume isDark={isDark} locale={locale} /> : <ATSResume isDark={isDark} locale={locale} />}
      </motion.div>

      {/* ── FOOTER ── */}
      <div className={`no-print text-center text-[10px] py-6 border-t ${isDark ? "border-gray-800 text-gray-600" : "border-gray-200 text-gray-400"}`}>
        {locale === "en" ? "Generated from" : "Gerado a partir de"} <span style={{ color: ACCENT }} className="font-semibold">lucashdo.com</span>
      </div>
    </div>
  );
}
