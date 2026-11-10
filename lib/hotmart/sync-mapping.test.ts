import { describe, expect, it } from "vitest";
import { buildSlug, isSupportedCurrency, mapFormatToCategorySlug, pickMainOffer } from "./sync-mapping";
import type { HotmartOffer } from "./schemas";

const offer = (code: string, isMain: boolean): HotmartOffer => ({
  code, name: "", description: "", isMain,
  price: { value: 1, currency: "USD" }, paymentMode: null, directOfferLink: null,
});

describe("mapFormatToCategorySlug", () => {
  it.each([
    ["ONLINE_COURSE", false, "curso"],
    ["EBOOK", false, "ebook"],
    ["TEMPLATES", false, "plantilla"],
    ["COMMUNITY", false, "membresia"],
    ["EBOOK", true, "membresia"],
    ["SOFTWARE", false, "sin-categoria"],
    [null, false, "sin-categoria"],
  ])("%s (suscripción=%s) → %s", (format, sub, expected) => {
    expect(mapFormatToCategorySlug(format, sub)).toBe(expected);
  });
});

describe("pickMainOffer", () => {
  it("prefiere la principal", () => {
    expect(pickMainOffer([offer("a", false), offer("b", true)])?.code).toBe("b");
  });
  it("cae a la primera", () => {
    expect(pickMainOffer([offer("a", false), offer("b", false)])?.code).toBe("a");
  });
  it("sin ofertas → null", () => {
    expect(pickMainOffer([])).toBeNull();
  });
});

describe("buildSlug", () => {
  it("usa el slug del nombre", () => {
    expect(buildSlug("Curso de Ñandú", "1", () => false)).toBe("curso-de-nandu");
  });
  it("con colisión añade el id", () => {
    expect(buildSlug("Curso", "99", (s) => s === "curso")).toBe("curso-99");
  });
  it("nombre sin caracteres válidos usa producto-<id>", () => {
    expect(buildSlug("★★★", "7", () => false)).toBe("producto-7");
  });
});

describe("isSupportedCurrency", () => {
  it("acepta BRL y rechaza JPY", () => {
    expect(isSupportedCurrency("BRL")).toBe(true);
    expect(isSupportedCurrency("JPY")).toBe(false);
  });
});
