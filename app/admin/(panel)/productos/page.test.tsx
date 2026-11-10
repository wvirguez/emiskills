import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductosPage from "@/app/admin/(panel)/productos/page";
import { listProductsForAdmin } from "@/lib/admin-products";

vi.mock("@/lib/auth/session", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: 1 }),
}));

vi.mock("./sync-action", () => ({ syncHotmartAction: vi.fn() }));

vi.mock("@/lib/admin-products", () => ({
  listProductsForAdmin: vi.fn(),
}));

describe("ProductosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza estado vacío cuando no hay productos", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.getByText("No hay productos")).toBeInTheDocument();
    expect(screen.getByText("Crea el primer producto para empezar.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crear producto" })).toBeInTheDocument();
  });

  it("renderiza tabla con productos en escritorio", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([
      {
        id: 1,
        slug: "curso-react",
        title: "Curso de React",
        category: { slug: "cursos", name: "Cursos" },
        platform: { slug: "udemy", name: "Udemy" },
        price: "29.99",
        isActive: true,
        clickCount: 5,
        isHotmart: false,
        needsReview: false,
      },
      {
        id: 2,
        slug: "libro-typescript",
        title: "Libro TypeScript",
        category: { slug: "libros", name: "Libros" },
        platform: { slug: "amazon", name: "Amazon" },
        price: "49.99",
        isActive: false,
        clickCount: 0,
        isHotmart: false,
        needsReview: false,
      },
    ]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({}),
      })
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check title links
    const titleLinks = table.querySelectorAll("a.text-blue-600.hover\\:text-blue-900.font-medium");
    expect(titleLinks).toHaveLength(2);
    expect(titleLinks[0]).toHaveAttribute("href", "/admin/productos/1");
    expect(titleLinks[0]).toHaveTextContent("Curso de React");
    expect(titleLinks[1]).toHaveAttribute("href", "/admin/productos/2");
    expect(titleLinks[1]).toHaveTextContent("Libro TypeScript");

    // Check category and platform names
    expect(table.textContent).toContain("Cursos");
    expect(table.textContent).toContain("Udemy");
    expect(table.textContent).toContain("Libros");
    expect(table.textContent).toContain("Amazon");

    // Check prices
    expect(table.textContent).toContain("29,99");
    expect(table.textContent).toContain("49,99");

    // Check click counts
    expect(table.textContent).toContain("5");
    expect(table.textContent).toContain("0");
  });

  it("renderiza tarjetas en móvil (lg:hidden)", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([
      {
        id: 1,
        slug: "curso-react",
        title: "Curso de React",
        category: { slug: "cursos", name: "Cursos" },
        platform: { slug: "udemy", name: "Udemy" },
        price: "29.99",
        isActive: true,
        clickCount: 5,
        isHotmart: false,
        needsReview: false,
      },
    ]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({}),
      })
    );

    // Mobile card view should be present (lg:hidden div)
    const mobileContainer = screen.getByText("5 clics").closest("div.lg\\:hidden") as HTMLElement;
    expect(mobileContainer).toBeInTheDocument();

    // Mobile card has the title as a link
    const mobileLink = mobileContainer.querySelector("a.text-blue-600.hover\\:text-blue-900.font-medium.text-lg");
    expect(mobileLink).toBeInTheDocument();
    expect(mobileLink).toHaveAttribute("href", "/admin/productos/1");
    expect(mobileLink).toHaveTextContent("Curso de React");

    // Slug badge
    expect(mobileContainer.querySelector("span.bg-gray-100")).toHaveTextContent("curso-react");

    // Category/Platform
    expect(mobileContainer.textContent).toContain("Cursos / Udemy");

    // Price
    expect(mobileContainer.textContent).toContain("29,99");

    // Status badge
    expect(mobileContainer.querySelector("span.bg-green-100")).toHaveTextContent("Activo");
  });

  it("muestra mensaje de éxito ok=creado", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ ok: "creado" }),
      })
    );

    expect(screen.getByText("Producto creado correctamente.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra mensaje de éxito ok=editado", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ ok: "editado" }),
      })
    );

    expect(screen.getByText("Producto actualizado correctamente.")).toBeInTheDocument();
  });

  it("muestra mensaje de éxito ok=activado", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ ok: "activado" }),
      })
    );

    expect(screen.getByText("Producto activado correctamente.")).toBeInTheDocument();
  });

  it("muestra mensaje de éxito ok=desactivado", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ ok: "desactivado" }),
      })
    );

    expect(screen.getByText("Producto desactivado correctamente.")).toBeInTheDocument();
  });

  it("muestra mensaje de éxito ok=eliminado", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ ok: "eliminado" }),
      })
    );

    expect(screen.getByText("Producto eliminado correctamente.")).toBeInTheDocument();
  });

  it("ignora valores ok inválidos", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ ok: "invalido" }),
      })
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("muestra mensaje de error has-clicks con count", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ error: "has-clicks", count: "3" }),
      })
    );

    expect(screen.getByText("No se puede eliminar: el producto tiene 3 clics registrados.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("muestra mensaje de error has-clicks en singular", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({ error: "has-clicks", count: "1" }),
      })
    );

    expect(screen.getByText("No se puede eliminar: el producto tiene 1 clic registrado.")).toBeInTheDocument();
  });

  it("tiene enlace a nuevo producto", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.getByRole("link", { name: "Nuevo producto" })).toHaveAttribute("href", "/admin/productos/nuevo");
  });

  it("tiene enlace al panel", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);

    render(
      await ProductosPage({
        searchParams: Promise.resolve({}),
      })
    );

    expect(screen.getByRole("link", { name: "Panel" })).toHaveAttribute("href", "/admin");
  });

  it("muestra el botón de sincronizar y las insignias Hotmart / Revisar enlace", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([
      {
        id: 9,
        slug: "h",
        title: "Producto Hotmart",
        category: { slug: "curso", name: "Curso" },
        platform: { slug: "hotmart", name: "Hotmart" },
        price: "10",
        isActive: false,
        clickCount: 0,
        isHotmart: true,
        needsReview: true,
      },
    ]);

    render(await ProductosPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("button", { name: "Sincronizar con Hotmart" })).toBeInTheDocument();
    expect(screen.getAllByText("Revisar enlace").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Hotmart", { selector: "span.rounded-full" }).length).toBeGreaterThan(0);
    for (const btn of screen.getAllByRole("button", { name: "Activar" })) expect(btn).toBeDisabled();
  });

  it("muestra el mensaje de error=needs-review", async () => {
    vi.mocked(listProductsForAdmin).mockResolvedValue([]);
    render(await ProductosPage({ searchParams: Promise.resolve({ error: "needs-review" }) }));
    expect(screen.getByRole("alert")).toHaveTextContent("enlace de afiliado");
  });
});
