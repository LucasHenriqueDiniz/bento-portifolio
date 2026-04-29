import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiPrinter, FiGithub, FiTwitter, FiMail, FiExternalLink, FiDownload } from "react-icons/fi";
import { Moon, Sun, Globe } from "lucide-react";
import { useResumeTranslation, getAvailableLocales, getLocaleDisplayName } from "@/hooks/useResumeTranslation";

const ACCENT = "#3d72cc";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function ResumePage() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("portfolio-theme") === "dark"
      : false
  );
  const [locale, setLocale] = useState<"en" | "pt-BR">(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("resume-locale") as "en" | "pt-BR") || "en"
      : "en"
  );

  const t = useResumeTranslation(locale);
  const availableLocales = getAvailableLocales();

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
      <header className={`no-print sticky top-0 z-50 h-14 border-b ${isDark ? "bg-black/95 border-gray-800" : "bg-white border-gray-200"} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <FiArrowLeft size={14} />
            {locale === "en" ? "Back" : "Voltar"}
          </Link>
          <span className="font-black text-sm">
            <span className={isDark ? "text-white" : "text-gray-900"}>lucas</span>
            <span style={{ color: ACCENT }}>hdo</span>
          </span>
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

      {/* ── MAIN CONTENT ── */}
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

          {/* Contact Links */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <a href="mailto:lucas.diniz@email.com" className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiMail size={14} />
              lucas.diniz@email.com
            </a>
            <a href="https://github.com/lucashdo" target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 font-medium hover:opacity-70 transition-opacity ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <FiGithub size={14} />
              github.com/lucashdo
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
        <motion.section {...fadeUp(0.45)}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
            {t.education.title}
          </h2>
          <div className="space-y-4">
            {Object.values(t.education.degrees).map((degree: any, i: number) => (
              <motion.div key={i} {...fadeUp(0.47 + i * 0.02)}>
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
        <motion.section {...fadeUp(0.51)}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
            {t.certifications.title}
          </h2>
          <ul className={`text-sm space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {Object.values(t.certifications.certs).map((cert: string, i: number) => (
              <motion.li key={i} {...fadeUp(0.53 + i * 0.02)} className="flex gap-2">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{cert}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* ── FOOTER ── */}
        <div className={`no-print text-center text-xs py-8 border-t ${isDark ? "border-gray-800 text-gray-600" : "border-gray-200 text-gray-500"}`}>
          <p>
            {locale === "en" ? "Generated from" : "Gerado a partir de"} <span style={{ color: ACCENT }} className="font-semibold">lucashdo.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
