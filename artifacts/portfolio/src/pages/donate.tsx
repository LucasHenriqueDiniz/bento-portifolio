import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import {
  FiArrowLeft,
  FiExternalLink,
  FiCoffee,
  FiCreditCard,
  FiSmartphone,
  FiHeart,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import SiteHeader from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import RotatingText from "@/components/RotatingText";
import { useTheme } from "@/hooks/useTheme";

interface DonateMethod {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  url: string;
  icon: typeof FiCoffee;
  color: string;
}

const methods: DonateMethod[] = [
  {
    id: "kofi",
    name: "Ko-fi",
    nameEn: "Ko-fi",
    description: "Apoie com um café virtual. Rápido, fácil e sem taxas.",
    descriptionEn: "Support with a virtual coffee. Quick, easy, and fee-free.",
    url: "https://ko-fi.com/lucashenriquediniz",
    icon: FiCoffee,
    color: "#FF5E5B",
  },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    nameEn: "Buy Me a Coffee",
    description: "Uma forma simples de apoiar meu trabalho mensalmente.",
    descriptionEn: "A simple way to support my work monthly.",
    url: "https://buymeacoffee.com/lucashenriquediniz",
    icon: FiCreditCard,
    color: "#FFAC04",
  },
  {
    id: "paypal",
    name: "PayPal",
    nameEn: "PayPal",
    description: "Doe via PayPal. Aceita cartões e saldo internacional.",
    descriptionEn: "Donate via PayPal. Accepts cards and international balance.",
    url: "https://www.paypal.com/donate/?hosted_button_id=QSRGBPBHH3XQU",
    icon: FiSmartphone,
    color: "#003087",
  },
];

const PIX_KEY = "lucas.diniz.hdo@gmail.com";

export default function DonatePage() {
  const { i18n } = useTranslation(["home", "common"]);
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const { isDark, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const forcedProject = useMemo(() => {
    if (typeof window === "undefined") return "";
    const value = new URLSearchParams(window.location.search).get("project") ?? "";
    return decodeURIComponent(value).replace(/["']/g, "").trim();
  }, []);

  const isLikelyBrazil = useMemo(() => {
    if (typeof window === "undefined") return true;
    const lang = (navigator.language || "").toLowerCase();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return lang.includes("pt-br") || timeZone.includes("America/Sao_Paulo");
  }, []);

  const rotatingProjectNames = useMemo(
    () => ["Heartopia Guide", "Weeb Profile", "Instagram Enhancer", "Mannco Enhancer", "Context Tools"],
    [],
  );

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bgClass = "bg-canvas text-main";
  const cardBg = "bg-panel border-base";
  const mutedText = "text-faint";
  const subtleText = "text-faint";
  const inputBg = "bg-field border-base text-sub";

  return (
    <>
      <SEO title="Doar" description="Apoie o trabalho de Lucas Diniz — doações via Pix, Ko-fi, Buy Me a Coffee e mais." url="/donate" />
      <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="relative max-w-[920px] mx-auto px-4 pt-24 pb-10">
        {/* Nav */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-6 left-4 md:left-0 z-10">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-[13px] transition-colors text-faint hover:text-main`}
          >
            <FiArrowLeft size={14} />
            <span>{currentLang === "en" ? "Back" : "Voltar"}</span>
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-subtle border border-brand/20 mb-6"
          >
            <FiHeart size={28} className="text-brand" />
          </motion.div>

          <h1 className="text-[clamp(2.1rem,5.7vw,3.8rem)] font-black tracking-tighter leading-[0.95] mb-4">
            {currentLang === "en" ? "Help" : "Ajude"}{" "}
            {forcedProject ? (
              <span className="inline-flex px-3 py-1 rounded-xl bg-brand text-black">{forcedProject}</span>
            ) : (
              <RotatingText
                texts={rotatingProjectNames}
                mainClassName="inline-flex px-3 py-1 rounded-xl bg-brand text-black align-middle"
                splitLevelClassName="overflow-hidden"
                staggerFrom="last"
                staggerDuration={0.02}
                rotationInterval={2200}
                transition={{ type: "spring", damping: 24, stiffness: 340 }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
              />
            )}{" "}
            <span>{currentLang === "en" ? "be alive" : "a continuar vivo"}</span>
          </h1>
          <p className={`text-[15px] max-w-md mx-auto leading-relaxed ${mutedText}`}>
            {currentLang === "en"
              ? "If you enjoy what I build, consider supporting. Every contribution helps me keep creating open-source tools and content."
              : "Se você curte o que eu construo, considere apoiar. Cada contribuição me ajuda a continuar criando ferramentas e conteúdo open-source."}
          </p>
        </motion.div>

        {/* Methods */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {methods.map((method, i) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className={`h-full rounded-2xl border p-5 flex flex-col shadow-[0_10px_32px_rgba(0,0,0,0.08)] ${cardBg}`}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${method.color}15` }}
                >
                  <method.icon size={22} style={{ color: method.color }} />
                </div>

                <h3 className="text-[15px] font-bold mb-1">
                  {currentLang === "en" ? method.nameEn : method.name}
                </h3>
                <p className={`text-[12px] leading-relaxed flex-1 mb-4 ${mutedText}`}>
                  {currentLang === "en" ? method.descriptionEn : method.description}
                </p>

                <a
                  href={method.url}
                  target="_blank"
                  rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                    style={{ backgroundColor: method.color }}
                  >
                  <span>{currentLang === "en" ? "Donate" : "Doar"}</span>
                  <FiExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pix */}
        {isLikelyBrazil && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="rounded-2xl border-2 border-brand/40 p-6 bg-gradient-to-br from-brand/20 via-brand/10 to-transparent shadow-[0_0_40px_rgba(84,178,255,0.16)]">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
                  <FiSmartphone size={36} className="text-brand" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-[20px] font-black mb-1">PIX</h3>
                  <p className={`text-[13px] mb-3 ${mutedText}`}>
                    {currentLang === "en"
                      ? "Fast, no-fee support for Brazil. Copy and pay in seconds."
                      : "Apoio mais rápido e sem taxas no Brasil. Copie e pague em segundos."}
                  </p>

                  <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                    <code className={`px-3 py-1.5 rounded-lg font-mono text-[12px] ${inputBg}`}>
                      {PIX_KEY}
                    </code>
                    <button
                      onClick={copyPix}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-black text-[11px] font-black hover:brightness-110 transition-colors"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1"
                          >
                            <FiCheck size={12} />
                            {currentLang === "en" ? "Copied" : "Copiado"}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1"
                          >
                            <FiCopy size={12} />
                            {currentLang === "en" ? "Copy PIX key" : "Copiar chave PIX"}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-center text-[11px] uppercase tracking-widest ${subtleText}`}
        >
          {currentLang === "en"
            ? "Every contribution means the world"
            : "Cada contribuição faz toda a diferença"}{" "}
          <FiHeart size={10} className="inline text-brand" />
        </motion.p>
      </div>
    </div>
    </>
  );
}
