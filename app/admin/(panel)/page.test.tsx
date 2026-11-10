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

  it("renderiza la tarjeta Productos como enlace a /admin/productos", async () => {
    render(await PanelPage());

    const productosLink = screen.getByRole("link", { name: "Productos Administración de productos digitales" });
    expect(productosLink).toBeInTheDocument();
    expect(productosLink).toHaveAttribute("href", "/admin/productos");
  });

  it("no muestra estado 'Próximamente' en la tarjeta Productos", async () => {
    render(await PanelPage());

    const productosCard = screen.getByRole("link", { name: "Productos Administración de productos digitales" });
    expect(productosCard.querySelector('[class*="rounded-full"]')).not.toBeInTheDocument();
  });

  it("renderiza la tarjeta Métricas como enlace a /admin/metricas", async () => {
    render(await PanelPage());

    const link = screen.getByRole("link", { name: /Métricas/i });
    expect(link).toHaveAttribute("href", "/admin/metricas");
  });

  it("ya no muestra ninguna tarjeta 'Próximamente'", async () => {
    render(await PanelPage());

    expect(screen.queryByText("Próximamente")).not.toBeInTheDocument();
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