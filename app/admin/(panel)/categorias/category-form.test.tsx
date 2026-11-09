import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoryForm from "@/app/admin/(panel)/categorias/category-form";
import type { CategoryFormState } from "@/app/admin/(panel)/categorias/category-form";

describe("CategoryForm", () => {
  let mockAction: Mock<(state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAction = vi.fn().mockResolvedValue({ error: undefined, fieldErrors: undefined, success: undefined });
  });

  it("renderiza el campo de nombre", () => {
    render(<CategoryForm action={mockAction} isCreating={true} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("muestra vista previa del slug solo en creación", () => {
    render(<CategoryForm action={mockAction} initialName="Nueva Categoría" isCreating={true} />);
    expect(screen.getByText(/Slug:/)).toBeInTheDocument();
    expect(screen.getByText("nueva-categoria")).toBeInTheDocument();
  });

  it("no muestra vista previa del slug en edición", () => {
    render(<CategoryForm action={mockAction} initialName="Categoría Existente" isCreating={false} />);
    expect(screen.queryByText(/Slug:/)).not.toBeInTheDocument();
  });

  it("muestra error de campo devuelto por la Server Action", async () => {
    mockAction.mockResolvedValue({
      error: undefined,
      fieldErrors: { name: ["El nombre debe tener al menos 2 caracteres"] },
      success: undefined,
    });

    render(<CategoryForm action={mockAction} isCreating={true} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "a" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("El nombre debe tener al menos 2 caracteres");
    });
  });

  it("muestra error general devuelto por la Server Action", async () => {
    mockAction.mockResolvedValue({
      error: "Error al crear la categoría. Inténtalo de nuevo.",
      fieldErrors: undefined,
      success: undefined,
    });

    render(<CategoryForm action={mockAction} isCreating={true} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nueva Categoría" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Error al crear la categoría. Inténtalo de nuevo.");
      expect(alert).toHaveAttribute("aria-live", "polite");
    });
  });

  it("muestra estado de carga mientras la acción está pendiente", async () => {
    let resolveAction: (value: CategoryFormState) => void;
    const promise = new Promise<CategoryFormState>((resolve) => {
      resolveAction = resolve;
    });
    mockAction.mockReturnValue(promise);

    render(<CategoryForm action={mockAction} isCreating={true} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nueva Categoría" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(screen.getByRole("button", { name: "Creando..." })).toBeDisabled();
    expect(screen.getByLabelText("Nombre")).toBeDisabled();

    resolveAction!({ error: undefined, fieldErrors: undefined, success: true });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Crear categoría" })).not.toBeDisabled();
    });
  });

  it("muestra estado de carga en modo edición", async () => {
    let resolveAction: (value: CategoryFormState) => void;
    const promise = new Promise<CategoryFormState>((resolve) => {
      resolveAction = resolve;
    });
    mockAction.mockReturnValue(promise);

    render(<CategoryForm action={mockAction} isCreating={false} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Categoría Editada" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
    expect(screen.getByLabelText("Nombre")).toBeDisabled();

    resolveAction!({ error: undefined, fieldErrors: undefined, success: true });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Guardar cambios" })).not.toBeDisabled();
    });
  });

  it("tiene aria-invalid en el campo cuando hay error de campo", async () => {
    mockAction.mockResolvedValue({
      error: undefined,
      fieldErrors: { name: ["El nombre es requerido"] },
      success: undefined,
    });

    render(<CategoryForm action={mockAction} isCreating={true} />);
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Nombre")).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("deshabilita el formulario durante el envío", async () => {
    let resolveAction: (value: CategoryFormState) => void;
    const promise = new Promise<CategoryFormState>((resolve) => {
      resolveAction = resolve;
    });
    mockAction.mockReturnValue(promise);

    render(<CategoryForm action={mockAction} isCreating={true} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nueva Categoría" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Nombre")).toBeDisabled();
      expect(screen.getByRole("button", { name: "Creando..." })).toBeDisabled();
    });

    resolveAction!({ error: undefined, fieldErrors: undefined, success: true });
  });
});