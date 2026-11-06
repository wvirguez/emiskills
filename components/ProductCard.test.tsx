import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductCard from "@/components/ProductCard";
import type { ProductDTO } from "@/lib/products";

const product: ProductDTO = {
  id: 1,
  slug: "curso-java",
  title: "Curso Java",
  shortDescription: "Aprende Java desde cero.",
  description: null,
  price: 29,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  category: { slug: "curso", name: "Curso" },
  platform: { slug: "hotmart", name: "Hotmart" },
};

describe("ProductCard", () => {
  it("muestra los datos del producto", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Curso Java");
    expect(screen.getByText("Aprende Java desde cero.")).toBeInTheDocument();
    expect(screen.getByText("Curso")).toBeInTheDocument();
    expect(screen.getByText("Hotmart")).toBeInTheDocument();
    expect(screen.getByText(/29\.00/)).toHaveTextContent("29.00 USD");
  });

  it("enlaza al detalle por slug", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("link", { name: /Ver producto/ })).toHaveAttribute(
      "href",
      "/productos/curso-java",
    );
  });

  it("usa el degradado por defecto si no hay imageGradient", () => {
    const { container } = render(<ProductCard product={product} />);
    expect(container.querySelector(".from-violet-500.to-fuchsia-500")).not.toBeNull();
  });

  it("no expone affiliateUrl", () => {
    const { container } = render(<ProductCard product={product} />);
    expect(container.innerHTML).not.toContain("affiliate");
  });
});
