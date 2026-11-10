import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ProductDTO } from "@/lib/products";

const getProductBySlug = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("@/lib/products", () => ({
  getProductBySlug: (...a: unknown[]) => getProductBySlug(...a),
}));
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));
vi.mock("next/server", () => ({ connection: async () => undefined }));

import ProductPage, { generateMetadata } from "./page";

const product: ProductDTO = {
  id: 1,
  slug: "curso-java",
  title: "Curso Java",
  shortDescription: "x".repeat(300),
  description: null,
  price: 29,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  category: { slug: "curso", name: "Curso" },
  platform: { slug: "hotmart", name: "Hotmart" },
};
const props = { params: Promise.resolve({ slug: "curso-java" }) };

describe("ProductPage", () => {
  beforeEach(() => {
    getProductBySlug.mockReset();
    notFound.mockClear();
  });

  it("renderiza la ficha si el producto existe", async () => {
    getProductBySlug.mockResolvedValue(product);
    render(await ProductPage(props));
    expect(getProductBySlug).toHaveBeenCalledWith("curso-java");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Curso Java");
  });

  it("llama a notFound si no existe", async () => {
    getProductBySlug.mockResolvedValue(null);
    await expect(ProductPage(props)).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("genera metadatos con título y descripción recortada", async () => {
    getProductBySlug.mockResolvedValue(product);
    const meta = await generateMetadata(props);
    expect(meta.title).toBe("Curso Java");
    expect(meta.alternates?.canonical).toBe("/productos/curso-java/");
    expect(meta.openGraph).not.toHaveProperty("images");
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
  });

  it("metadatos genéricos si no existe", async () => {
    getProductBySlug.mockResolvedValue(null);
    const meta = await generateMetadata(props);
    expect(meta.title).toBe("Producto no encontrado");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("usa la imagen del producto en Open Graph y Twitter", async () => {
    getProductBySlug.mockResolvedValue({ ...product, imageUrl: "https://cdn.x/a.png" });
    const meta = await generateMetadata(props);
    expect(meta.openGraph).toMatchObject({ images: [{ url: "https://cdn.x/a.png" }] });
    expect(meta.twitter).toMatchObject({ images: ["https://cdn.x/a.png"] });
  });
});
