import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TechStackCard, featuredColumns } from "./TechStackCard";
import type { SkillDataType } from "@/constants/skillsData";

describe("TechStackCard", () => {
  it("shows the featured skills from skillsData in their columns", () => {
    render(<TechStackCard isDark={false} />);

    const column = (title: string) => screen.getByText(title).parentElement as HTMLElement;
    expect(within(column("Frontend")).getByText("TypeScript")).toBeInTheDocument();
    expect(within(column("Backend")).getByText("Python")).toBeInTheDocument();
    expect(within(column("Infra & dados")).getByText("Cloudflare")).toBeInTheDocument();
  });

  it("leaves out the skills that are not featured", () => {
    render(<TechStackCard isDark={false} />);

    // Figma used to sit in a "DevOps" column; it is a design tool and not featured.
    expect(screen.queryByText("Figma")).not.toBeInTheDocument();
    expect(screen.queryByText("Zustand")).not.toBeInTheDocument();
  });

  it("orders a column by its categories first, then by each skill's order", () => {
    const skills: SkillDataType[] = [
      { name: "Lambda", category: "devops", featured: true, order: 1 },
      { name: "Actions", category: "automation", featured: true, order: 0 },
      { name: "Postgres", category: "database", featured: true, order: 9 },
      { name: "Hidden", category: "database", order: 2 },
    ];

    const infra = featuredColumns(skills).find((c) => c.title === "Infra & dados")!;

    expect(infra.items.map((s) => s.name)).toEqual(["Postgres", "Lambda", "Actions"]);
  });
});
