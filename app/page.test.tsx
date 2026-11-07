import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/Categories", () => ({
  default: () => <section id="categorias" />,
}));
vi.mock("@/components/SearchCourses", () => ({
  default: () => <section id="buscar" />,
}));
vi.mock("@/components/FeaturedProducts", () => ({
  default: () => <section id="productos" />,
}));

import Home from "./page";

describe("Landing", () => {
  it("no muestra la sección de plataformas de origen", () => {
    render(<Home />);
    expect(screen.queryByText("Plataformas de origen de los productos")).not.toBeInTheDocument();
  });

  it("conserva las secciones ancladas y el Hero", () => {
    const { container } = render(<Home />);
    for (const id of ["productos", "categorias", "buscar", "como-funciona"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("muestra la franja de beneficios entre el Hero y Categorías", () => {
    const { container } = render(<Home />)
    const franja = screen.getByRole("region", { name: "Beneficios" })
    const h1 = screen.getByRole("heading", { level: 1 })
    const categorias = container.querySelector("#categorias")!
    expect(h1.compareDocumentPosition(franja) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(franja.compareDocumentPosition(categorias) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
