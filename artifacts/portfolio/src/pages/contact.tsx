import { motion } from "framer-motion";
import { Link } from "wouter";
import { Linkedin, Mail, Github, Instagram, ArrowUpRight, MessageCircleHeart } from "lucide-react";
import { useTranslation } from "react-i18next";
import SiteHeader from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { ContactLinks } from "@/constants";

const reveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

const contacts = [
  {
    label: "Email",
    value: ContactLinks.email,
    href: `mailto:${ContactLinks.email}`,
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "LucasHenriqueDiniz",
    href: ContactLinks.github,
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "lucas-diniz-ostroski",
    href: ContactLinks.linkedin,
    icon: Linkedin,
  },
  {
    label: "Instagram",
    value: "lucasdinizostroski",
    href: ContactLinks.instagram,
    icon: Instagram,
  },
];

export default function ContactPage() {
  const { isDark, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const isEn = currentLang === "en";

  return (
    <>
      <SEO title="Contato" description="Entre em contato com Lucas Diniz — disponível para colaborações, freelas e oportunidades." url="/contact" />
      <div className={`min-h-screen bg-canvas text-main transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="relative min-h-[100svh] w-full pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-canvas" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(224,122,95,0.16),transparent_38%),radial-gradient(circle_at_88%_14%,rgba(224,122,95,0.10),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(224,122,95,0.08),transparent_42%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-[980px] items-stretch px-4 pb-8 sm:px-6 sm:pb-10">
          <motion.section
            {...reveal}
            className="relative my-3 w-full overflow-hidden rounded-3xl border border-base bg-panel shadow-token-md"
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-subtle blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-brand-subtle blur-3xl" />

            <div className="relative grid h-full lg:grid-cols-[1.2fr_0.8fr]">
              <div className="flex min-h-[320px] flex-col justify-center p-6 sm:min-h-[420px] sm:p-9 lg:min-h-[500px] lg:p-11">
                <div className="w-fit">
                  <p className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand-subtle px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-brand">
                    <MessageCircleHeart size={13} /> {isEn ? "Contact" : "Contato"}
                  </p>
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  {isEn ? "Let's build something" : "Bora criar algo"}
                  <span className="block text-brand">{isEn ? "great together." : "muito bom juntos."}</span>
                </h1>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-sub sm:text-base">
                  {isEn
                    ? "Open to freelance, partnerships, digital products, community projects, or just saying hi. If you have an idea, let's talk."
                    : 'Aberto para freelance, parceria, produto digital, comunidade ou um simples "oi". Se voce tem ideia, me chama e vamos construir.'}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${ContactLinks.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-brand-hover hover:-translate-y-0.5"
                  >
                    <Mail size={15} /> {isEn ? "Send email" : "Enviar email"}
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-base bg-panel-hover px-5 py-2.5 text-sm font-bold text-sub transition-colors hover:text-main"
                  >
                    {isEn ? "Back to home" : "Voltar para home"}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-center border-t border-base bg-panel-hover/60 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-faint">{isEn ? "Channels" : "Canais"}</p>
                <div className="mt-4 space-y-2.5 lg:max-w-[320px]">
                  {contacts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.35 }}
                        className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-base bg-panel px-3.5 py-3 transition-all hover:border-hovered hover:bg-panel"
                      >
                        <span className="rounded-lg border border-brand/20 bg-brand/10 p-1.5 text-brand">
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-faint">{item.label}</p>
                          <p className="truncate text-[13px] font-semibold text-main">{item.value}</p>
                        </div>
                        <ArrowUpRight size={14} className="shrink-0 text-faint transition-all group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </motion.a>
                    );
                  })}
                </div>

                <p className="mt-4 text-[11px] text-sub">{isEn ? "Average reply: within 24h by email" : "Resposta media: em ate 24h por email"}</p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
    </>
  );
}
