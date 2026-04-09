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

const ACCENT = "#3d72cc";

const CARD = "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

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
  experience: [
    {
      role: "Full-stack Developer",
      company: "Freelance / Self-employed",
      period: "2022 – present",
      current: true,
      bullets: [
        "Developing Pingo Concursos — a React Native + Expo mobile platform with Supabase backend, real-time sync, and offline-first architecture",
        "Built and maintained Go REST APIs with PostgreSQL + Redis caching serving production traffic",
        "Designed and shipped lucashdo.com — bento-style portfolio with live Discord, Last.fm, GitHub, and Steam integrations",
      ],
    },
    {
      role: "Frontend Developer",
      company: "Agency / Client Work",
      period: "2020 – 2022",
      current: false,
      bullets: [
        "Delivered responsive React and Next.js applications for e-commerce and SaaS clients",
        "Translated Figma designs into pixel-perfect, accessible UI components",
        "Improved Core Web Vitals scores and page performance on key client properties",
      ],
    },
  ],
  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "Universidade Federal",
      period: "2019 – 2023",
    },
  ],
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
  projects: [
    {
      name: "lucashdo.com",
      description: "Bento-style portfolio with live integrations (Discord, Last.fm, GitHub, WakaTime, Steam, MAL)",
      stars: 42,
      lang: "TypeScript",
      langColor: "#3d72cc",
      url: "https://lucashdo.com",
    },
    {
      name: "pingo-api",
      description: "REST + WebSocket backend for the concursos mobile platform — Go, PostgreSQL, Redis",
      stars: 24,
      lang: "Go",
      langColor: "#00add8",
      url: "#",
    },
    {
      name: "animelist-tracker",
      description: "MyAnimeList API wrapper with caching and webhook support",
      stars: 18,
      lang: "Go",
      langColor: "#00add8",
      url: "#",
    },
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
    <div className={`min-h-screen font-sans transition-colors duration-300${isDark ? " dark bg-[#0d0d0d] text-[#eee]" : " bg-[#f5f5f5] text-[#111]"}`}>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-inside: avoid; }
          body { background: white !important; color: black !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className="no-print shrink-0 z-50 h-11 flex items-center border-b border-[#ebebeb] dark:border-[#282828] bg-white/80 dark:bg-[#181818]/80 backdrop-blur sticky top-0">
        <div className="flex w-full max-w-[920px] mx-auto px-4 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-[13px] text-[#888] dark:text-[#555] hover:text-[#111] dark:hover:text-[#eee] transition-colors">
            <FiArrowLeft size={13} />
            Back
          </Link>
          <span className="font-bold text-[15px] tracking-tight select-none">
            <span className="text-[#2d3748] dark:text-[#e2e8f0]">lucas</span><span style={{ color: ACCENT }}>hdo</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-[12px] text-[#666] dark:text-[#888] hover:text-[#111] dark:hover:text-[#eee] transition-colors px-3 py-1.5 rounded-lg border border-[#e0e0e0] dark:border-[#282828] bg-white dark:bg-[#222]"
            >
              <FiPrinter size={12} />
              <span>Print</span>
            </button>
            <button
              onClick={toggleDark}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#ebebeb] dark:border-[#282828] bg-white dark:bg-[#222] hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors text-[#888] dark:text-[#666]"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="max-w-[920px] mx-auto px-4 py-6 flex flex-col gap-4">

        {/* HERO CARD */}
        <motion.div {...fadeUp(0)} className={`${CARD} p-6 flex items-start gap-5`}>
          <div
            className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-[26px] font-black text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #6a9fd8)` }}
          >
            L
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-black leading-none text-[#111] dark:text-[#eee]">{resumeData.name}</h1>
                <p className="text-[14px] text-[#888] dark:text-[#555] mt-0.5">{resumeData.title}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-[#bbb] dark:text-[#444]">
                  <FiMapPin size={10} />
                  <span>{resumeData.location}</span>
                </div>
              </div>
              <div
                className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                style={{ color: ACCENT, borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}0f` }}
              >
                Open to work
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {[
                { icon: <FiGithub size={11} />, label: "lucashdo", href: resumeData.contact.github },
                { icon: <FiTwitter size={11} />, label: "@lucashdo", href: resumeData.contact.twitter },
                { icon: <FiMail size={11} />, label: resumeData.contact.email, href: `mailto:${resumeData.contact.email}` },
                { icon: <FiExternalLink size={11} />, label: resumeData.contact.website, href: "https://lucashdo.com" },
              ].map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-[#999] dark:text-[#555] hover:text-[#111] dark:hover:text-[#eee] transition-colors"
                >
                  {c.icon}
                  <span>{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* TWO-COLUMN */}
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <div className="flex flex-col gap-4">

            {/* SKILLS */}
            <motion.div {...fadeUp(0.08)} className={`${CARD} p-4 flex flex-col gap-3`}>
              <SectionLabel>Skills</SectionLabel>
              <div className="flex flex-col gap-3">
                {resumeData.skills.map(group => (
                  <div key={group.group}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#ccc] dark:text-[#444] mb-1.5">{group.group}</p>
                    <div className="flex flex-col gap-1">
                      {group.items.map(item => (
                        <div key={item.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#f0f0f0] dark:border-[#282828]">
                          <span style={{ color: item.color }}>{item.icon}</span>
                          <span className="text-[11px] font-medium text-[#555] dark:text-[#999]">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* LANGUAGES */}
            <motion.div {...fadeUp(0.12)} className={`${CARD} p-4 flex flex-col gap-3`}>
              <SectionLabel>Languages</SectionLabel>
              <div className="flex flex-col gap-3">
                {resumeData.languages.map(lang => (
                  <div key={lang.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#555] dark:text-[#999]">{lang.name}</span>
                      <span className="text-[10px] text-[#bbb] dark:text-[#555]">{lang.level}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-[#f0f0f0] dark:bg-[#282828]">
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
            </motion.div>

          </div>

          {/* ── RIGHT MAIN ── */}
          <div className="flex flex-col gap-4">

            {/* ABOUT */}
            <motion.div {...fadeUp(0.04)} className={`${CARD} p-5`}>
              <SectionLabel>About</SectionLabel>
              <p className="text-[13px] text-[#777] dark:text-[#555] leading-relaxed mt-2">
                {resumeData.summary}
              </p>
            </motion.div>

            {/* EXPERIENCE */}
            <motion.div {...fadeUp(0.1)} className={`${CARD} p-5 flex flex-col gap-5`}>
              <SectionLabel>Experience</SectionLabel>
              {resumeData.experience.map((job, i) => (
                <div key={i} className={`flex gap-4 print-break ${i > 0 ? "pt-5 border-t border-[#f0f0f0] dark:border-[#282828]" : ""}`}>
                  {/* timeline dot */}
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: job.current ? ACCENT : "#ddd" }}
                    />
                    {i < resumeData.experience.length - 1 && (
                      <div className="w-px flex-1 mt-1.5 bg-[#ebebeb] dark:bg-[#282828]" />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-[14px] font-bold text-[#111] dark:text-[#eee] leading-tight">{job.role}</h3>
                        <p className="text-[12px] text-[#888] dark:text-[#555] mt-0.5">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {job.current && (
                          <span
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ color: ACCENT, backgroundColor: `${ACCENT}12` }}
                          >
                            current
                          </span>
                        )}
                        <span className="text-[11px] text-[#bbb] dark:text-[#444] tabular-nums">{job.period}</span>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-[12px] text-[#777] dark:text-[#555] leading-snug">
                          <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[#ddd] dark:bg-[#444]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* EDUCATION */}
            <motion.div {...fadeUp(0.14)} className={`${CARD} p-5 flex flex-col gap-3`}>
              <SectionLabel>Education</SectionLabel>
              {resumeData.education.map((ed, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#111] dark:text-[#eee]">{ed.degree}</h3>
                    <p className="text-[12px] text-[#888] dark:text-[#555]">{ed.institution}</p>
                  </div>
                  <span className="text-[11px] text-[#bbb] dark:text-[#444] tabular-nums shrink-0">{ed.period}</span>
                </div>
              ))}
            </motion.div>

            {/* FEATURED PROJECTS */}
            <motion.div {...fadeUp(0.18)} className={`${CARD} p-5 flex flex-col gap-3`}>
              <SectionLabel>Featured Projects</SectionLabel>
              <div className="flex flex-col gap-2.5">
                {resumeData.projects.map((proj) => (
                  <div
                    key={proj.name}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl border border-[#f0f0f0] dark:border-[#282828] bg-[#fafafa] dark:bg-[#111]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[13px] font-bold text-[#111] dark:text-[#eee]">{proj.name}</h4>
                        <div className="flex items-center gap-0.5 text-[#bbb] dark:text-[#444]">
                          <FiStar size={10} />
                          <span className="text-[10px] tabular-nums">{proj.stars}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#888] dark:text-[#555] leading-snug">{proj.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: proj.langColor }} />
                        <span className="text-[10px] text-[#999] dark:text-[#555]">{proj.lang}</span>
                      </div>
                      <a href={proj.url} target="_blank" rel="noreferrer" className="text-[#ccc] dark:text-[#444] hover:text-[#888] transition-colors">
                        <FiExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="no-print text-center text-[11px] text-[#ccc] dark:text-[#333] pb-4">
          Generated from <span style={{ color: ACCENT }}>lucashdo.com</span>
        </div>

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-widest text-[#bbb] dark:text-[#444]">{children}</p>
  );
}
