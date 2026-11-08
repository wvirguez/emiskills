// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

const getAffiliateUrlBySlug = vi.fn();
vi.mock("@/lib/products", () => ({
  getAffiliateUrlBySlug: (...args: unknown[]) => getAffiliateUrlBySlug(...args),
}));

const createRequest = (url: string = "http://localhost/go/test-slug") =>
  new Request(url, { method: "GET" });

const createParams = (slug: string) => Promise.resolve({ slug });

describe("GET /go/[slug]", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("redirige 307 con Location correcto y cabeceras noindex/nofollow/no-store", async () => {
    getAffiliateUrlBySlug.mockResolvedValue("https://afiliado.com/curso-a");

    const response = await GET(createRequest(), { params: createParams("curso-a") });

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("https://afiliado.com/curso-a");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("devuelve 404 si el slug no existe", async () => {
    getAffiliateUrlBySlug.mockResolvedValue(null);

    const response = await GET(createRequest(), { params: createParams("inexistente") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("devuelve 404 si el producto está inactivo", async () => {
    getAffiliateUrlBySlug.mockResolvedValue(null);

    const response = await GET(createRequest(), { params: createParams("inactivo") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("devuelve 404 si la URL es javascript:", async () => {
    getAffiliateUrlBySlug.mockResolvedValue("javascript:alert(1)");

    const response = await GET(createRequest(), { params: createParams("malicioso") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("devuelve 404 si la URL está malformada", async () => {
    getAffiliateUrlBySlug.mockResolvedValue("no-es-una-url");

    const response = await GET(createRequest(), { params: createParams("malformada") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("devuelve 404 si la URL usa protocolo no permitido (ftp:)", async () => {
    getAffiliateUrlBySlug.mockResolvedValue("ftp://files.example.com/file.zip");

    const response = await GET(createRequest(), { params: createParams("ftp-url") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("devuelve 404 genérico y registra error si la BD falla", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getAffiliateUrlBySlug.mockRejectedValue(new Error("DB connection failed"));

    const response = await GET(createRequest(), { params: createParams("error-db") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[go] Error al procesar la redirección",
      expect.objectContaining({ slug: "error-db" }),
    );
    consoleSpy.mockRestore();
  });

  it("valida slug vacío via getAffiliateUrlBySlug sin consultar BD", async () => {
    getAffiliateUrlBySlug.mockResolvedValue(null);

    const response = await GET(createRequest(), { params: createParams("") });

    expect(response.status).toBe(404);
    expect(getAffiliateUrlBySlug).toHaveBeenCalledWith("");
  });
});