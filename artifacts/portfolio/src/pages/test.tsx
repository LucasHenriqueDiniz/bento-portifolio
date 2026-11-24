import { useQuery } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import { CardGlowProvider } from "@/components/CardGlowContext";
import { useTheme } from "@/hooks/useTheme";
import { useGetLastWorkoutCached } from "@/hooks/usePortfolioQueries";
import { getWowCharacter } from "@/lib/apiClient";
import { WorkoutCard } from "@/components/home";
import { TechStackCard } from "@/components/home";
import { WorkoutCardV2 } from "@/components/test/WorkoutCardV2";
import { WowCard } from "@/components/test/WowCard";
import { WOW_SAMPLE } from "@/components/test/wowSample";

// The cells these cards occupy on the home grid at 1440x900, so a redesign is judged at
// the size it will really have.
const ONE_COLUMN = { width: 232, height: 201 };
const TWO_COLUMNS = { width: 469, height: 201 };

function Frame({ label, size, children }: { label: string; size: { width: number; height: number }; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col gap-2 w-full" style={{ maxWidth: size.width }}>
      <figcaption className="text-[10px] font-semibold uppercase tracking-widest text-faint">{label}</figcaption>
      <div style={{ height: size.height }} className="w-full">
        {children}
      </div>
    </figure>
  );
}

/** Sandbox for card redesigns: each new card beside the one it would replace. */
export default function TestPage() {
  const { isDark, toggleTheme } = useTheme();
  const { data: workout, isLoading: loadingWorkout } = useGetLastWorkoutCached();
  const wow = useQuery({ queryKey: ["/api/portfolio/wow"], queryFn: ({ signal }) => getWowCharacter({ signal }) });
  const live = wow.data?.character ?? null;

  return (
    <>
      <SEO title="Test" noindex />
      <div className={`min-h-screen bg-canvas text-main pt-14 transition-colors duration-300 ${isDark ? "dark" : ""}`}>
        <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />
        <CardGlowProvider>
          <main className="mx-auto max-w-5xl px-4 py-8 space-y-10">
            <section className="space-y-3">
              <h1 className="text-lg font-black tracking-tight">Card sandbox</h1>
              <p className="text-[12px] text-sub max-w-xl">
                Redesigns at the size of their cell on the home grid. Left is the proposal, right is what is live today.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-sub">Workout</h2>
              <div className="flex flex-wrap gap-6">
                <Frame label="new" size={ONE_COLUMN}>
                  <WorkoutCardV2 workout={workout} />
                </Frame>
                <Frame label="current" size={ONE_COLUMN}>
                  <WorkoutCard workout={workout as never} isLoading={loadingWorkout} isDark={isDark} />
                </Frame>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-sub">WoW, in the Tech Stack cell</h2>
              <div className="flex flex-wrap gap-6">
                <Frame label="new" size={TWO_COLUMNS}>
                  <WowCard character={live ?? WOW_SAMPLE} sample={!live} />
                </Frame>
                <Frame label="current" size={TWO_COLUMNS}>
                  <TechStackCard isDark={isDark} />
                </Frame>
              </div>
            </section>
          </main>
        </CardGlowProvider>
      </div>
    </>
  );
}
