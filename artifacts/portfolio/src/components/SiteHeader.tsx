import { Link, useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import StaggeredMenu from "@/components/StaggeredMenu";
import { ContactLinks } from "@/constants";

interface SiteHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
];

export default function SiteHeader({ isDark, onToggleTheme }: SiteHeaderProps) {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-base bg-header/95 backdrop-blur-xl px-4 sm:px-6">
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-panel/70">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-base bg-panel shadow-sm overflow-hidden">
            <img src="/favicon.svg" alt="Site icon" className="h-5 w-5 object-contain" />
          </span>
          <span className="font-bold text-[15px] tracking-tight text-main">
            lucas<span className="text-brand">hdo</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 rounded-2xl border border-base bg-panel/75 px-1.5 py-1 shadow-sm">
          {links.map((item) => {
            const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-xl border transition-all ${
                  active
                    ? "text-main border-base bg-canvas shadow-sm"
                    : "text-faint border-transparent hover:text-main hover:border-base/70 hover:bg-panel"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-base bg-panel/75 px-1.5 py-1 shadow-sm">
          <LanguageSwitcher isDark={isDark} />
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-base bg-panel text-faint transition-colors hover:text-main hover:bg-panel-hover"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher isDark={isDark} />
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-base bg-panel text-faint transition-colors hover:text-main hover:bg-panel-hover"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <StaggeredMenu
            isFixed
            items={links.map((l) => ({ label: l.label, ariaLabel: `Go to ${l.label}`, link: l.href }))}
            socialItems={[
              { label: "GitHub", link: ContactLinks.github },
              { label: "LinkedIn", link: ContactLinks.linkedin },
              { label: "Instagram", link: ContactLinks.instagram },
            ]}
            displaySocials
            displayItemNumbering
            menuButtonColor={isDark ? "#eaeaea" : "#1b1b1b"}
            openMenuButtonColor="#1b1b1b"
            colors={["#F2E9E2", "#D8C8B9"]}
            accentColor="#E07A5F"
          />
        </div>
      </div>
    </header>
  );
}
