import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PanelPage from "@/app/admin/(panel)/page";

vi.mock("@/lib/auth/session", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: 1 }),
}));

describe("PanelPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza la tarjeta Categorías como enlace a /admin/categorias", async () => {
    render(await PanelPage());

    const categoriasLink = screen.getByRole("link", { name: /Categorías/i });
    expect(categoriasLink).toBeInTheDocument();
    expect(categoriasLink).toHaveAttribute("href", "/admin/categorias");
  });

  it("no muestra estado 'Próximamente' en la tarjeta Categorías", async () => {
    render(await PanelPage());

    const categoriasCard = screen.getByRole("link", { name: /Categorías/i });
    expect(categoriasCard.querySelector("span")?.textContent).not.toBe("Próximamente");
    // More specifically, check that there's no "Próximamente" text inside the Categorías card
    expect(categoriasCard.querySelector('[class*="rounded-full"]')).not.toBeInTheDocument();
  });

  it("renderiza tarjetas Productos y Métricas con estado 'Próximamente'", async () => {
    render(await PanelPage());

    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Métricas")).toBeInTheDocument();
    const proximamenteLabels = screen.getAllByText("Próximamente");
    expect(proximamenteLabels).toHaveLength(2);
  });

  it("tarjetas Productos y Métricas no son enlaces", async () => {
    render(await PanelPage());

    const productosCard = screen.getByText("Productos").closest("article");
    const metricasCard = screen.getByText("Métricas").closest("article");

    expect(productosCard).not.toHaveAttribute("href");
    expect(metricasCard).not.toHaveAttribute("href");
  });

  it("renderiza título y descripción del panel", async () => {
    render(await PanelPage());

    expect(screen.getByText("Bienvenido al panel")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una sección para comenzar a gestionar el catálogo.")).toBeInTheDocument();
  });

  it("tarjeta Categorías tiene el icono correcto", async () => {
    render(await PanelPage());

    const categoriasCard = screen.getByRole("link", { name: /Categorías/i });
    const svg = categoriasCard.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-blue-600");
  });
});