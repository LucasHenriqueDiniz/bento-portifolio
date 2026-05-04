import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Masonry, { type MasonryItem } from "@/components/Masonry";
import TextPressure from "@/components/TextPressure";
import { useTheme } from "@/hooks/useTheme";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const rawItems: MasonryItem[] = [
  { id: "baloon-rust", title: "Baloon Rust", img: "/gallery/baloon-rust.webp", url: "/gallery/baloon-rust.webp", height: 720 },
  { id: "bully", title: "Bully", img: "/gallery/bully.webp", url: "/gallery/bully.webp", height: 940 },
  { id: "caveira-feiosa", title: "Caveira Feiosa", img: "/gallery/caveira-feiosa.webp", url: "/gallery/caveira-feiosa.webp", height: 960 },
  { id: "chu-e-elvy", title: "Chu e Elvy", img: "/gallery/chu-e-elvy.webp", url: "/gallery/chu-e-elvy.webp", height: 760 },
  { id: "girl-nh288888", title: "Girl NH", img: "/gallery/girl-nh288888.webp", url: "/gallery/girl-nh288888.webp", height: 1120 },
  { id: "hayato-shogi-pfp", title: "Hayato Shogi", img: "/gallery/hayato-shogi-pfp.webp", url: "/gallery/hayato-shogi-pfp.webp", height: 720 },
  { id: "lili-fullbody", title: "Lili Fullbody", img: "/gallery/lili-fullbody.webp", url: "/gallery/lili-fullbody.webp", height: 1080 },
  { id: "lili-bed", title: "Lili Bed", img: "/gallery/lili_bed.webp", url: "/gallery/lili_bed.webp", height: 920 },
  { id: "neko", title: "Neko", img: "/gallery/neko.webp", url: "/gallery/neko.webp", height: 940 },
  { id: "noda-sketch", title: "Noda Sketch", img: "/gallery/noda-sketch.webp", url: "/gallery/noda-sketch.webp", height: 760 },
  { id: "one-punch-man", title: "One Punch Man", img: "/gallery/one-punch-man.webp", url: "/gallery/one-punch-man.webp", height: 900 },
  { id: "pingo-angry", title: "Pingo Angry", img: "/gallery/pingo-angry.webp", url: "/gallery/pingo-angry.webp", height: 720 },
  { id: "pingo-bored", title: "Pingo Bored", img: "/gallery/pingo-bored.webp", url: "/gallery/pingo-bored.webp", height: 720 },
  { id: "pingo-concursos-icons", title: "Pingo Concursos Icons", img: "/gallery/pingo-concursos-icons.webp", url: "/gallery/pingo-concursos-icons.webp", height: 720 },
  { id: "pingo-crying", title: "Pingo Crying", img: "/gallery/pingo-crying.webp", url: "/gallery/pingo-crying.webp", height: 720 },
  { id: "pingo-happy", title: "Pingo Happy", img: "/gallery/pingo-happy.webp", url: "/gallery/pingo-happy.webp", height: 720 },
  { id: "redhair-rainjacket", title: "Redhair Rainjacket", img: "/gallery/redhair-rainjacket.png", url: "/gallery/redhair-rainjacket.png", height: 1040 },
  { id: "snake-babe", title: "Snake Babe", img: "/gallery/snake-babe.webp", url: "/gallery/snake-babe.webp", height: 980 },
  { id: "talos-chan-concept-art", title: "Talos-chan", img: "/gallery/talos-chan-concept-art.webp", url: "/gallery/talos-chan-concept-art.webp", height: 920 },
  { id: "tomoko-okboomer", title: "Tomoko", img: "/gallery/tomoko-okboomer.webp", url: "/gallery/tomoko-okboomer.webp", height: 860 },
  { id: "twitch-badges", title: "Twitch Badges", img: "/gallery/twitch-badges.webp", url: "/gallery/twitch-badges.webp", height: 720 },
  { id: "vanessa", title: "Vanessa", img: "/gallery/vanessa.webp", url: "/gallery/vanessa.webp", height: 1100 },
  { id: "weeb-profile-old-logo", title: "Weeb Profile Old Logo", img: "/gallery/weeb-profile-old-logo.webp", url: "/gallery/weeb-profile-old-logo.webp", height: 720 },
  { id: "wip-galinheiro", title: "WIP Galinheiro", img: "/gallery/WiP-galinheiro.webp", url: "/gallery/WiP-galinheiro.webp", height: 720 },
  { id: "wip-lost-past", title: "WIP Lost Past", img: "/gallery/wip-lost-past.webp", url: "/gallery/wip-lost-past.webp", height: 900 },
  { id: "wip-school-entrance-background", title: "WIP School Entrance", img: "/gallery/wip-school-entrance-background.webp", url: "/gallery/wip-school-entrance-background.webp", height: 730 },
  { id: "animated-beach", title: "Animated Beach", img: "/gallery/animated-beach.mp4", url: "/gallery/animated-beach.mp4", height: 760, mediaType: "video" },
  { id: "siot-login-animation", title: "SIOT Login Animation", img: "/gallery/siot-login-animation.mp4", url: "/gallery/siot-login-animation.mp4", height: 760, mediaType: "video" },
  { id: "vn-night-idle-simple", title: "VN Night Idle", img: "/gallery/vn-night-idle-simple.mp4", url: "/gallery/vn-night-idle-simple.mp4", height: 760, mediaType: "video" },
  { id: "nsfw-vn-night-scene", title: "VN Night Scene", img: "/gallery/NSFW-vn-night-scene.mp4", url: "/gallery/NSFW-vn-night-scene.mp4", height: 760, mediaType: "video", nsfw: true },
  { id: "nsfw-bath-redhair-lady", title: "Bath Redhair Lady", img: "/gallery/bath-redhair-lady.webp", url: "/gallery/bath-redhair-lady.webp", height: 980, nsfw: true },
  { id: "nsfw-rem", title: "Rem", img: "/gallery/NSFW-rem.webp", url: "/gallery/NSFW-rem.webp", height: 980, nsfw: true },
];

const artYears: Record<string, string> = {
  "baloon-rust": "2021",
  "bully": "2022",
  "caveira-feiosa": "2020",
  "chu-e-elvy": "2023",
  "girl-nh288888": "2023",
  "hayato-shogi-pfp": "2020",
  "neko": "2021",
  "one-punch-man": "2021",
  "noda-sketch": "2021",
  "pingo-angry": "2022",
  "pingo-bored": "2022",
  "pingo-concursos-icons": "2022",
  "pingo-crying": "2022",
  "pingo-happy": "2022",
  "redhair-rainjacket": "2024",
  "tomoko-okboomer": "2023",
  "snake-babe": "2023",
  "wip-galinheiro": "2022",
  "wip-school-entrance-background": "2022",
  "wip-lost-past": "2021",
  "vanessa": "2023",
  "animated-beach": "2024",
  "vn-night-idle-simple": "2024",
  "nsfw-rem": "2024",
  "siot-login-animation": "2025",
};

export default function GalleryPage() {
  const { t } = useTranslation("gallery");
  const { isDark, toggleTheme } = useTheme();
  const [activeItem, setActiveItem] = useState<MasonryItem | null>(null);
  const [pendingNsfwItem, setPendingNsfwItem] = useState<MasonryItem | null>(null);
  const [skipNsfwWarning, setSkipNsfwWarning] = useState<boolean>(() => sessionStorage.getItem("gallery_skip_nsfw_warning") === "1");

  const items = useMemo(() => rawItems.map((item) => ({ ...item, year: artYears[item.id] ?? "2022" })), []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
        setPendingNsfwItem(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openItem = (item: MasonryItem) => {
    if (item.nsfw && !skipNsfwWarning) {
      setPendingNsfwItem(item);
      return;
    }
    setActiveItem(item);
  };

  return (
    <div className={`min-h-screen w-full pt-14 bg-canvas text-main transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 py-8 sm:py-10 relative">
        <div className="pointer-events-none absolute -top-12 -right-14 w-56 h-56 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-14 w-56 h-56 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="mb-6 sm:mb-8 relative z-10">
          <div className="mt-1 min-h-[90px] sm:min-h-[120px] lg:min-h-[136px] h-auto">
            <TextPressure
              text={t("title")}
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor={isDark ? "#f4efe8" : "#22170f"}
              minFontSize={36}
            />
          </div>
          <div className="mt-3 flex items-center gap-3" aria-hidden>
            <div className="h-px flex-1" style={{ backgroundColor: "color-mix(in srgb, var(--border-base) 75%, transparent)" }} />
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <div className="h-px flex-1" style={{ backgroundColor: "color-mix(in srgb, var(--border-base) 75%, transparent)" }} />
          </div>
        </div>

        <div className="relative z-10 rounded-2xl border border-base bg-panel/90 backdrop-blur-sm p-3 sm:p-4 overflow-hidden">
          <Masonry
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.07}
            animateFrom="right"
            scaleOnHover
            hoverScale={0.965}
            blurToFocus
            colorShiftOnHover={false}
            onItemClick={openItem}
            nsfwLabel={t("nsfwOverlay")}
          />
        </div>
      </div>

      <AlertDialog open={Boolean(pendingNsfwItem)} onOpenChange={(open) => !open && setPendingNsfwItem(null)}>
        <AlertDialogContent className="border-base bg-panel text-main">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("nsfwWarning.title")}</AlertDialogTitle>
            <AlertDialogDescription className="text-sub">{t("nsfwWarning.description")}</AlertDialogDescription>
          </AlertDialogHeader>

          <label className="flex items-center gap-2 text-[13px] text-sub">
            <input
              type="checkbox"
              checked={skipNsfwWarning}
              onChange={(e) => {
                const nextValue = e.target.checked;
                setSkipNsfwWarning(nextValue);
                sessionStorage.setItem("gallery_skip_nsfw_warning", nextValue ? "1" : "0");
              }}
              className="accent-[var(--accent)]"
            />
            {t("nsfwWarning.remember")}
          </label>

          <AlertDialogFooter>
            <AlertDialogCancel>{t("nsfwWarning.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingNsfwItem) setActiveItem(pendingNsfwItem);
                setPendingNsfwItem(null);
              }}
            >
              {t("nsfwWarning.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {activeItem && (
        <div
          className="fixed inset-0 z-[70] bg-black/92 p-4 sm:p-8 flex items-center justify-center"
          onClick={() => setActiveItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full border border-white/20 bg-black/50 text-white/90 hover:text-white"
            aria-label={t("viewer.close")}
          >
            <X className="mx-auto" size={18} />
          </button>

          <div
            className="relative max-h-[86vh] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {activeItem.mediaType === "video" ? (
              <video
                src={activeItem.img}
                className="max-h-[86vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img src={activeItem.img} alt={activeItem.title ?? activeItem.id} className="max-h-[86vh] max-w-[92vw] object-contain rounded-xl shadow-2xl" />
            )}
            <a
              href={activeItem.url}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/55 px-3 py-2 text-[12px] font-semibold text-white/90 hover:text-white"
            >
              <ExternalLink size={14} />
              {t("viewer.openOriginal")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
