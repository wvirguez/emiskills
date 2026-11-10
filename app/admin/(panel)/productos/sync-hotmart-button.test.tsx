import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SyncHotmartButton from "./sync-hotmart-button";
import type { SyncActionState } from "./sync-action";

const result = (over: Partial<NonNullable<SyncActionState>["result"]> = {}) => ({
  created: 0, updated: 0, deactivated: 0, unchanged: 0, skipped: [], errors: [], ...over,
});

describe("SyncHotmartButton", () => {
  it("muestra estado pendiente mientras sincroniza", async () => {
    let resolve: (v: SyncActionState) => void = () => {};
    const action = vi.fn(() => new Promise<SyncActionState>((r) => (resolve = r)));
    render(<SyncHotmartButton action={action} />);

    fireEvent.click(screen.getByRole("button", { name: "Sincronizar con Hotmart" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Sincronizando..." })).toBeDisabled());
    resolve({ result: result() });
    await waitFor(() => expect(screen.getByRole("button", { name: "Sincronizar con Hotmart" })).toBeEnabled());
  });

  it("muestra el resumen con aviso de enlace, omitidos y errores", async () => {
    const action = vi.fn().mockResolvedValue({
      result: result({
        created: 2, updated: 1, deactivated: 3, unchanged: 4,
        skipped: [{ id: 5, name: "Sin precio", reason: "Sin ofertas en Hotmart" }],
        errors: [{ id: 6, message: "boom" }],
      }),
    });
    render(<SyncHotmartButton action={action} />);
    fireEvent.click(screen.getByRole("button", { name: "Sincronizar con Hotmart" }));

    expect(await screen.findByText(/Creados: 2 · Actualizados: 1 · Desactivados: 3 · Sin cambios: 4/)).toBeInTheDocument();
    expect(screen.getByText(/no de afiliado/)).toBeInTheDocument();
    expect(screen.getByText("Sin precio: Sin ofertas en Hotmart")).toBeInTheDocument();
    expect(screen.getByText("#6: boom")).toBeInTheDocument();
  });

  it("sin productos nuevos no muestra el aviso de enlace", async () => {
    render(<SyncHotmartButton action={vi.fn().mockResolvedValue({ result: result({ unchanged: 1 }) })} />);
    fireEvent.click(screen.getByRole("button", { name: "Sincronizar con Hotmart" }));
    await screen.findByText(/Creados: 0/);
    expect(screen.queryByText(/no de afiliado/)).not.toBeInTheDocument();
  });

  it("muestra el error con role=alert", async () => {
    render(<SyncHotmartButton action={vi.fn().mockResolvedValue({ error: "Hotmart rechazó las credenciales." })} />);
    fireEvent.click(screen.getByRole("button", { name: "Sincronizar con Hotmart" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Hotmart rechazó las credenciales.");
  });
});
