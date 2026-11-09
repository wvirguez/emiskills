import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { getCategoryById } from "@/lib/categories";
import { notFound } from "next/navigation";

vi.mock("@/lib/auth/session", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: 1 }),
}));

vi.mock("@/lib/categories", () => ({
  getCategoryById: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Import after mocks
import EditarCategoriaPage from "@/app/admin/(panel)/categorias/[id]/page";

describe("EditarCategoriaPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("llama notFound cuando el id no es un entero válido (0)", async () => {
    vi.mocked(getCategoryById).mockResolvedValue(null);

    await expect(
      EditarCategoriaPage({
        params: Promise.resolve({ id: "0" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getCategoryById).not.toHaveBeenCalled();
  });

  it("llama notFound cuando el id es negativo", async () => {
    vi.mocked(getCategoryById).mockResolvedValue(null);

    await expect(
      EditarCategoriaPage({
        params: Promise.resolve({ id: "-5" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getCategoryById).not.toHaveBeenCalled();
  });

  it("llama notFound cuando el id no es un entero", async () => {
    vi.mocked(getCategoryById).mockResolvedValue(null);

    await expect(
      EditarCategoriaPage({
        params: Promise.resolve({ id: "1.5" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getCategoryById).toHaveBeenCalledWith(1); // parseInt("1.5", 10) === 1
  });

  it("llama notFound cuando el id no es numérico", async () => {
    vi.mocked(getCategoryById).mockResolvedValue(null);

    await expect(
      EditarCategoriaPage({
        params: Promise.resolve({ id: "abc" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getCategoryById).not.toHaveBeenCalled();
  });

  it("llama notFound cuando la categoría no existe", async () => {
    vi.mocked(getCategoryById).mockResolvedValue(null);

    await expect(
      EditarCategoriaPage({
        params: Promise.resolve({ id: "999" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getCategoryById).toHaveBeenCalledWith(999);
  });

  it("renderiza el formulario de edición cuando la categoría existe", async () => {
    vi.mocked(getCategoryById).mockResolvedValue({ id: 1, slug: "cursos", name: "Cursos" });

    const page = await EditarCategoriaPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByText("Editar categoría")).toBeInTheDocument();
    expect(screen.getByText("Modifica el nombre de la categoría.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Cursos");
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it("tiene enlace para volver a categorías", async () => {
    vi.mocked(getCategoryById).mockResolvedValue({ id: 1, slug: "cursos", name: "Cursos" });

    const page = await EditarCategoriaPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByRole("link", { name: "← Volver a categorías" })).toHaveAttribute("href", "/admin/categorias");
  });

  it("tiene enlace al panel", async () => {
    vi.mocked(getCategoryById).mockResolvedValue({ id: 1, slug: "cursos", name: "Cursos" });

    const page = await EditarCategoriaPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
  });

  it("no muestra vista previa del slug en modo edición", async () => {
    vi.mocked(getCategoryById).mockResolvedValue({ id: 1, slug: "cursos", name: "Cursos" });

    const page = await EditarCategoriaPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.queryByText(/Slug:/)).not.toBeInTheDocument();
  });
});