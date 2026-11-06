import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ProductDTO } from "@/lib/products";

const getProducts = vi.fn();
vi.mock("@/lib/products", () => ({ getProducts: (...a: unknown[]) => getProducts(...a) }));
vi.mock("next/server", () => ({ connection: async () => undefined }));

import FeaturedProducts from "@/components/FeaturedProducts";

const make = (id: number): ProductDTO => ({
  id,
  slug: `p-${id}`,
  title: `Producto ${id}`,
  shortDescription: "Descripción",
  description: null,
  price: 10,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  category: { slug: "c", name: "Cat" },
  platform: { slug: "h", name: "Hotmart" },
});

async function renderSection() {
  render(await FeaturedProducts());
}

describe("FeaturedProducts", () => {
  beforeEach(() => {
    getProducts.mockReset();
  });

  it("pide 6 productos y renderiza una tarjeta por cada uno", async () => {
    getProducts.mockResolvedValue({ items: [make(1), make(2)] });
    await renderSection();
    expect(getProducts).toHaveBeenCalledWith({ pageSize: 6 });
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(document.body.textContent?.toLowerCase()).not.toContain("ejemplo");
  });

  it("muestra estado vacío sin productos", async () => {
    getProducts.mockResolvedValue({ items: [] });
    await renderSection();
    expect(screen.getByText(/Aún no hay productos disponibles/)).toBeInTheDocument();
  });

  it("muestra estado vacío si la consulta falla", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getProducts.mockRejectedValue(new Error("db"));
    await renderSection();
    expect(screen.getByText(/Aún no hay productos disponibles/)).toBeInTheDocument();
  });
});
