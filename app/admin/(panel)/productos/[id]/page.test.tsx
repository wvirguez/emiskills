import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { getProductForAdmin, listPlatforms } from "@/lib/admin-products";
import { getCategories } from "@/lib/products";
import { notFound } from "next/navigation";

vi.mock("@/lib/auth/session", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: 1 }),
}));

vi.mock("@/lib/admin-products", () => ({
  getProductForAdmin: vi.fn(),
  listPlatforms: vi.fn(),
}));

vi.mock("@/lib/products", () => ({
  getCategories: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Import after mocks
import EditarProductoPage from "@/app/admin/(panel)/productos/[id]/page";

describe("EditarProductoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("llama notFound cuando el id no es un entero válido (0)", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue(null);

    await expect(
      EditarProductoPage({
        params: Promise.resolve({ id: "0" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getProductForAdmin).not.toHaveBeenCalled();
  });

  it("llama notFound cuando el id es negativo", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue(null);

    await expect(
      EditarProductoPage({
        params: Promise.resolve({ id: "-5" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getProductForAdmin).not.toHaveBeenCalled();
  });

  it("llama notFound cuando el id no es un entero", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue(null);

    await expect(
      EditarProductoPage({
        params: Promise.resolve({ id: "1.5" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getProductForAdmin).toHaveBeenCalledWith(1); // parseInt("1.5", 10) === 1
  });

  it("llama notFound cuando el id no es numérico", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue(null);

    await expect(
      EditarProductoPage({
        params: Promise.resolve({ id: "abc" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getProductForAdmin).not.toHaveBeenCalled();
  });

  it("llama notFound cuando el producto no existe", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue(null);

    await expect(
      EditarProductoPage({
        params: Promise.resolve({ id: "999" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    expect(getProductForAdmin).toHaveBeenCalledWith(999);
  });

  it("renderiza el formulario de edición cuando el producto existe", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1,
      slug: "curso-react",
      title: "Curso de React",
      shortDescription: "Aprende React",
      description: "Descripción completa",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto?ref=123",
      isActive: true,
      categoryId: 1,
      platformId: 1,
      clickCount: 5,
      createdAt: new Date(),
      needsReview: false,
      externalId: null,
      updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    const page = await EditarProductoPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByText("Editar producto")).toBeInTheDocument();
    expect(screen.getByText("Modifica los datos del producto.")).toBeInTheDocument();
    expect(screen.getByLabelText("Título *")).toHaveValue("Curso de React");
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it.each([
    [true, true],
    [false, false],
  ])("needsReview=%s → aviso de enlace de Hotmart visible=%s", async (needsReview, visible) => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1, slug: "h", title: "Producto Hotmart", shortDescription: "x", description: null,
      price: 10, currency: "BRL", language: "es", imageUrl: null,
      imageGradient: "from-violet-500 to-fuchsia-500", affiliateUrl: "https://pay.hotmart.com/X",
      isActive: false, categoryId: 1, platformId: 1, clickCount: 0,
      createdAt: new Date(), needsReview, externalId: "1", updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "hotmart", name: "Hotmart" }]);

    render(await EditarProductoPage({ params: Promise.resolve({ id: "1" }) }));

    const note = screen.queryByRole("note");
    if (visible) expect(note).toHaveTextContent("no de afiliado");
    else expect(note).not.toBeInTheDocument();
  });

  it("tiene enlace para volver a productos", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1,
      slug: "curso-react",
      title: "Curso de React",
      shortDescription: "Aprende React",
      description: "Descripción completa",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto?ref=123",
      isActive: true,
      categoryId: 1,
      platformId: 1,
      clickCount: 5,
      createdAt: new Date(),
      needsReview: false,
      externalId: null,
      updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    const page = await EditarProductoPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByRole("link", { name: "← Volver a productos" })).toHaveAttribute("href", "/admin/productos");
  });

  it("tiene enlace al panel", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1,
      slug: "curso-react",
      title: "Curso de React",
      shortDescription: "Aprende React",
      description: "Descripción completa",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto?ref=123",
      isActive: true,
      categoryId: 1,
      platformId: 1,
      clickCount: 5,
      createdAt: new Date(),
      needsReview: false,
      externalId: null,
      updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    const page = await EditarProductoPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
  });

  it("no muestra vista previa del slug en modo edición", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1,
      slug: "curso-react",
      title: "Curso de React",
      shortDescription: "Aprende React",
      description: "Descripción completa",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto?ref=123",
      isActive: true,
      categoryId: 1,
      platformId: 1,
      clickCount: 5,
      createdAt: new Date(),
      needsReview: false,
      externalId: null,
      updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    const page = await EditarProductoPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.queryByText(/Slug:/)).not.toBeInTheDocument();
  });

  it("muestra botones de activar/desactivar y eliminar", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1,
      slug: "curso-react",
      title: "Curso de React",
      shortDescription: "Aprende React",
      description: "Descripción completa",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto?ref=123",
      isActive: true,
      categoryId: 1,
      platformId: 1,
      clickCount: 5,
      createdAt: new Date(),
      needsReview: false,
      externalId: null,
      updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    const page = await EditarProductoPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByRole("button", { name: "Desactivar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
  });

  it("muestra mensaje de que el slug no se modifica", async () => {
    vi.mocked(getProductForAdmin).mockResolvedValue({
      id: 1,
      slug: "curso-react",
      title: "Curso de React",
      shortDescription: "Aprende React",
      description: "Descripción completa",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto?ref=123",
      isActive: true,
      categoryId: 1,
      platformId: 1,
      clickCount: 5,
      createdAt: new Date(),
      needsReview: false,
      externalId: null,
      updatedAt: new Date(),
    });
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, slug: "cursos", name: "Cursos" }]);
    vi.mocked(listPlatforms).mockResolvedValue([{ id: 1, slug: "udemy", name: "Udemy" }]);

    const page = await EditarProductoPage({
      params: Promise.resolve({ id: "1" }),
    });
    render(page);

    expect(screen.getByText("El slug (curso-react) no se modifica al editar el producto.")).toBeInTheDocument();
  });
});