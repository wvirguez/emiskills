// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  sync: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/auth/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/hotmart/sync", async () => {
  const actual = await vi.importActual<typeof import("@/lib/hotmart/sync")>("@/lib/hotmart/sync");
  return { ...actual, syncHotmartProducts: mocks.sync };
});

import { syncHotmartAction } from "./sync-action";
import { SyncInProgressError } from "@/lib/hotmart/sync";
import { HotmartAuthError, HotmartNetworkError } from "@/lib/hotmart";

const empty = { created: 0, updated: 0, deactivated: 0, unchanged: 0, skipped: [], errors: [] };

beforeEach(() => {
  vi.resetAllMocks();
  mocks.redirect.mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  });
  mocks.verifySession.mockResolvedValue({ userId: 1 });
});

describe("syncHotmartAction", () => {
  it("sin sesión → redirige a login y no sincroniza", async () => {
    mocks.verifySession.mockResolvedValue(null);
    await expect(syncHotmartAction(undefined)).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(mocks.sync).not.toHaveBeenCalled();
  });

  it("éxito → devuelve el resumen y revalida", async () => {
    mocks.sync.mockResolvedValue({ ...empty, created: 2 });
    const res = await syncHotmartAction(undefined);
    expect(res?.result?.created).toBe(2);
    for (const path of ["/", "/productos", "/admin/productos"]) {
      expect(mocks.revalidatePath).toHaveBeenCalledWith(path);
    }
  });

  it.each([
    [new SyncInProgressError(), "en curso"],
    [new HotmartAuthError("x", 401), "credenciales"],
    [new HotmartNetworkError("x"), "conectar"],
    [new Error("Variables de entorno de Hotmart inválidas:\n  - HOTMART_CLIENT_ID: falta"), "HOTMART_CLIENT_ID"],
    [new Error("algo raro con secreto-123"), "No se pudo sincronizar"],
  ])("error → mensaje en español sin revalidar (%#)", async (error, fragment) => {
    mocks.sync.mockRejectedValue(error);
    const res = await syncHotmartAction(undefined);
    expect(res?.error).toContain(fragment);
    expect(res?.error).not.toContain("secreto-123");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
