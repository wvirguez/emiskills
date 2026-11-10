import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/session-token";
import { proxy } from "@/proxy";

vi.mock("@/lib/auth/session-token");

function makeRequest(url: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) {
    headers.set("Cookie", cookie);
  }
  return new NextRequest(url, { headers });
}

describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige /admin a /admin/login sin cookie válida", async () => {
    vi.mocked(verifySessionToken).mockReturnValue(null);

    const request = makeRequest("http://localhost/admin");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("http://localhost/admin/login");
    expect(response.headers.get("location")).toContain("redirect=%2Fadmin");
  });

  it("permite acceso a /admin con cookie válida", async () => {
    vi.mocked(verifySessionToken).mockReturnValue({ sub: "admin", exp: Date.now() + 3600000 });

    const request = makeRequest("http://localhost/admin", "admin_session=valid-token");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });

  it("permite /admin/login/ (con barra final) sin sesión, sin redirigir en bucle", async () => {
    vi.mocked(verifySessionToken).mockReturnValue(null);
    const response = await proxy(makeRequest("http://localhost/admin/login/"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("sin sesión, /admin/productos/ (barra final) redirige a login", async () => {
    vi.mocked(verifySessionToken).mockReturnValue(null);
    const response = await proxy(makeRequest("http://localhost/admin/productos/"));
    expect(response.headers.get("location")).toContain("/admin/login");
    expect(response.headers.get("location")).toContain("redirect=%2Fadmin%2Fproductos");
  });

  it("permite acceso a /admin/login sin sesión", async () => {
    vi.mocked(verifySessionToken).mockReturnValue(null);

    const request = makeRequest("http://localhost/admin/login");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });

  it("redirige /admin/login a /admin si ya hay sesión válida", async () => {
    vi.mocked(verifySessionToken).mockReturnValue({ sub: "admin", exp: Date.now() + 3600000 });

    const request = makeRequest("http://localhost/admin/login", "admin_session=valid-token");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin");
  });

  it("no intercepta rutas públicas (ej. /)", async () => {
    const request = makeRequest("http://localhost/");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });

  it("redirige subrutas de /admin sin sesión (ej. /admin/panel)", async () => {
    vi.mocked(verifySessionToken).mockReturnValue(null);

    const request = makeRequest("http://localhost/admin/panel");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("http://localhost/admin/login");
    expect(response.headers.get("location")).toContain("redirect=%2Fadmin%2Fpanel");
  });

  it("redirige /admin/login con cookie inválida a /admin/login (evita loop)", async () => {
    vi.mocked(verifySessionToken).mockReturnValue(null);

    const request = makeRequest("http://localhost/admin/login", "admin_session=invalid-token");
    const response = await proxy(request);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });
});