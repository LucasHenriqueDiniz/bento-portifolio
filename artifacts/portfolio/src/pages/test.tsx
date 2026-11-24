import { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { RotateCcw } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import { CardGlowProvider } from "@/components/CardGlowContext";
import { useTheme } from "@/hooks/useTheme";
import { useGetLastWorkoutCached, useGetStatsCached, useVisitorCount } from "@/hooks/usePortfolioQueries";
import { getWowCharacter } from "@/lib/apiClient";
import { featuredProjects } from "@/constants";
import { CVCard, EnhancedProjectCard, GitHubCard, TechStackCard, ViewsCard, WorkoutCard } from "@/components/home";
import { AboutCardV2 } from "@/components/test/AboutCardV2";
import { FeaturedProjectsCardV2 } from "@/components/test/FeaturedProjectsCardV2";
import { GitHubCardV2 } from "@/components/test/GitHubCardV2";
import { ResumeCardV2 } from "@/components/test/ResumeCardV2";
import { ResumeDeckCard } from "@/components/test/ResumeDeckCard";
import { useHomeCell } from "@/components/test/useHomeCell";
import { VisitsBoardCard } from "@/components/test/VisitsBoardCard";
import { VisitsCardV2 } from "@/components/test/VisitsCardV2";
import { WorkoutCardV2 } from "@/components/test/WorkoutCardV2";
import { WorkoutStoriesCard } from "@/components/test/WorkoutStoriesCard";
import { WowCard } from "@/components/test/WowCard";
import { WowSheetCard } from "@/components/test/WowSheetCard";
import { WOW_SAMPLE } from "@/components/test/wowSample";

// How many columns of the home grid a card spans; every card here is two rows tall.
// The frame takes the size that cell has in this window, so a redesign is judged at the
// size it will really have on this screen.
const ONE_COLUMN = 1;
const TWO_COLUMNS = 2;

// Bumped by "replay all": every frame remounts its card, which plays its entrance again.
const ReplayAll = createContext(0);

function Frame({ label, size: columns, children }: { label: string; size: number; children: React.ReactNode }) {
  const size = useHomeCell(columns, 2);
  const replayAll = useContext(ReplayAll);
  const [replay, setReplay] = useState(0);
  return (
    <figure className="flex flex-col gap-2 w-full" style={{ maxWidth: size.width }}>
      <figcaption className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-widest text-faint">
        <span>
          {label} <span className="font-normal normal-case tracking-normal opacity-70">{size.width}×{size.height}</span>
        </span>
        <button
          type="button"
          onClick={() => setReplay((n) => n + 1)}
          aria-label={`Replay animation: ${label}`}
          title="Replay animation"
          className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-base bg-panel text-faint transition-colors hover:border-brand hover:text-brand outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <RotateCcw size={11} />
        </button>
      </figcaption>
      <div key={`${replayAll}-${replay}`} style={{ height: size.height }} className="w-full">
        {children}
      </div>
    </figure>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-sub">{title}</h2>
      <div className="flex flex-wrap gap-6">{children}</div>
    </section>
  );
}

/** Sandbox for card redesigns: each proposal beside the card it would replace. */
export default function TestPage() {
  const { isDark, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [replayAll, setReplayAll] = useState(0);
  const { data: workout, isLoading: loadingWorkout } = useGetLastWorkoutCached();
  const { data: stats, isLoading: loadingStats } = useGetStatsCached();
  const visits = useVisitorCount();
  const wow = useQuery({ queryKey: ["/api/portfolio/wow"], queryFn: ({ signal }) => getWowCharacter({ signal }) });
  const live = wow.data?.character ?? null;

  const english = i18n.language.startsWith("en");
  const projects = featuredProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: english && p.highlightEn ? p.highlightEn : p.highlight,
    techStack: p.techStack,
    highlight: p.highlight,
    url: p.url,
    wip: p.status === "workInProgress",
    image: p.image,
  }));

  return (
    <>
      <SEO title="Test" noindex />
      <div className={`min-h-screen bg-canvas text-main pt-14 transition-colors duration-300 ${isDark ? "dark" : ""}`}>
        <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />
        <CardGlowProvider>
          <ReplayAll.Provider value={replayAll}>
            <main className="mx-auto max-w-5xl px-4 py-8 space-y-10">
              <section className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-2">
                  <h1 className="text-lg font-black tracking-tight">Card sandbox</h1>
                  <p className="text-[12px] text-sub max-w-xl">
                    Redesigns at the size their cell has on the home grid in this window. Proposals first, what is live today last.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReplayAll((n) => n + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-base bg-panel px-3 py-1.5 text-[11px] font-semibold text-sub transition-colors hover:border-brand hover:text-brand outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <RotateCcw size={12} />
                  Replay all animations
                </button>
              </section>

              <Section title="WoW, in the Tech Stack cell">
                <Frame label="new B · character sheet" size={TWO_COLUMNS}>
                  <WowSheetCard character={live ?? WOW_SAMPLE} sample={!live} />
                </Frame>
                <Frame label="new A · stats" size={TWO_COLUMNS}>
                  <WowCard character={live ?? WOW_SAMPLE} sample={!live} />
                </Frame>
                <Frame label="current" size={TWO_COLUMNS}>
                  <TechStackCard isDark={isDark} />
                </Frame>
              </Section>

              <Section title="Featured project">
                <Frame label="new" size={TWO_COLUMNS}>
                  <FeaturedProjectsCardV2 projects={projects} />
                </Frame>
                <Frame label="current" size={TWO_COLUMNS}>
                  <EnhancedProjectCard projects={projects} isDark={isDark} />
                </Frame>
              </Section>

              <Section title="About">
                <Frame label="new" size={ONE_COLUMN}>
                  <AboutCardV2 />
                </Frame>
              </Section>

              <Section title="Visits">
                <Frame label="new B · split-flap board" size={ONE_COLUMN}>
                  <VisitsBoardCard count={visits} />
                </Frame>
                <Frame label="new A · odometer" size={ONE_COLUMN}>
                  <VisitsCardV2 count={visits} />
                </Frame>
                <Frame label="current" size={ONE_COLUMN}>
                  <ViewsCard />
                </Frame>
              </Section>

              <Section title="Resume">
                <Frame label="new B · career deck" size={ONE_COLUMN}>
                  <ResumeDeckCard />
                </Frame>
                <Frame label="new A · paper" size={ONE_COLUMN}>
                  <ResumeCardV2 />
                </Frame>
                <Frame label="current" size={ONE_COLUMN}>
                  <CVCard navigate={setLocation} isDark={isDark} />
                </Frame>
              </Section>

              <Section title="Workout">
                <Frame label="new B · stories" size={ONE_COLUMN}>
                  <WorkoutStoriesCard workout={workout} />
                </Frame>
                <Frame label="new A · bars" size={ONE_COLUMN}>
                  <WorkoutCardV2 workout={workout} />
                </Frame>
                <Frame label="current" size={ONE_COLUMN}>
                  <WorkoutCard workout={workout as never} isLoading={loadingWorkout} isDark={isDark} />
                </Frame>
              </Section>

              <Section title="GitHub">
                <Frame label="new" size={TWO_COLUMNS}>
                  <GitHubCardV2 stats={stats} />
                </Frame>
                <Frame label="current" size={TWO_COLUMNS}>
                  <GitHubCard stats={stats as never} loadingStats={loadingStats} isDark={isDark} />
                </Frame>
              </Section>
            </main>
          </ReplayAll.Provider>
        </CardGlowProvider>
      </div>
    </>
  );
}
