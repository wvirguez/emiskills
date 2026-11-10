import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  total: vi.fn(),
  byProduct: vi.fn(),
  byCategory: vi.fn(),
  byDay: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/auth/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/click-metrics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/click-metrics")>("@/lib/click-metrics");
  return {
    ...actual,
    getClickTotals: mocks.total,
    getClicksByProduct: mocks.byProduct,
    getClicksByCategory: mocks.byCategory,
    getClicksByDay: mocks.byDay,
  };
});

import MetricasPage from "@/app/admin/(panel)/metricas/page";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.verifySession.mockResolvedValue({ userId: 1 });
  mocks.total.mockResolvedValue(0);
  mocks.byProduct.mockResolvedValue([]);
  mocks.byCategory.mockResolvedValue([]);
  mocks.byDay.mockResolvedValue([]);
});

async function renderPage(rango?: string | string[]) {
  render(await MetricasPage({ searchParams: Promise.resolve({ rango }) }));
}

describe("MetricasPage", () => {
  it("rango inválido usa 30 días", async () => {
    await renderPage("basura");
    expect(mocks.total).toHaveBeenCalledWith("30d");
    expect(screen.getByRole("link", { name: "30 días" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "7 días" })).not.toHaveAttribute("aria-current");
  });

  it("respeta ?rango=7d", async () => {
    await renderPage("7d");
    expect(mocks.byDay).toHaveBeenCalledWith("7d");
    expect(screen.getByRole("link", { name: "7 días" })).toHaveAttribute("aria-current", "page");
  });

  it("sin clics muestra estado vacío y sin NaN", async () => {
    mocks.byCategory.mockResolvedValue([{ id: 1, name: "Cursos", clicks: 0 }]);
    await renderPage();
    expect(screen.getByText("No hay clics registrados en este rango.")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("NaN");
    expect(screen.getAllByText("0 %").length).toBeGreaterThan(0);
  });

  it("con datos muestra total, filas, porcentajes y barras proporcionales", async () => {
    mocks.total.mockResolvedValue(4);
    mocks.byProduct.mockResolvedValue([{ id: 1, name: "Curso X", categoryName: "Cursos", clicks: 3 }]);
    mocks.byCategory.mockResolvedValue([
      { id: 1, name: "Cursos", clicks: 3 },
      { id: 2, name: "Ebooks", clicks: 1 },
    ]);
    mocks.byDay.mockResolvedValue([
      { date: "2026-11-09", clicks: 4 },
      { date: "2026-11-08", clicks: 2 },
    ]);
    await renderPage("todo");

    expect(screen.getByTestId("total-clicks")).toHaveTextContent("4");
    expect(screen.getAllByText("Curso X").length).toBeGreaterThan(0);
    expect(screen.getAllByText("75 %").length).toBeGreaterThan(0);
    expect(screen.getAllByText("25 %").length).toBeGreaterThan(0);
    const bars = screen.getAllByTestId("day-bar");
    expect(bars[0]).toHaveStyle({ width: "100%" });
    expect(bars[1]).toHaveStyle({ width: "50%" });
    expect(screen.queryByText("No hay clics registrados en este rango.")).not.toBeInTheDocument();
  });

  it("incluye el aviso de que un clic no es una venta y enlace al panel", async () => {
    await renderPage();
    expect(screen.getByText("Un clic no equivale a una venta.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver al panel/ })).toHaveAttribute("href", "/admin");
    expect(within(screen.getByRole("navigation", { name: "Rango de fechas" })).getAllByRole("link")).toHaveLength(3);
  });
});
