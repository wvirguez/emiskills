import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SearchResults from "@/components/SearchResults";
import type { ProductDTO, ProductPage } from "@/lib/products";

const make = (id: number): ProductDTO => ({
  id,
  slug: `p-${id}`,
  title: `Producto ${id}`,
  shortDescription: "Desc",
  description: null,
  price: 10,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  category: { slug: "c", name: "Cat" },
  platform: { slug: "h", name: "Hotmart" },
});
const page = (items: ProductDTO[], total = items.length): ProductPage => ({
  items,
  total,
  page: 1,
  pageSize: 12,
  totalPages: 1,
});

describe("SearchResults", () => {
  it("muestra contador y una tarjeta por producto", () => {
    render(<SearchResults result={page([make(1), make(2)])} />);
    expect(screen.getByText("2 productos")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("usa singular con un resultado", () => {
    render(<SearchResults result={page([make(1)])} />);
    expect(screen.getByText("1 producto")).toBeInTheDocument();
  });

  it("muestra mensaje honesto y enlace sin resultados", () => {
    render(<SearchResults result={page([], 0)} />);
    expect(screen.getByText(/No encontramos productos que coincidan/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver todos los productos" })).toHaveAttribute(
      "href",
      "/productos",
    );
  });
});
