import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { MachinesCard } from "./MachinesCard";

const { useGetMachinesStatusCached } = vi.hoisted(() => ({ useGetMachinesStatusCached: vi.fn() }));

vi.mock("@/hooks/usePortfolioQueries", () => ({ useGetMachinesStatusCached }));

const machines = (overrides: Record<string, unknown> = {}) => ({
  at: new Date().toISOString(),
  pc: {
    online: true,
    uptimeHours: 16.6,
    cpuPct: 77,
    cpuTempC: null,
    ramPct: 47.8,
    gpuPct: 30,
    gpuTempC: 58,
    disks: [
      { name: "C", usedPct: 74.5 },
      { name: "E", usedPct: 69 },
    ],
  },
  server: {
    online: true,
    uptimeHours: 6.6,
    cpuPct: null,
    cpuTempC: 72,
    ramPct: 10,
    gpuPct: null,
    gpuTempC: null,
    disks: [{ name: "root", usedPct: 6.1 }],
  },
  ...overrides,
});

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  useGetMachinesStatusCached.mockReset();
});

describe("MachinesCard", () => {
  it("shows the PC readings on the front face", () => {
    useGetMachinesStatusCached.mockReturnValue({ data: machines() });

    render(<MachinesCard />);

    expect(screen.getByText("Meu PC")).toBeInTheDocument();
    expect(screen.getByText("77%")).toBeInTheDocument();
    expect(screen.getByText("47,8%")).toBeInTheDocument();
    expect(screen.getByText("58 °C")).toBeInTheDocument();
    expect(screen.getByText("disco C")).toBeInTheDocument();
    expect(screen.getByText("disco E")).toBeInTheDocument();
  });

  it("shows the server readings on the back face", () => {
    useGetMachinesStatusCached.mockReturnValue({ data: machines() });

    render(<MachinesCard />);

    expect(screen.getByText("Servidor")).toBeInTheDocument();
    expect(screen.getByText("72 °C")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("6,1%")).toBeInTheDocument();
    expect(screen.getByText("disco")).toBeInTheDocument();
  });

  it("keeps both faces and says offline when a machine is down", () => {
    const data = machines();
    (data.pc as any).online = false;
    useGetMachinesStatusCached.mockReturnValue({ data });

    render(<MachinesCard />);

    expect(screen.getByText("offline")).toBeInTheDocument();
    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("omits a reading that is missing instead of showing zero", () => {
    const data = machines();
    (data.pc as any).gpuTempC = null;
    (data.pc as any).gpuPct = null;
    useGetMachinesStatusCached.mockReturnValue({ data });

    render(<MachinesCard />);

    expect(screen.queryByText("gpu")).not.toBeInTheDocument();
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });

  it("shows a neutral message on the PC face when only the server is known", () => {
    useGetMachinesStatusCached.mockReturnValue({ data: machines({ pc: null }) });

    render(<MachinesCard />);

    expect(screen.getByText("Sem leitura no momento")).toBeInTheDocument();
    expect(screen.getByText("72 °C")).toBeInTheDocument();
  });

  it("does not claim a live status from a stale cached reading", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    useGetMachinesStatusCached.mockReturnValue({ data: machines({ at: twoHoursAgo }) });

    const { container } = render(<MachinesCard />);

    expect(container.querySelector(".animate-ping")).toBeNull();
  });

  it("falls back to a neutral message when the request failed and nothing is cached", () => {
    useGetMachinesStatusCached.mockReturnValue({ data: undefined });

    render(<MachinesCard />);

    expect(screen.getAllByText("Sem leitura no momento").length).toBe(2);
  });
});
