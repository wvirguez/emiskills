import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const getProducts = vi.fn();
const getCategories = vi.fn();
vi.mock("@/lib/products", () => ({
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
  });

  it("pasa q, categoría y página a getProducts", async () => {
    await run({ q: " java ", categoria: "curso", page: "2" });
    expect(getProducts).toHaveBeenCalledWith({ q: "java", categorySlug: "curso", page: 2 });
  });

  it("ignora una categoría desconocida", async () => {
    await run({ categoria: "inexistente" });
    expect(getProducts).toHaveBeenCalledWith({ q: undefined, categorySlug: undefined, page: 1 });
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
});
