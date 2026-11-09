import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CategoriasPage from "@/app/admin/(panel)/categorias/page";
import { listCategoriesWithCount } from "@/lib/categories";

vi.mock("@/lib/auth/session", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: 1 }),
}));

vi.mock("@/lib/categories", () => ({
  listCategoriesWithCount: vi.fn(),
}));

describe("CategoriasPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza estado vacío cuando no hay categorías", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.getByText("No hay categorías")).toBeInTheDocument();
    expect(screen.getByText("Crea la primera categoría para empezar a organizar los productos.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crear categoría" })).toBeInTheDocument();
  });

  it("renderiza tabla con categorías en escritorio", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([
      { id: 1, slug: "cursos", name: "Cursos", productCount: 5 },
      { id: 2, slug: "libros", name: "Libros", productCount: 3 },
    ]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({}),
      })
    );

    // Check desktop table (hidden on mobile)
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    // Links in the table have class "text-blue-600 hover:text-blue-900 font-medium"
    const tableLinks = table.querySelectorAll("a.text-blue-600.hover\\:text-blue-900.font-medium");
    expect(tableLinks).toHaveLength(2);
    expect(tableLinks[0]).toHaveAttribute("href", "/admin/categorias/1");
    expect(tableLinks[0]).toHaveTextContent("Cursos");
    expect(tableLinks[1]).toHaveAttribute("href", "/admin/categorias/2");
    expect(tableLinks[1]).toHaveTextContent("Libros");
    // Slugs in the table cells (font-mono class)
    const slugCells = table.querySelectorAll("td.font-mono");
    expect(slugCells).toHaveLength(2);
    expect(slugCells[0]).toHaveTextContent("cursos");
    expect(slugCells[1]).toHaveTextContent("libros");
    // Product counts in the table
    expect(table.textContent).toContain("5");
    expect(table.textContent).toContain("3");
  });

  it("renderiza tarjetas en móvil (lg:hidden)", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([
      { id: 1, slug: "cursos", name: "Cursos", productCount: 5 },
    ]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({}),
      })
    );

    // Mobile card view should be present (lg:hidden div)
    const mobileContainer = screen.getByText("5 productos").closest("div.lg\\:hidden") as HTMLElement;
    expect(mobileContainer).toBeInTheDocument();
    // Mobile card has the name as a link with class "text-blue-600 hover:text-blue-900 font-medium text-lg"
    const mobileLink = mobileContainer.querySelector("a.text-blue-600.hover\\:text-blue-900.font-medium.text-lg");
    expect(mobileLink).toBeInTheDocument();
    expect(mobileLink).toHaveAttribute("href", "/admin/categorias/1");
    expect(mobileLink).toHaveTextContent("Cursos");
    expect(mobileContainer.querySelector("span.bg-gray-100")).toHaveTextContent("cursos");
  });

  it("muestra mensaje de éxito ok=creada", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ ok: "creada" }),
      })
    );

    expect(screen.getByText("Categoría creada correctamente.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra mensaje de éxito ok=editada", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ ok: "editada" }),
      })
    );

    expect(screen.getByText("Categoría actualizada correctamente.")).toBeInTheDocument();
  });

  it("muestra mensaje de éxito ok=eliminada", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ ok: "eliminada" }),
      })
    );

    expect(screen.getByText("Categoría eliminada correctamente.")).toBeInTheDocument();
  });

  it("ignora valores ok inválidos", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ ok: "invalido" }),
      })
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("muestra mensaje de error has-products con count", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ error: "has-products", count: "3" }),
      })
    );

    expect(screen.getByText("No se puede eliminar: la categoría tiene 3 productos asociados.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("muestra mensaje de error has-products en singular", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ error: "has-products", count: "1" }),
      })
    );

    expect(screen.getByText("No se puede eliminar: la categoría tiene 1 producto asociado.")).toBeInTheDocument();
  });

  it("ignora error has-products sin count", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({ error: "has-products" }),
      })
    );

    expect(screen.getByText("No se puede eliminar: la categoría tiene 0 productos asociados.")).toBeInTheDocument();
  });

  it("tiene enlace a nueva categoría", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.getByRole("link", { name: "Nueva categoría" })).toHaveAttribute("href", "/admin/categorias/nueva");
  });

  it("tiene enlace al panel", async () => {
    vi.mocked(listCategoriesWithCount).mockResolvedValue([]);

    render(
      await CategoriasPage({
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
  });
});