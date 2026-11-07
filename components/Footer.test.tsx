import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("enlaza a las secciones de la landing con rutas absolutas", () => {
    render(<Footer />);
    const expected = {
      Productos: "/#productos",
      Categorías: "/#categorias",
      Buscar: "/#buscar",
      "Cómo funciona": "/#como-funciona",
    };
    for (const [name, href] of Object.entries(expected)) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("informa el origen de los productos", () => {
    render(<Footer />);
    expect(screen.getByText(/Hotmart y de otros productores/)).toBeInTheDocument();
  });
});
