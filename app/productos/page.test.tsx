import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const getProducts = vi.fn();
const getCategories = vi.fn();
const getPlatforms = vi.fn();
const getFilterOptions = vi.fn();
vi.mock("@/lib/products", () => ({
  getPlatforms: () => getPlatforms(),
  getFilterOptions: () => getFilterOptions(),
  getProducts: (...a: unknown[]) => getProducts(...a),
  getCategories: () => getCategories(),
}));
vi.mock("next/server", () => ({ connection: async () => undefined }));

import ProductsPage from "./page";

const empty = { items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 };
const cats = [
  { id: 1, slug: "curso", name: "Cursos" },
  { id: 2, slug: "ebook", name: "Ebooks" },
];
const run = async (sp: Record<string, string | string[] | undefined>) =>
  render(await ProductsPage({ searchParams: Promise.resolve(sp) }));

describe("/productos", () => {
  beforeEach(() => {
    getProducts.mockReset();
    getCategories.mockReset();
    getCategories.mockResolvedValue(cats);
    getProducts.mockResolvedValue(empty);
    getPlatforms.mockResolvedValue([{ id: 1, slug: "hotmart", name: "Hotmart" }]);
    getFilterOptions.mockResolvedValue({ currencies: ["USD", "EUR"], languages: ["es", "en"] });
  });

  it("pasa q, categoría y página a getProducts", async () => {
    await run({ q: " java ", categoria: "curso", page: "2" });
    expect(getProducts).toHaveBeenCalledWith(
      expect.objectContaining({ q: "java", categorySlug: "curso", page: 2 }),
    );
  });

  it("ignora una categoría desconocida", async () => {
    await run({ categoria: "inexistente" });
    expect(getProducts).toHaveBeenCalledWith(
      expect.objectContaining({ q: undefined, categorySlug: undefined, page: 1 }),
    );
  });

  it("muestra el estado sin resultados y conserva q en el input", async () => {
    await run({ q: "zzz" });
    expect(screen.getByText(/No encontramos productos que coincidan/)).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar productos")).toHaveValue("zzz");
  });

  it("resalta la categoría activa", async () => {
    await run({ categoria: "ebook" });
    expect(screen.getByRole("link", { name: "Ebooks" })).toHaveAttribute("aria-current", "page");
  });

  it("pasa los filtros de precio, idioma y plataforma", async () => {
    await run({
      precioMin: "10", precioMax: "50", moneda: "EUR", idioma: "en", plataforma: "hotmart",
    });
    expect(getProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        minPrice: 10, maxPrice: 50, currency: "EUR", language: "en", platformSlug: "hotmart",
      }),
    );
  });

  it("ignora idioma, moneda y plataforma desconocidos", async () => {
    await run({ idioma: "zz", moneda: "XXX", plataforma: "nada" });
    expect(getProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        currency: undefined, language: undefined, platformSlug: undefined,
      }),
    );
  });

  it("usa la moneda más común cuando hay rango sin moneda", async () => {
    await run({ precioMax: "30" });
    expect(getProducts).toHaveBeenCalledWith(
      expect.objectContaining({ maxPrice: 30, currency: "USD" }),
    );
    expect(screen.getByLabelText("Moneda")).toHaveValue("USD");
  });
});
