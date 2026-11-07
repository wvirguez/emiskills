import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductDetail from "@/components/ProductDetail";
import type { ProductDTO } from "@/lib/products";

const base: ProductDTO = {
  id: 1,
  slug: "curso-java",
  title: "Curso Java",
  shortDescription: "Resumen corto.",
  description: "Primer párrafo.\n\nSegundo párrafo.",
  price: 29,
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  category: { slug: "curso", name: "Curso" },
  platform: { slug: "hotmart", name: "Hotmart" },
};

describe("ProductDetail", () => {
  it("muestra los datos principales", () => {
    render(<ProductDetail product={base} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Curso Java");
    expect(screen.getByText("Curso")).toBeInTheDocument();
    expect(screen.getByText("Hotmart")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
    expect(screen.getByText("29.00 USD")).toBeInTheDocument();
  });

  it("usa la descripción completa dividida en párrafos", () => {
    render(<ProductDetail product={base} />);
    expect(screen.getByText("Primer párrafo.")).toBeInTheDocument();
    expect(screen.getByText("Segundo párrafo.")).toBeInTheDocument();
    expect(screen.queryByText("Resumen corto.")).toBeNull();
  });

  it("usa la descripción corta si no hay descripción", () => {
    render(<ProductDetail product={{ ...base, description: null }} />);
    expect(screen.getByText("Resumen corto.")).toBeInTheDocument();
  });

  it("el botón apunta a /go/<slug> y hay aviso de afiliado", () => {
    render(<ProductDetail product={base} />);
    expect(screen.getByRole("link", { name: "Ir a la oferta" })).toHaveAttribute(
      "href",
      "/go/curso-java",
    );
    expect(screen.getByText(/Aviso de afiliado/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Volver al catálogo/ })).toBeInTheDocument();
  });

  it("no expone affiliateUrl ni textos de urgencia", () => {
    const { container } = render(<ProductDetail product={base} />);
    const html = container.innerHTML.toLowerCase();
    expect(html).not.toContain("affiliateurl");
    expect(html).not.toMatch(/últimas|oferta limitada|más vendido/);
  });
});
