import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ProductDTO, CategoryDTO } from "@/lib/products";

const getProducts = vi.fn();
const getCategories = vi.fn();

vi.mock("@/lib/products", () => ({
  getProducts: (...a: unknown[]) => getProducts(...a),
  getCategories: (...a: unknown[]) => getCategories(...a),
}));
vi.mock("next/server", () => ({ connection: async () => undefined }));

import Categories from "@/components/Categories";

const categories: CategoryDTO[] = [
  { id: 1, slug: "curso", name: "Cursos" },
  { id: 2, slug: "ebook", name: "Ebooks" },
];

const makeProduct = (id: number, categorySlug = "curso"): ProductDTO => ({
  id,
  slug: `p-${id}`,
  title: `Producto ${id}`,
  shortDescription: "Descripción corta",
  description: "Descripción completa",
  price: 10,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  category: { slug: categorySlug, name: categorySlug === "curso" ? "Cursos" : "Ebooks" },
  platform: { slug: "hotmart", name: "Hotmart" },
});

async function renderCategories(props: { categoriaActiva?: string } = {}) {
  render(await Categories(props));
}

describe("Categories", () => {
  beforeEach(() => {
    getProducts.mockReset();
    getCategories.mockReset();
    getCategories.mockResolvedValue(categories);
  });

  it("renderiza chips 'Todos' y una por cada categoría", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories();

    expect(screen.getByRole("tab", { name: "Todos" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Cursos" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ebooks" })).toBeInTheDocument();
  });

  it("marca 'Todos' como activo cuando no hay categoriaActiva", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories();

    expect(screen.getByRole("tab", { name: "Todos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("tab", { name: "Cursos" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("tab", { name: "Ebooks" })).not.toHaveAttribute("aria-current");
  });

  it("marca la categoría correspondiente como activa cuando se pasa categoriaActiva válido", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories({ categoriaActiva: "curso" });

    expect(screen.getByRole("tab", { name: "Cursos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("tab", { name: "Todos" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("tab", { name: "Ebooks" })).not.toHaveAttribute("aria-current");
  });

  it("sin categoriaActiva llama a getProducts sin categorySlug", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories();

    expect(getProducts).toHaveBeenCalledWith({ pageSize: 12 });
    expect(getProducts).not.toHaveBeenCalledWith(expect.objectContaining({ categorySlug: expect.any(String) }));
  });

  it("con categoriaActiva válido llama a getProducts con categorySlug y pageSize: 12", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories({ categoriaActiva: "curso" });

    expect(getProducts).toHaveBeenCalledWith({ categorySlug: "curso", pageSize: 12 });
  });

  it("slug inválido se trata como 'Todos' y llama a getProducts sin categorySlug", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories({ categoriaActiva: "inexistente" });

    expect(getProducts).toHaveBeenCalledWith({ pageSize: 12 });
    expect(getProducts).not.toHaveBeenCalledWith(expect.objectContaining({ categorySlug: "inexistente" }));
    expect(screen.getByRole("tab", { name: "Todos" })).toHaveAttribute("aria-current", "page");
  });

  it("muestra estado vacío cuando no hay productos en la categoría", async () => {
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories({ categoriaActiva: "curso" });

    expect(screen.getByText("Aún no hay productos en esta categoría.")).toBeInTheDocument();
  });

  it("muestra productos cuando getProducts devuelve items", async () => {
    const products = [makeProduct(1, "curso"), makeProduct(2, "curso")];
    getProducts.mockResolvedValue({ items: products, total: 2, page: 1, pageSize: 12, totalPages: 1 });
    await renderCategories({ categoriaActiva: "curso" });

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Producto 2")).toBeInTheDocument();
  });

  it("muestra estado vacío si getProducts lanza error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getProducts.mockRejectedValue(new Error("db error"));
    await renderCategories();

    expect(screen.getByText("Aún no hay productos en esta categoría.")).toBeInTheDocument();
  });

  it("muestra estado vacío si getCategories lanza error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getCategories.mockRejectedValue(new Error("db error"));
    getProducts.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 });
    await renderCategories();

    expect(screen.getByText("Aún no hay productos en esta categoría.")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Todos" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Cursos" })).not.toBeInTheDocument();
  });
});