import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProductFilters from "./ProductFilters";

const platforms = [{ slug: "hotmart", name: "Hotmart" }];
const options = { currencies: ["USD", "EUR"], languages: ["es", "en"] };

describe("ProductFilters", () => {
  it("renderiza un formulario GET con campos etiquetados", () => {
    render(<ProductFilters filters={{}} platforms={platforms} options={options} />);
    const form = screen.getByRole("form", { name: "Filtros de productos" });
    expect(form).toHaveAttribute("method", "get");
    expect(form).toHaveAttribute("action", "/productos/");
    for (const l of ["Precio mínimo", "Precio máximo", "Moneda", "Idioma", "Plataforma"]) {
      expect(screen.getByLabelText(l)).toBeInTheDocument();
    }
    expect(screen.getByRole("option", { name: "Inglés" })).toBeInTheDocument();
    expect(screen.getByText(/no convertimos monedas/)).toBeInTheDocument();
  });

  it("preselecciona valores y conserva q y categoría", () => {
    const { container } = render(
      <ProductFilters
        q="java"
        categoria="curso"
        filters={{ precioMin: 5, moneda: "EUR", idioma: "en", plataforma: "hotmart" }}
        platforms={platforms}
        options={options}
      />,
    );
    expect(screen.getByLabelText("Precio mínimo")).toHaveValue(5);
    expect(screen.getByLabelText("Moneda")).toHaveValue("EUR");
    expect(screen.getByLabelText("Idioma")).toHaveValue("en");
    expect(screen.getByLabelText("Plataforma")).toHaveValue("hotmart");
    expect(container.querySelector('input[name="q"]')).toHaveValue("java");
    expect(container.querySelector('input[name="categoria"]')).toHaveValue("curso");
    expect(screen.getByLabelText("Mostrar filtros")).toBeChecked();
  });

  it("'Limpiar filtros' conserva solo q y categoría", () => {
    render(
      <ProductFilters
        q="java"
        categoria="curso"
        filters={{ precioMin: 5 }}
        platforms={platforms}
        options={options}
      />,
    );
    expect(screen.getByRole("link", { name: "Limpiar filtros" })).toHaveAttribute(
      "href",
      "/productos?q=java&categoria=curso",
    );
  });

  it("el panel móvil está cerrado sin filtros activos", () => {
    render(<ProductFilters filters={{}} platforms={platforms} options={options} />);
    expect(screen.getByLabelText("Mostrar filtros")).not.toBeChecked();
  });
});
