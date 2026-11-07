import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const getCategories = vi.fn();
vi.mock("@/lib/products", () => ({ getCategories: () => getCategories() }));

import SearchCourses from "@/components/SearchCourses";

async function renderSection() {
  render(await SearchCourses());
}

describe("SearchCourses", () => {
  beforeEach(() => {
    getCategories.mockReset();
  });

  it("es un formulario GET hacia /productos con input q", async () => {
    getCategories.mockResolvedValue([{ id: 1, slug: "curso", name: "Cursos" }]);
    await renderSection();
    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("method", "get");
    expect(form.getAttribute("action")).toMatch(/^\/productos\/?$/);
    expect(screen.getByLabelText("Buscar productos")).toHaveAttribute("name", "q");
  });

  it("genera chips desde la BD", async () => {
    getCategories.mockResolvedValue([
      { id: 1, slug: "curso", name: "Cursos" },
      { id: 2, slug: "ebook", name: "Ebooks" },
    ]);
    await renderSection();
    expect(screen.getByRole("link", { name: "Ebooks" })).toHaveAttribute(
      "href",
      "/productos?categoria=ebook",
    );
  });

  it("si falla getCategories muestra solo 'Todos'", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getCategories.mockRejectedValue(new Error("db"));
    await renderSection();
    expect(screen.getByRole("link", { name: "Todos" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Cursos" })).toBeNull();
  });
});
