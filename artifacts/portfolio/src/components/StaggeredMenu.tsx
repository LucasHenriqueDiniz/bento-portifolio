import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
}

export default function StaggeredMenu({
  position = "right",
  colors = ["#E07A5F", "#C96A50"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  logoUrl = "/favicon-96x96.png",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#111",
  accentColor = "#E07A5F",
  isFixed = true,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const layers = preLayersRef.current ? Array.from(preLayersRef.current.querySelectorAll(".sm-prelayer")) : [];
    if (!panel) return;
    const offscreen = position === "left" ? -100 : 100;
    gsap.set([panel, ...layers], { xPercent: offscreen });
    if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
  }, [position, menuButtonColor]);

  const animate = useCallback(
    (opening: boolean) => {
      const panel = panelRef.current;
      if (!panel) return;
      const layers = preLayersRef.current ? Array.from(preLayersRef.current.querySelectorAll(".sm-prelayer")) : [];
      const offscreen = position === "left" ? -100 : 100;

      if (opening) {
        layers.forEach((layer, i) => {
          gsap.to(layer, { xPercent: 0, duration: 0.42, delay: i * 0.06, ease: "power4.out" });
        });
        gsap.to(panel, { xPercent: 0, duration: 0.52, delay: 0.1, ease: "power4.out" });
      } else {
        gsap.to([panel, ...layers], { xPercent: offscreen, duration: 0.28, ease: "power3.in" });
      }

      if (iconRef.current && plusHRef.current && plusVRef.current) {
        if (opening) {
          gsap.to(plusHRef.current, { rotate: 45, duration: 0.36, ease: "power3.out" });
          gsap.to(plusVRef.current, { rotate: -45, duration: 0.36, ease: "power3.out" });
        } else {
          gsap.to(plusHRef.current, { rotate: 0, duration: 0.28, ease: "power3.out" });
          gsap.to(plusVRef.current, { rotate: 90, duration: 0.28, ease: "power3.out" });
        }
      }

      if (toggleBtnRef.current) {
        gsap.to(toggleBtnRef.current, {
          color: opening ? openMenuButtonColor : menuButtonColor,
          duration: 0.22,
          ease: "power2.out",
        });
      }
    },
    [menuButtonColor, openMenuButtonColor, position],
  );

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      animate(next);
      return next;
    });
  }, [animate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        animate(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, animate]);

  return (
    <div className={isFixed ? "fixed inset-0 z-50 pointer-events-none" : "relative h-full w-full pointer-events-none"}>
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-14 flex items-center justify-end px-4 z-20">
        <button
          ref={toggleBtnRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggle}
          className="pointer-events-auto inline-flex items-center gap-2 text-sm font-semibold"
        >
          {open ? "Close" : "Menu"}
          <span ref={iconRef} className="relative w-3.5 h-3.5 inline-flex items-center justify-center">
            <span ref={plusHRef} className="absolute w-full h-[2px] bg-current" />
            <span ref={plusVRef} className="absolute w-full h-[2px] bg-current rotate-90" />
          </span>
        </button>
      </div>

      {open && <button className="absolute inset-0 bg-black/35 backdrop-blur-sm pointer-events-auto" onClick={toggle} aria-label="Close menu overlay" />}

      <div ref={preLayersRef} className="absolute top-0 bottom-0 right-0 w-full max-w-[420px] pointer-events-none z-[5]">
        {colors.slice(0, 2).map((c, i) => (
          <div key={i} className="sm-prelayer absolute inset-0" style={{ background: c }} />
        ))}
      </div>

      <aside
        ref={panelRef}
        className="absolute top-0 bottom-0 right-0 w-full max-w-[420px] bg-white text-black p-6 pt-20 z-10 pointer-events-auto overflow-y-auto"
        style={{ ["--sm-accent" as string]: accentColor } as React.CSSProperties}
      >
        <img src={logoUrl} alt="Logo" className="h-7 w-7 mb-8" />

        <ul className="space-y-2" data-numbering={displayItemNumbering || undefined}>
          {items.map((it, idx) => (
            <li key={it.link} className="relative">
              <Link
                href={it.link}
                onClick={() => {
                  setOpen(false);
                  animate(false);
                }}
                className="block text-5xl font-black tracking-tight uppercase hover:text-[var(--sm-accent)] transition-colors"
                aria-label={it.ariaLabel}
              >
                {it.label}
              </Link>
              {displayItemNumbering && <span className="absolute right-0 top-1 text-xs text-[var(--sm-accent)]">{String(idx + 1).padStart(2, "0")}</span>}
            </li>
          ))}
        </ul>

        {displaySocials && socialItems.length > 0 && (
          <div className="mt-10">
            <p className="text-sm font-semibold text-[var(--sm-accent)] mb-3">Socials</p>
            <div className="flex gap-4 flex-wrap">
              {socialItems.map((s) => (
                <a key={s.label} href={s.link} target="_blank" rel="noreferrer" className="text-base hover:text-[var(--sm-accent)] transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
