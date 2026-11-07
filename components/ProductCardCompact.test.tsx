import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductCardCompact from "./ProductCardCompact";
import type { ProductDTO } from "@/lib/products";

const mockProduct: ProductDTO = {
  id: 1,
  slug: "curso-typescript-avanzado",
  title: "Curso Completo de TypeScript Avanzado",
  shortDescription: "Domina TypeScript desde cero hasta nivel experto",
  description: "Descripción completa del curso...",
  price: 49.99,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: "from-blue-500 to-cyan-500",
  category: { slug: "programacion", name: "Programación" },
  platform: { slug: "udemy", name: "Udemy" },
};

describe("ProductCardCompact", () => {
  it("renderiza el título del producto", () => {
    render(<ProductCardCompact product={mockProduct} />);
    expect(screen.getByText("Curso Completo de TypeScript Avanzado")).toBeInTheDocument();
  });

  it("renderiza la categoría del producto", () => {
    render(<ProductCardCompact product={mockProduct} />);
    expect(screen.getByText("Programación")).toBeInTheDocument();
  });

  it("renderiza la plataforma del producto", () => {
    render(<ProductCardCompact product={mockProduct} />);
    expect(screen.getByText("Udemy")).toBeInTheDocument();
  });

  it("renderiza el precio y la moneda", () => {
    render(<ProductCardCompact product={mockProduct} />);
    expect(screen.getByText("49.99")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renderiza el enlace 'Ver producto' con href correcto", () => {
    render(<ProductCardCompact product={mockProduct} />);
    const link = screen.getByRole("link", { name: "Ver producto" });
    expect(link).toHaveAttribute("href", "/productos/curso-typescript-avanzado");
  });

  it("usa el degradado por defecto cuando imageGradient es null", () => {
    const productWithoutGradient: ProductDTO = {
      ...mockProduct,
      imageGradient: null,
    };
    render(<ProductCardCompact product={productWithoutGradient} />);
    const gradientDiv = screen.getByTestId("gradient-bg");
    expect(gradientDiv).toHaveClass("from-violet-500");
    expect(gradientDiv).toHaveClass("to-fuchsia-500");
  });

  it("usa el degradado del producto cuando imageGradient está presente", () => {
    render(<ProductCardCompact product={mockProduct} />);
    const gradientDiv = screen.getByTestId("gradient-bg");
    expect(gradientDiv).toHaveClass("from-blue-500");
    expect(gradientDiv).toHaveClass("to-cyan-500");
  });

  it("aplica clases de ancho fijo y snap-start para carrusel", () => {
    render(<ProductCardCompact product={mockProduct} />);
    const article = screen.getByRole("article");
    expect(article).toHaveClass("shrink-0");
    expect(article).toHaveClass("snap-start");
    expect(article).toHaveClass("w-64");
  });
});