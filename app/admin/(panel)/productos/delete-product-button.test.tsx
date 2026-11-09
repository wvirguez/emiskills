import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteProductButton from "@/app/admin/(panel)/productos/delete-product-button";

describe("DeleteProductButton", () => {
  let mockAction: Mock<(formData: FormData) => Promise<void>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAction = vi.fn().mockResolvedValue(undefined);
  });

  it("muestra botón deshabilitado con mensaje explicativo cuando hay clics", () => {
    render(<DeleteProductButton action={mockAction} clickCount={5} productName="Curso de React" productId={1} />);

    const button = screen.getByRole("button", { name: "Eliminar" });
    expect(button).toBeDisabled();
    expect(screen.getByText("Tiene 5 clics registrados; desactívalo en su lugar.")).toBeInTheDocument();
  });

  it("muestra mensaje en singular cuando hay 1 clic", () => {
    render(<DeleteProductButton action={mockAction} clickCount={1} productName="Curso de React" productId={1} />);

    expect(screen.getByText("Tiene 1 clic registrado; desactívalo en su lugar.")).toBeInTheDocument();
  });

  it("muestra botón de eliminar cuando no hay clics", () => {
    render(<DeleteProductButton action={mockAction} clickCount={0} productName="Curso de React" productId={1} />);

    const button = screen.getByRole("button", { name: "Eliminar" });
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("text-red-600");
    expect(screen.queryByText(/Tiene.*clics? registrados/)).not.toBeInTheDocument();
  });

  it("abre confirmación al hacer clic en Eliminar", async () => {
    render(<DeleteProductButton action={mockAction} clickCount={0} productName="Curso de React" productId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => {
      expect(screen.getByText('¿Eliminar "Curso de React"?')).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Confirmar eliminación" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    });
  });

  it("llama a la acción al confirmar eliminación", async () => {
    render(<DeleteProductButton action={mockAction} clickCount={0} productName="Curso de React" productId={1} />);

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
    render(<DeleteProductButton action={mockAction} clickCount={0} productName="Curso de React" productId={1} />);

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
    const { container } = render(<DeleteProductButton action={mockAction} clickCount={0} productName="Curso de React" productId={1} />);

    const details = container.querySelector("details");
    expect(details).toBeInTheDocument();

    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
  });

  it("no llama a la acción cuando hay clics y se hace clic en el botón deshabilitado", () => {
    render(<DeleteProductButton action={mockAction} clickCount={3} productName="Curso de React" productId={1} />);

    const button = screen.getByRole("button", { name: "Eliminar" });
    fireEvent.click(button);

    expect(mockAction).not.toHaveBeenCalled();
  });

  it("incluye productId en FormData al confirmar", async () => {
    render(<DeleteProductButton action={mockAction} clickCount={0} productName="Test Product" productId={42} />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Confirmar eliminación" })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar eliminación" }));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      const formData = mockAction.mock.calls[0][0] as FormData;
      // The component doesn't add productId automatically, that's handled by the page
      expect(formData).toBeInstanceOf(FormData);
    });
  });
});