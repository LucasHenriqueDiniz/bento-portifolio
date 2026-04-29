import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiArrowLeft, FiPrinter, FiGithub, FiTwitter, FiMail,
  FiMapPin, FiExternalLink, FiStar,
} from "react-icons/fi";
import {
  SiTypescript, SiGo, SiPython, SiReact, SiNextdotjs,
  SiTailwindcss, SiNodedotjs, SiPostgresql, SiRedis,
  SiDocker, SiSupabase, SiFigma, SiExpo,
} from "react-icons/si";
import { Moon, Sun } from "lucide-react";
import { 
  jobExperiences, 
  academicExperiences, 
  projects 
} from "@/constants";
import { formatDateRange } from "@/lib/dateFormatter";

const ACCENT = "#3d72cc";

const CARD = "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

// CV metadata
const resumeData = {
  name: "Lucas",
  title: "Full-stack Developer & Designer",
  location: "Rio de Janeiro, Brasil",
  summary:
    "Full-stack developer focused on building fast, well-crafted web and mobile applications. I care about clean APIs, great DX, and products that actually ship. Currently building Pingo — a mobile exam prep platform for Brazilian concursos.",
  contact: {
    github: "https://github.com/lucashdo",
    twitter: "https://twitter.com/lucashdo",
    email: "lucas@example.com",
    website: "lucashdo.com",
  },
  skills: [
    { group: "Languages", items: [
      { name: "TypeScript", color: "#3178c6", icon: <SiTypescript size={11} /> },
      { name: "Go", color: "#00add8", icon: <SiGo size={11} /> },
      { name: "Python", color: "#3572a5", icon: <SiPython size={11} /> },
    ]},
    { group: "Frontend", items: [
      { name: "React", color: "#61dafb", icon: <SiReact size={11} /> },
      { name: "Next.js", color: "#555", icon: <SiNextdotjs size={11} /> },
      { name: "Tailwind", color: "#38bdf8", icon: <SiTailwindcss size={11} /> },
      { name: "Expo", color: "#555", icon: <SiExpo size={11} /> },
    ]},
    { group: "Backend · DB", items: [
      { name: "Node.js", color: "#5fa04e", icon: <SiNodedotjs size={11} /> },
      { name: "PostgreSQL", color: "#4169e1", icon: <SiPostgresql size={11} /> },
      { name: "Redis", color: "#dc382d", icon: <SiRedis size={11} /> },
      { name: "Supabase", color: "#3ecf8e", icon: <SiSupabase size={11} /> },
    ]},
    { group: "Tools", items: [
      { name: "Docker", color: "#2496ed", icon: <SiDocker size={11} /> },
      { name: "Figma", color: "#a259ff", icon: <SiFigma size={11} /> },
    ]},
  ],
  languages: [
    { name: "Portuguese", level: "Native", pct: 100 },
    { name: "English", level: "Professional", pct: 82 },
  ],
};

export default function CV() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio-theme") === "dark"
      : false
  );

  const toggleDark = () => {
    setIsDark(d => {
      localStorage.setItem("portfolio-theme", !d ? "dark" : "light");
      return !d;
    });
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "dark bg-[#0a0a0a] text-white" : "bg-white text-gray-900"}`}>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-inside: avoid; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className={`no-print sticky top-0 z-50 h-14 flex items-center border-b ${isDark ? "bg-black/80 border-gray-800" : "bg-white/80 border-gray-200"} backdrop-blur-md`}>
        <div className="flex w-full max-w-5xl mx-auto px-6 sm:px-8 items-center justify-between">
          <Link href="/" className={`flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-60 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <FiArrowLeft size={14} />
            Voltar
          </Link>
          <span className="font-black text-base tracking-tight select-none">
            <span className={isDark ? "text-white" : "text-gray-900"}>lucas</span><span style={{ color: ACCENT }}>hdo</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-white hover:border-gray-600" : "text-gray-600 border-gray-300 hover:text-gray-900 hover:border-gray-400"}`}
            >
              <FiPrinter size={13} />
              <span>Imprimir</span>
            </button>
            <button
              onClick={toggleDark}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${isDark ? "text-gray-500 border-gray-700 hover:bg-gray-900" : "text-gray-600 border-gray-300 hover:bg-gray-100"}`}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-12 flex flex-col gap-8">

        {/* HERO CARD */}
        <motion.div {...fadeUp(0)} className={`${CARD} p-8 sm:p-10 flex items-start gap-6`}>
          <div
            className="w-24 h-24 rounded-3xl shrink-0 flex items-center justify-center text-4xl font-black text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #2563eb)` }}
          >
            L
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-2" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                  {resumeData.name}
                </h1>
                <p className={`text-lg font-semibold mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>{resumeData.title}</p>
                <div className={`flex items-center gap-1.5 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <FiMapPin size={14} />
                  <span>{resumeData.location}</span>
                </div>
              </div>
              <div
                className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap"
                style={{ color: ACCENT, borderColor: `${ACCENT}50`, backgroundColor: `${ACCENT}15` }}
              >
                ✓ Aberto para trabalho
              </div>
            </div>
            <div className={`flex flex-wrap gap-4 pt-4 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              {[
                { icon: <FiGithub size={13} />, label: "lucashdo", href: resumeData.contact.github },
                { icon: <FiTwitter size={13} />, label: "@lucashdo", href: resumeData.contact.twitter },
                { icon: <FiMail size={13} />, label: resumeData.contact.email, href: `mailto:${resumeData.contact.email}` },
                { icon: <FiExternalLink size={13} />, label: resumeData.contact.website, href: "https://lucashdo.com" },
              ].map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-70 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SUMMARY */}
        <motion.div {...fadeUp(0.04)} className={`${CARD} p-8 sm:p-10`}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>Sobre</h2>
          <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {resumeData.summary}
          </p>
        </motion.div>

        {/* THREE-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ── LEFT: SKILLS ── */}
          <motion.div {...fadeUp(0.08)} className={`${CARD} p-6 flex flex-col gap-4`}>
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Habilidades</h2>
            <div className="flex flex-col gap-4">
              {resumeData.skills.map(group => (
                <div key={group.group}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{group.group}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(item => (
                      <div key={item.name} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"} text-xs font-medium`}>
                        <span style={{ color: item.color }}>{item.icon}</span>
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── CENTER: EXPERIENCE ── */}
          <motion.div {...fadeUp(0.1)} className={`${CARD} p-6 flex flex-col gap-6 md:col-span-2`}>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: ACCENT }}>Experiência</h2>
              <div className="flex flex-col gap-6">
                {jobExperiences.filter(exp => exp.showInTimeline).map((job, i) => (
                  <div key={job.id} className={`${i > 0 ? `pt-6 border-t ${isDark ? "border-gray-800" : "border-gray-200"}` : ""}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{job.title}</h3>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{job.institution}</p>
                      </div>
                      {!job.endDate && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}
                        >
                          atual
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-2`}>
                      {formatDateRange(job.startDate, job.endDate)}
                    </p>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>{job.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* EDUCATION */}
            <div className={`pt-6 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>Educação</h2>
              <div className="flex flex-col gap-3">
                {academicExperiences.filter(ed => ed.showInTimeline).map((ed) => (
                  <div key={ed.id}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{ed.title}</h3>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{ed.institution}</p>
                      </div>
                      <span className={`text-xs shrink-0 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {formatDateRange(ed.startDate, ed.endDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: LANGUAGES & PROJECTS ── */}
          <motion.div {...fadeUp(0.12)} className="flex flex-col gap-6">
            {/* LANGUAGES */}
            <div className={`${CARD} p-6 flex flex-col gap-4`}>
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Idiomas</h2>
              <div className="flex flex-col gap-3">
                {resumeData.languages.map(lang => (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{lang.name}</span>
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>{lang.level}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.pct}%` }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED PROJECTS */}
            <div className={`${CARD} p-6 flex flex-col gap-3`}>
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Projetos</h2>
              <div className="flex flex-col gap-3">
                {projects.filter(p => p.featured).slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${isDark ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-xs font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{proj.name}</h4>
                      <a href={proj.url} target="_blank" rel="noreferrer" className={`shrink-0 transition-opacity hover:opacity-60 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        <FiExternalLink size={12} />
                      </a>
                    </div>
                    <p className={`text-xs leading-snug ${isDark ? "text-gray-400" : "text-gray-600"}`}>{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* FOOTER */}
        <div className={`text-center text-xs no-print py-6 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          Gerado a partir de <span style={{ color: ACCENT }} className="font-semibold">lucashdo.com</span>
        </div>

      </div>
    </div>
  );
}
