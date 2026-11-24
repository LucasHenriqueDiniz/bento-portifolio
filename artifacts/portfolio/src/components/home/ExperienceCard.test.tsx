import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { jobExperiences } from "@/constants/jobExperiences";
import { timelineAcademicExperiences } from "@/constants/timelineData";
import { ExperienceCard, monthsBetween } from "./ExperienceCard";

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

const shownJobs = jobExperiences.filter((job) => job.showInTimeline);

describe("ExperienceCard", () => {
  it("lists every job marked for the timeline, with the first one open", () => {
    render(<ExperienceCard />);

    const entries = screen.getAllByRole("button", { expanded: true }).concat(screen.getAllByRole("button", { expanded: false }));
    expect(entries).toHaveLength(shownJobs.length);
    expect(screen.getByRole("button", { expanded: true })).toHaveTextContent(shownJobs[0].title);
    expect(screen.getByText(shownJobs[0].description)).toBeInTheDocument();
  });

  it("opens the entry that is clicked and closes the one that was open", () => {
    render(<ExperienceCard />);

    fireEvent.click(screen.getByRole("button", { name: new RegExp(shownJobs[2].institution) }));

    expect(screen.getByRole("button", { expanded: true })).toHaveTextContent(shownJobs[2].title);
  });

  it("switches to education and its certificates", () => {
    render(<ExperienceCard />);

    fireEvent.click(screen.getByRole("tab", { name: "Educação" }));

    expect(screen.getByRole("tab", { name: "Educação" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("button", { expanded: true })).toHaveTextContent(timelineAcademicExperiences[0].degree);
    expect(screen.getByText("Certificações")).toBeInTheDocument();
    expect(screen.queryByText(shownJobs[0].title)).not.toBeInTheDocument();
  });

  it("counts months with both ends included, in local time", () => {
    expect(monthsBetween("2026-05", "2026-08")).toBe(4);
    expect(monthsBetween("2019-01", "2020-12")).toBe(24);
    expect(monthsBetween("2026-08", null, new Date(2026, 10, 24))).toBe(4);
  });
});
