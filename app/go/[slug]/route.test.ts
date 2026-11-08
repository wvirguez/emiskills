// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

const getAffiliateTargetBySlug = vi.fn();
const recordClick = vi.fn();

vi.mock("@/lib/products", () => ({
  getAffiliateTargetBySlug: (...args: unknown[]) => getAffiliateTargetBySlug(...args),
}));

vi.mock("@/lib/clicks", () => ({
  recordClick: (...args: unknown[]) => recordClick(...args),
}));

const createRequest = (url: string = "http://localhost/go/test-slug", headers?: Record<string, string>) => {
  const request = new Request(url, { method: "GET" });
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      request.headers.set(key, value);
    });
  }
  return request;
};

const createParams = (slug: string) => Promise.resolve({ slug });

describe("GET /go/[slug]", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("redirige 307 con Location correcto y cabeceras noindex/nofollow/no-store", async () => {
    getAffiliateTargetBySlug.mockResolvedValue({ id: 1, affiliateUrl: "https://afiliado.com/curso-a" });

    const response = await GET(createRequest(), { params: createParams("curso-a") });

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("https://afiliado.com/curso-a");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("registra el clic con productId y referer antes de redirigir", async () => {
    getAffiliateTargetBySlug.mockResolvedValue({ id: 42, affiliateUrl: "https://afiliado.com/curso-b" });
    recordClick.mockResolvedValue(undefined);

    const requestWithReferer = createRequest("http://localhost/go/curso-b", { referer: "https://origen.com/pagina" });
    const response = await GET(requestWithReferer, { params: createParams("curso-b") });

    expect(response.status).toBe(307);
    expect(recordClick).toHaveBeenCalledWith({
      productId: 42,
      referer: "https://origen.com/pagina",
    });
  });

  it("registra el clic con referer null cuando no hay cabecera referer", async () => {
    getAffiliateTargetBySlug.mockResolvedValue({ id: 7, affiliateUrl: "https://afiliado.com/curso-c" });
    recordClick.mockResolvedValue(undefined);

    const response = await GET(createRequest(), { params: createParams("curso-c") });

    expect(response.status).toBe(307);
    expect(recordClick).toHaveBeenCalledWith({
      productId: 7,
      referer: null,
    });
  });

  it("registra error si recordClick falla pero continúa con la redirección", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getAffiliateTargetBySlug.mockResolvedValue({ id: 99, affiliateUrl: "https://afiliado.com/curso-d" });
    recordClick.mockRejectedValue(new Error("DB write failed"));

    const response = await GET(createRequest(), { params: createParams("curso-d") });

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe("https://afiliado.com/curso-d");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[go] No se pudo registrar el clic",
      expect.objectContaining({ slug: "curso-d" }),
    );
    consoleSpy.mockRestore();
  });

  it("devuelve 404 si el slug no existe", async () => {
    getAffiliateTargetBySlug.mockResolvedValue(null);

    const response = await GET(createRequest(), { params: createParams("inexistente") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("devuelve 404 si el producto está inactivo", async () => {
    getAffiliateTargetBySlug.mockResolvedValue(null);

    const response = await GET(createRequest(), { params: createParams("inactivo") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("devuelve 404 si la URL es javascript:", async () => {
    getAffiliateTargetBySlug.mockResolvedValue({ id: 1, affiliateUrl: "javascript:alert(1)" });

    const response = await GET(createRequest(), { params: createParams("malicioso") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("devuelve 404 si la URL está malformada", async () => {
    getAffiliateTargetBySlug.mockResolvedValue({ id: 1, affiliateUrl: "no-es-una-url" });

    const response = await GET(createRequest(), { params: createParams("malformada") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("devuelve 404 si la URL usa protocolo no permitido (ftp:)", async () => {
    getAffiliateTargetBySlug.mockResolvedValue({ id: 1, affiliateUrl: "ftp://files.example.com/file.zip" });

    const response = await GET(createRequest(), { params: createParams("ftp-url") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("devuelve 404 genérico y registra error si la BD falla al obtener target", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getAffiliateTargetBySlug.mockRejectedValue(new Error("DB connection failed"));

    const response = await GET(createRequest(), { params: createParams("error-db") });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Producto no disponible");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[go] Error al procesar la redirección",
      expect.objectContaining({ slug: "error-db" }),
    );
    consoleSpy.mockRestore();
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("valida slug vacío via getAffiliateTargetBySlug sin consultar BD", async () => {
    getAffiliateTargetBySlug.mockResolvedValue(null);

    const response = await GET(createRequest(), { params: createParams("") });

    expect(response.status).toBe(404);
    expect(getAffiliateTargetBySlug).toHaveBeenCalledWith("");
  });
});