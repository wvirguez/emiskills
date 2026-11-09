import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/admin/login/login-form";
import { login } from "@/app/admin/login/actions";

vi.mock("@/app/admin/login/actions");

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(login).mockResolvedValue({ error: undefined, success: undefined });
  });

  it("renderiza campos de email y contraseña", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  it("muestra error devuelto por la Server Action", async () => {
    vi.mocked(login).mockResolvedValue({ error: "Credenciales incorrectas." });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Credenciales incorrectas.");
    });
  });

  it("muestra estado de carga mientras la acción está pendiente", async () => {
    let resolveAction: (value: { error?: string }) => void;
    const promise = new Promise<{ error?: string }>((resolve) => {
      resolveAction = resolve;
    });
    vi.mocked(login).mockReturnValue(promise);

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();

    resolveAction!({ error: undefined });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Entrar" })).not.toBeDisabled();
    });
  });

  it("deshabilita inputs mientras la acción está pendiente", async () => {
    let resolveAction: (value: { error?: string }) => void;
    const promise = new Promise<{ error?: string }>((resolve) => {
      resolveAction = resolve;
    });
    vi.mocked(login).mockReturnValue(promise);

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toBeDisabled();
      expect(screen.getByLabelText("Contraseña")).toBeDisabled();
    });

    resolveAction!({ error: undefined });
    await waitFor(() => {
      expect(screen.getByLabelText("Email")).not.toBeDisabled();
    });
  });

  it("tiene aria-live en el mensaje de error", async () => {
    vi.mocked(login).mockResolvedValue({ error: "Demasiados intentos. Inténtalo más tarde." });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "polite");
    });
  });
});