import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiPrinter, FiGithub, FiTwitter, FiMail, FiExternalLink } from "react-icons/fi";
import { Moon, Sun } from "lucide-react";
import { jobExperiences, academicExperiences, projects } from "@/constants";
import { formatDateRange } from "@/lib/dateFormatter";

const ACCENT = "#3d72cc";
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

  const activeJobs = jobExperiences.filter(exp => exp.showInTimeline);
  const activeEducation = academicExperiences.filter(ed => ed.showInTimeline);
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

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
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <FiArrowLeft size={14} />
            Voltar
          </Link>
          <span className="font-black text-sm">
            <span className={isDark ? "text-white" : "text-gray-900"}>lucas</span>
            <span style={{ color: ACCENT }}>hdo</span>
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "text-gray-400 border-gray-700 hover:text-gray-200" : "text-gray-600 border-gray-300 hover:text-gray-900"}`}>
              <FiPrinter size={13} />
              <span>Imprimir</span>
            </button>
            <button onClick={toggleDark} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDark ? "text-gray-500 hover:bg-gray-900" : "text-gray-600 hover:bg-gray-100"}`}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* ── HEADER WITH PHOTO ── */}
        <motion.section {...fadeUp(0)} className="flex gap-8 items-start">
          {/* Photo */}
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

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h1 className="text-4xl font-black tracking-tight" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                Lucas Henrique Diniz
              </h1>
              <p className="text-lg font-semibold mt-1" style={{ color: ACCENT }}>
                Desenvolvedor Full Stack
              </p>
            </div>
            <p className={`text-sm leading-relaxed max-w-2xl ${isDark ? "text-gray-400" : "text-gray-700"}`}>
              Desenvolvedor focado em construir aplicações web rápidas, bem-projetadas e escaláveis. 
              Experiência com React, TypeScript, Node.js e infraestrutura cloud. 
              Atualmente desenvolvendo plataformas educacionais em React Native.
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
          </div>
        </motion.section>

        {/* ── EXPERIENCE ── */}
        <motion.section {...fadeUp(0.08)}>
          <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              EXPERIÊNCIA PROFISSIONAL
            </h2>
          </div>
          <div className="space-y-6">
            {activeJobs.map((job, i) => (
              <motion.div key={job.id} {...fadeUp(0.12 + i * 0.04)} className="flex gap-4">
                {/* Logo */}
                {logoMap[job.institution] && (
                  <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(243, 244, 246)" }}>
                    <img
                      src={logoMap[job.institution]}
                      alt={job.institution}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                )}

                {/* Content */}
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
                        Atual
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
        <motion.section {...fadeUp(0.16)}>
          <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              EDUCAÇÃO
            </h2>
          </div>
          <div className="space-y-5">
            {activeEducation.map((ed, i) => (
              <motion.div key={ed.id} {...fadeUp(0.20 + i * 0.04)} className="flex gap-4">
                {/* Logo */}
                {logoMap[ed.institution] && (
                  <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(243, 244, 246)" }}>
                    <img
                      src={logoMap[ed.institution]}
                      alt={ed.institution}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                )}

                {/* Content */}
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
        <motion.section {...fadeUp(0.24)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills */}
            <div>
              <div className="mb-4 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                  HABILIDADES
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Linguagens
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    TypeScript, Python, Go, JavaScript, SQL
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Frontend
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    React, Next.js, React Native, Expo, Tailwind CSS, Framer Motion
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Backend
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Node.js, PostgreSQL, Supabase, Redis, Docker, AWS, Firebase
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Ferramentas
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Git, GitHub, Figma, Vercel, VS Code
                  </p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="mb-4 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                  IDIOMAS
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Português</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>Nativo</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Inglês</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>Avançado</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>日本語 (Japonês)</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>N5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── FEATURED PROJECTS ── */}
        {featuredProjects.length > 0 && (
          <motion.section {...fadeUp(0.28)}>
            <div className="mb-6 pb-3 border-b" style={{ borderColor: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" }}>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                PROJETOS EM DESTAQUE
              </h2>
            </div>
            <div className="space-y-4">
              {featuredProjects.map((proj, i) => (
                <motion.div key={proj.id} {...fadeUp(0.32 + i * 0.04)}>
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

        {/* ── FOOTER ── */}
        <div className={`no-print text-center text-xs py-8 border-t ${isDark ? "border-gray-800 text-gray-600" : "border-gray-200 text-gray-500"}`}>
          <p>Gerado a partir de <span style={{ color: ACCENT }} className="font-semibold">lucashdo.com</span></p>
        </div>
      </div>
    </div>
  );
}
