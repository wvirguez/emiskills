import { describe, expect, it, vi, beforeEach } from "vitest";
import { login, logout } from "@/app/admin/login/actions";
import { getAdminEnv } from "@/lib/env";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { checkLoginAttempt, registerFailure, resetAttempts, __resetForTests } from "@/lib/auth/rate-limit";

// Mock dependencies
vi.mock("@/lib/env");
vi.mock("@/lib/auth/password");
vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/rate-limit");
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
  headers: vi.fn(() => new Headers()),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

import { headers } from "next/headers";
import { redirect } from "next/navigation";

function makeHeaders(entries: [string, string][]) {
  const h = new Headers();
  for (const [k, v] of entries) h.append(k, v);
  return h;
}

describe("login action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __resetForTests();

    vi.mocked(getAdminEnv).mockReturnValue({
      ADMIN_EMAIL: "admin@test.com",
      ADMIN_PASSWORD_HASH: "scrypt$00000000000000000000000000000000$0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      SESSION_SECRET: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    });
  });

  it("devuelve error con email inválido", async () => {
    const formData = new FormData();
    formData.set("email", "no-email");
    formData.set("password", "password123");

    const result = await login(undefined, formData);
    expect(result.error).toBe("Credenciales incorrectas.");
  });

  it("devuelve error con contraseña vacía", async () => {
    const formData = new FormData();
    formData.set("email", "admin@test.com");
    formData.set("password", "");

    const result = await login(undefined, formData);
    expect(result.error).toBe("Credenciales incorrectas.");
  });

  it("devuelve 'Credenciales incorrectas.' para email incorrecto", async () => {
    const formData = new FormData();
    formData.set("email", "wrong@test.com");
    formData.set("password", "password123");

    vi.mocked(headers).mockResolvedValue(makeHeaders([["x-forwarded-for", "192.168.1.1"]]));
    vi.mocked(checkLoginAttempt).mockReturnValue({ blocked: false });

    const result = await login(undefined, formData);
    expect(result.error).toBe("Credenciales incorrectas.");
    expect(registerFailure).toHaveBeenCalledWith("192.168.1.1");
  });

  it("devuelve 'Credenciales incorrectas.' para contraseña incorrecta", async () => {
    const formData = new FormData();
    formData.set("email", "admin@test.com");
    formData.set("password", "wrong-password");

    vi.mocked(headers).mockResolvedValue(makeHeaders([["x-forwarded-for", "192.168.1.1"]]));
    vi.mocked(checkLoginAttempt).mockReturnValue({ blocked: false });
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const result = await login(undefined, formData);
    expect(result.error).toBe("Credenciales incorrectas.");
    expect(registerFailure).toHaveBeenCalledWith("192.168.1.1");
  });

  it("devuelve 'Demasiados intentos. Inténtalo más tarde.' cuando IP está bloqueada", async () => {
    const formData = new FormData();
    formData.set("email", "admin@test.com");
    formData.set("password", "password123");

    vi.mocked(headers).mockResolvedValue(makeHeaders([["x-forwarded-for", "192.168.1.1"]]));
    vi.mocked(checkLoginAttempt).mockReturnValue({ blocked: true, retryAfterMs: 60000 });

    const result = await login(undefined, formData);
    expect(result.error).toBe("Demasiados intentos. Inténtalo más tarde.");
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it("crea sesión y redirige en login exitoso", async () => {
    const formData = new FormData();
    formData.set("email", "admin@test.com");
    formData.set("password", "correct-password");

    vi.mocked(headers).mockResolvedValue(makeHeaders([["x-forwarded-for", "192.168.1.1"]]));
    vi.mocked(checkLoginAttempt).mockReturnValue({ blocked: false });
    vi.mocked(verifyPassword).mockResolvedValue(true);

    await expect(login(undefined, formData)).rejects.toThrow("NEXT_REDIRECT:/admin");
    expect(resetAttempts).toHaveBeenCalledWith("192.168.1.1");
    expect(createSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/admin");
  });
});

describe("logout action", () => {
  it("elimina sesión y redirige a /admin/login", async () => {
    await expect(logout()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(deleteSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/admin/login");
  });
});