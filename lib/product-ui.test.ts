import { describe, it, expect } from "vitest";
import { formatLanguage, formatPrice, truncate } from "@/lib/product-ui";

describe("formatLanguage", () => {
  it("traduce códigos conocidos", () => {
    expect(formatLanguage("es")).toBe("Español");
    expect(formatLanguage("en")).toBe("Inglés");
    expect(formatLanguage("pt")).toBe("Portugués");
  });
  it("devuelve el código en mayúsculas si es desconocido", () => {
    expect(formatLanguage("fr")).toBe("FR");
  });
});

describe("formatPrice", () => {
  it("usa dos decimales y la moneda de origen", () => {
    expect(formatPrice(29, "USD")).toBe("29.00 USD");
  });
});

describe("truncate", () => {
  it("no toca textos cortos", () => {
    expect(truncate("hola", 10)).toBe("hola");
  });
  it("recorta con elipsis y respeta el máximo", () => {
    const out = truncate("a".repeat(200), 160);
    expect(out.length).toBe(160);
    expect(out.endsWith("…")).toBe(true);
  });
});
