import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteCategoryButton from "@/app/admin/(panel)/categorias/delete-category-button";

describe("DeleteCategoryButton", () => {
  let mockAction: Mock<(formData: FormData) => Promise<void>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAction = vi.fn().mockResolvedValue(undefined);
  });

  it("muestra botón deshabilitado con mensaje explicativo cuando hay productos", () => {
    render(<DeleteCategoryButton action={mockAction} productCount={3} categoryName="Cursos" />);

    const button = screen.getByRole("button", { name: "Eliminar" });
    expect(button).toBeDisabled();
    expect(screen.getByText("No se puede eliminar: la categoría tiene 3 productos asociados.")).toBeInTheDocument();
  });

  it("muestra mensaje en singular cuando hay 1 producto", () => {
    render(<DeleteCategoryButton action={mockAction} productCount={1} categoryName="Cursos" />);

    expect(screen.getByText("No se puede eliminar: la categoría tiene 1 producto asociado.")).toBeInTheDocument();
  });

  it("muestra botón de eliminar cuando no hay productos", () => {
    render(<DeleteCategoryButton action={mockAction} productCount={0} categoryName="Cursos" />);

    const button = screen.getByRole("button", { name: "Eliminar" });
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("text-red-600");
    expect(screen.queryByText(/No se puede eliminar/)).not.toBeInTheDocument();
  });

  it("abre confirmación al hacer clic en Eliminar", async () => {
    render(<DeleteCategoryButton action={mockAction} productCount={0} categoryName="Cursos" />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => {
      expect(screen.getByText('¿Eliminar "Cursos"?')).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Confirmar eliminación" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    });
  });

  it("llama a la acción al confirmar eliminación", async () => {
    render(<DeleteCategoryButton action={mockAction} productCount={0} categoryName="Cursos" />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Confirmar eliminación" })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar eliminación" }));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      const formData = mockAction.mock.calls[0][0];
      expect(formData).toBeInstanceOf(FormData);
    });
  });

  it("cierra confirmación al hacer clic en Cancelar", async () => {
    render(<DeleteCategoryButton action={mockAction} productCount={0} categoryName="Cursos" />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    await waitFor(() => {
      const details = screen.getByTestId("delete-confirmation");
      expect(details).toHaveAttribute("open");
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      const details = screen.getByTestId("delete-confirmation");
      expect(details).not.toHaveAttribute("open");
    });
    expect(mockAction).not.toHaveBeenCalled();
  });

  it("funciona sin JavaScript (usa details/summary nativo)", () => {
    const { container } = render(<DeleteCategoryButton action={mockAction} productCount={0} categoryName="Cursos" />);

    const details = container.querySelector("details");
    expect(details).toBeInTheDocument();

    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
  });

  it("no llama a la acción cuando hay productos y se hace clic en el botón deshabilitado", () => {
    render(<DeleteCategoryButton action={mockAction} productCount={2} categoryName="Cursos" />);

    const button = screen.getByRole("button", { name: "Eliminar" });
    fireEvent.click(button);

    expect(mockAction).not.toHaveBeenCalled();
  });
});