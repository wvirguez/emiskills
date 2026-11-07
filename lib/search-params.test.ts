import { describe, it, expect } from "vitest";
import { buildProductsHref, parseSearchParams } from "@/lib/search-params";

describe("parseSearchParams", () => {
  it("normaliza valores válidos", () => {
    expect(parseSearchParams({ q: "  java ", categoria: "curso", page: "2" })).toEqual({
      q: "java",
      categoria: "curso",
      page: 2,
    });
  });

  it("q vacío o con espacios → sin filtro", () => {
    expect(parseSearchParams({ q: "   " }).q).toBeUndefined();
    expect(parseSearchParams({}).q).toBeUndefined();
  });

  it("limita q a 100 caracteres", () => {
    expect(parseSearchParams({ q: "a".repeat(300) }).q).toHaveLength(100);
  });

  it("usa el primer valor de un array", () => {
    const r = parseSearchParams({ q: ["uno", "dos"], categoria: ["ebook", "curso"] });
    expect(r.q).toBe("uno");
    expect(r.categoria).toBe("ebook");
  });

  it.each(["abc", "0", "-3", "1.5", ""])("page inválido %j → 1", (page) => {
    expect(parseSearchParams({ page }).page).toBe(1);
  });

  it.each(["Curso", "a b", "../x", "x".repeat(51)])(
    "categoria con formato inválido %j → undefined",
    (categoria) => {
      expect(parseSearchParams({ categoria }).categoria).toBeUndefined();
    },
  );
});

describe("buildProductsHref", () => {
  it("sin filtros devuelve /productos", () => {
    expect(buildProductsHref({})).toBe("/productos");
    expect(buildProductsHref({ page: 1 })).toBe("/productos");
  });
  it("conserva y codifica filtros", () => {
    expect(buildProductsHref({ q: "a b&c", categoria: "ebook", page: 3 })).toBe(
      "/productos?q=a+b%26c&categoria=ebook&page=3",
    );
  });
});
