import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/Categories", () => ({
  default: ({ categoriaActiva }: { categoriaActiva?: string }) => (
    <section id="categorias" data-categoria-activa={categoriaActiva ?? "todos"} />
  ),
}));
vi.mock("@/components/SearchCourses", () => ({
  default: () => <section id="buscar" />,
}));
vi.mock("@/components/FeaturedProducts", () => ({
  default: () => <section id="productos" />,
}));

import Home from "./page";

describe("Landing", () => {
  const mockSearchParams = Promise.resolve({});

  it("no muestra la sección de plataformas de origen", async () => {
    render(await Home({ searchParams: mockSearchParams }));
    expect(screen.queryByText("Plataformas de origen de los productos")).not.toBeInTheDocument();
  });

  it("conserva las secciones ancladas y el Hero", async () => {
    const { container } = render(await Home({ searchParams: mockSearchParams }));
    for (const id of ["productos", "categorias", "buscar", "como-funciona"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("muestra la franja de beneficios entre el Hero y Categorías", async () => {
    const { container } = render(await Home({ searchParams: mockSearchParams }));
    const franja = screen.getByRole("region", { name: "Beneficios" });
    const h1 = screen.getByRole("heading", { level: 1 });
    const categorias = container.querySelector("#categorias")!;
    expect(h1.compareDocumentPosition(franja) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(franja.compareDocumentPosition(categorias) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("pasa categoriaActiva a Categories desde searchParams", async () => {
    const searchParams = Promise.resolve({ categoria: "curso" });
    const { container } = render(await Home({ searchParams }));
    expect(container.querySelector("#categorias")).toHaveAttribute("data-categoria-activa", "curso");
  });

  it("ignora categoria inválida en searchParams", async () => {
    const searchParams = Promise.resolve({ categoria: "invalido!" });
    const { container } = render(await Home({ searchParams }));
    expect(container.querySelector("#categorias")).toHaveAttribute("data-categoria-activa", "todos");
  });

  it("muestra el aviso corto de afiliado", async () => {
    render(await Home({ searchParams: mockSearchParams }));
    expect(screen.getByText(/sin costo extra/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Más información/ })).toHaveAttribute(
      "href",
      "/#aviso-afiliados",
    );
  });
});