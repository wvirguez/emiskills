import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CategoryChips from "@/components/CategoryChips";

const cats = [
  { slug: "curso", name: "Cursos" },
  { slug: "ebook", name: "Ebooks" },
];

describe("CategoryChips", () => {
  it("enlaza cada categoría y 'Todos'", () => {
    render(<CategoryChips categories={cats} />);
    expect(screen.getByRole("link", { name: "Todos" })).toHaveAttribute("href", "/productos");
    expect(screen.getByRole("link", { name: "Ebooks" })).toHaveAttribute(
      "href",
      "/productos?categoria=ebook",
    );
    expect(screen.getByRole("link", { name: "Todos" })).toHaveAttribute("aria-current", "page");
  });

  it("marca la categoría activa y conserva q", () => {
    render(<CategoryChips categories={cats} activeSlug="curso" q="java" />);
    expect(screen.getByRole("link", { name: "Cursos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Todos" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Ebooks" })).toHaveAttribute(
      "href",
      "/productos?q=java&categoria=ebook",
    );
  });

  it("conserva los filtros nuevos al cambiar de categoría", () => {
    render(<CategoryChips categories={cats} filters={{ idioma: "es", precioMin: 5 }} />);
    expect(screen.getByRole("link", { name: "Ebooks" })).toHaveAttribute(
      "href",
      "/productos?categoria=ebook&precioMin=5&idioma=es",
    );
  });
});
