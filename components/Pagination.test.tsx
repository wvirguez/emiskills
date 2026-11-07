import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  it("no se renderiza con una sola página", () => {
    const { container } = render(<Pagination page={1} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("conserva filtros en anterior/siguiente", () => {
    render(<Pagination page={2} totalPages={3} q="java" categoria="curso" />);
    expect(screen.getByRole("link", { name: /Anterior/ })).toHaveAttribute(
      "href",
      "/productos?q=java&categoria=curso",
    );
    expect(screen.getByRole("link", { name: /Siguiente/ })).toHaveAttribute(
      "href",
      "/productos?q=java&categoria=curso&page=3",
    );
    expect(screen.getByText("Página 2 de 3")).toBeInTheDocument();
  });

  it("oculta 'Anterior' en la primera página y 'Siguiente' en la última", () => {
    const { rerender } = render(<Pagination page={1} totalPages={2} />);
    expect(screen.queryByRole("link", { name: /Anterior/ })).toBeNull();
    rerender(<Pagination page={2} totalPages={2} />);
    expect(screen.queryByRole("link", { name: /Siguiente/ })).toBeNull();
  });

  it("conserva los filtros de precio, idioma y plataforma", () => {
    render(<Pagination page={2} totalPages={3} filters={{ precioMax: 20, moneda: "USD", idioma: "es", plataforma: "hotmart" }} />);
    expect(screen.getByRole("link", { name: /Siguiente/ })).toHaveAttribute(
      "href",
      "/productos?precioMax=20&moneda=USD&idioma=es&plataforma=hotmart&page=3",
    );
  });
});
