import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ToggleActiveButton from "@/app/admin/(panel)/productos/toggle-active-button";

describe("ToggleActiveButton", () => {
  let mockAction: Mock<(isActive: boolean, formData: FormData) => Promise<void>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAction = vi.fn().mockResolvedValue(undefined);
  });

  it("muestra 'Desactivar' cuando el producto está activo", () => {
    render(<ToggleActiveButton action={mockAction} isActive={true} productId={1} />);

    expect(screen.getByRole("button", { name: "Desactivar" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Activar" })).not.toBeInTheDocument();
  });

  it("muestra 'Activar' cuando el producto está inactivo", () => {
    render(<ToggleActiveButton action={mockAction} isActive={false} productId={1} />);

    expect(screen.getByRole("button", { name: "Activar" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Desactivar" })).not.toBeInTheDocument();
  });

  it("tiene estilos diferentes según estado activo/inactivo", () => {
    const { container: activeContainer } = render(<ToggleActiveButton action={mockAction} isActive={true} productId={1} />);
    const activeButton = activeContainer.querySelector("button");
    expect(activeButton).toHaveClass("text-gray-700");
    expect(activeButton).toHaveClass("bg-gray-100");

    const { container: inactiveContainer } = render(<ToggleActiveButton action={mockAction} isActive={false} productId={1} />);
    const inactiveButton = inactiveContainer.querySelector("button");
    expect(inactiveButton).toHaveClass("text-blue-600");
    expect(inactiveButton).toHaveClass("bg-blue-50");
  });

  it("llama a la acción con el nuevo estado al hacer clic", async () => {
    render(<ToggleActiveButton action={mockAction} isActive={true} productId={42} />);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      const [newIsActive, formData] = mockAction.mock.calls[0];
      expect(newIsActive).toBe(false);
      expect(formData.get("productId")).toBe("42");
      expect(formData.get("isActive")).toBe("false");
    });
  });

  it("llama a la acción con true al activar un producto inactivo", async () => {
    render(<ToggleActiveButton action={mockAction} isActive={false} productId={99} />);

    fireEvent.click(screen.getByRole("button", { name: "Activar" }));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      const [newIsActive] = mockAction.mock.calls[0];
      expect(newIsActive).toBe(true);
    });
  });

  it("muestra estado de carga mientras la acción está pendiente (desactivando)", async () => {
    let resolveAction: () => void;
    const promise = new Promise<void>((resolve) => {
      resolveAction = resolve;
    });
    mockAction.mockReturnValue(promise);

    render(<ToggleActiveButton action={mockAction} isActive={true} productId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    expect(screen.getByRole("button", { name: "Desactivando..." })).toBeDisabled();

    resolveAction!();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Desactivar" })).not.toBeDisabled();
    });
  });

  it("muestra estado de carga mientras la acción está pendiente (activando)", async () => {
    let resolveAction: () => void;
    const promise = new Promise<void>((resolve) => {
      resolveAction = resolve;
    });
    mockAction.mockReturnValue(promise);

    render(<ToggleActiveButton action={mockAction} isActive={false} productId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Activar" }));

    expect(screen.getByRole("button", { name: "Activando..." })).toBeDisabled();

    resolveAction!();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Activar" })).not.toBeDisabled();
    });
  });

  it("deshabilita el botón durante el envío", async () => {
    let resolveAction: () => void;
    const promise = new Promise<void>((resolve) => {
      resolveAction = resolve;
    });
    mockAction.mockReturnValue(promise);

    render(<ToggleActiveButton action={mockAction} isActive={true} productId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Desactivando..." })).toBeDisabled();
    });

    resolveAction!();
  });

  it("muestra error si la acción falla", async () => {
    mockAction.mockRejectedValue(new Error("Error de red"));

    render(<ToggleActiveButton action={mockAction} isActive={true} productId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Error de red");
    });
  });

  it("incluye productId en FormData", async () => {
    render(<ToggleActiveButton action={mockAction} isActive={true} productId={123} />);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    await waitFor(() => {
      const formData = mockAction.mock.calls[0][1] as FormData;
      expect(formData.get("productId")).toBe("123");
    });
  });

  it("con needsReview e inactivo: botón deshabilitado con explicación", () => {
    render(<ToggleActiveButton action={mockAction} isActive={false} productId={3} needsReview />);

    const button = screen.getByRole("button", { name: "Activar" });
    expect(button).toBeDisabled();
    expect(screen.getByText("Guarda tu enlace de afiliado para poder activarlo.")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-describedby", "review-hint-3");
  });

  it("con needsReview pero activo: se puede desactivar", () => {
    render(<ToggleActiveButton action={mockAction} isActive={true} productId={3} needsReview />);

    expect(screen.getByRole("button", { name: "Desactivar" })).toBeEnabled();
  });
});
