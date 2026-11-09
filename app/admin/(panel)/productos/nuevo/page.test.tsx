import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NuevoProductoPage from "@/app/admin/(panel)/productos/nuevo/page";
import { getCategories } from "@/lib/products";
import { listPlatforms } from "@/lib/admin-products";

vi.mock("@/lib/auth/session", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: 1 }),
}));

vi.mock("@/lib/products", () => ({
  getCategories: vi.fn(),
}));

vi.mock("@/lib/admin-products", () => ({
  listPlatforms: vi.fn(),
}));

describe("NuevoProductoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra error cuando no hay categorías", async () => {
    vi.mocked(getCategories).mockResolvedValue([]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    render(await NuevoProductoPage());

    expect(screen.getByText("No se puede crear un producto")).toBeInTheDocument();
    expect(screen.getByText("Necesitas tener al menos una categoría y una plataforma creadas antes de poder crear productos.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir a categorías" })).toHaveAttribute("href", "/admin/categorias");
  });

  it("muestra error cuando no hay plataformas", async () => {
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([]);

    render(await NuevoProductoPage());

    expect(screen.getByText("No se puede crear un producto")).toBeInTheDocument();
  });

  it("renderiza el formulario cuando hay categorías y plataformas", async () => {
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    render(await NuevoProductoPage());

    expect(screen.getByText("Nuevo producto")).toBeInTheDocument();
    expect(screen.getByLabelText("Título *")).toBeInTheDocument();
    expect(screen.getByLabelText("Descripción corta *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear producto" })).toBeInTheDocument();
  });

  it("tiene enlace para volver a productos", async () => {
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    render(await NuevoProductoPage());

    expect(screen.getByRole("link", { name: "← Volver a productos" })).toHaveAttribute("href", "/admin/productos");
  });

  it("tiene enlace al panel", async () => {
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    render(await NuevoProductoPage());

    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
  });
});