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

describe("filtros de precio, moneda, idioma y plataforma", () => {
  it("parsea valores válidos", () => {
    expect(
      parseSearchParams({
        precioMin: "10", precioMax: "50.5", moneda: "USD", idioma: "en", plataforma: "hotmart",
      }),
    ).toMatchObject({
      precioMin: 10, precioMax: 50.5, moneda: "USD", idioma: "en", plataforma: "hotmart",
    });
  });

  it("descarta precios inválidos y formatos incorrectos", () => {
    const r = parseSearchParams({
      precioMin: "-1", precioMax: "abc", moneda: "usd", idioma: "ESP", plataforma: "A B",
    });
    expect(r.precioMin).toBeUndefined();
    expect(r.precioMax).toBeUndefined();
    expect(r.moneda).toBeUndefined();
    expect(r.idioma).toBeUndefined();
    expect(r.plataforma).toBeUndefined();
    expect(parseSearchParams({ precioMin: "1.234" }).precioMin).toBeUndefined();
  });

  it("ignora precioMax menor que precioMin y toma el primer valor de arrays", () => {
    const r = parseSearchParams({ precioMin: "50", precioMax: "10", idioma: ["es", "en"] });
    expect(r.precioMin).toBe(50);
    expect(r.precioMax).toBeUndefined();
    expect(r.idioma).toBe("es");
  });

  it("buildProductsHref conserva todos los filtros", () => {
    expect(
      buildProductsHref({
        q: "a", categoria: "curso", precioMin: 0, precioMax: 20, moneda: "USD",
        idioma: "es", plataforma: "hotmart", page: 2,
      }),
    ).toBe(
      "/productos?q=a&categoria=curso&precioMin=0&precioMax=20&moneda=USD&idioma=es&plataforma=hotmart&page=2",
    );
  });
});
