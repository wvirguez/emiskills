import { describe, expect, it } from "vitest";
import { formatSummary, formatSyncResult } from "./summary";
import type { HotmartOffer, HotmartProduct } from "./schemas";

const product = (id: number): HotmartProduct => ({
  id, ucode: `u${id}`, name: `Producto ${id}`, status: "ACTIVE", format: "EBOOK",
  isSubscription: false, warrantyPeriod: 7, createdAt: null,
});
const offer: HotmartOffer = {
  code: "abc", name: "", description: "", isMain: true,
  price: { value: 10, currency: "BRL" }, paymentMode: "PAY_IN_FULL", directOfferLink: null,
};

describe("formatSummary", () => {
  it("muestra conteo, máximo 5 productos y ofertas", () => {
    const out = formatSummary([1, 2, 3, 4, 5, 6, 7].map(product), [offer]);
    expect(out).toContain("Productos encontrados: 7");
    expect(out).toContain("#5 Producto 5");
    expect(out).not.toContain("#6 Producto 6");
    expect(out).toContain("abc (principal): 10 BRL");
  });
  it("sin productos no muestra ofertas", () => {
    const out = formatSummary([], []);
    expect(out).toContain("Productos encontrados: 0");
    expect(out).not.toContain("Ofertas");
  });
});

describe("formatSyncResult", () => {
  it("muestra conteos, aviso de enlace, omitidos y errores", () => {
    const out = formatSyncResult({
      created: 1, updated: 2, deactivated: 3, unchanged: 4,
      skipped: [{ id: 5, name: "X", reason: "Sin ofertas en Hotmart" }],
      errors: [{ id: 6, message: "boom" }],
    });
    expect(out).toContain("Creados: 1 · Actualizados: 2 · Desactivados: 3 · Sin cambios: 4");
    expect(out).toContain("enlace de afiliado");
    expect(out).toContain("#5 X: Sin ofertas en Hotmart");
    expect(out).toContain("#6: boom");
  });
  it("sin creados no muestra el aviso", () => {
    const out = formatSyncResult({ created: 0, updated: 0, deactivated: 0, unchanged: 1, skipped: [], errors: [] });
    expect(out).not.toContain("enlace de afiliado");
  });
});
