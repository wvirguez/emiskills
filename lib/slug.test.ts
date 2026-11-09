// @vitest-environment node
import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("convierte a minúsculas", () => {
    expect(slugify("HOLA")).toBe("hola");
  });

  it("elimina tildes y diacríticos", () => {
    expect(slugify("café")).toBe("cafe");
    expect(slugify("niño")).toBe("nino");
    expect(slugify("MÁS")).toBe("mas");
    expect(slugify("útil")).toBe("util");
  });

  it("reemplaza ñ por n", () => {
    expect(slugify("niño")).toBe("nino");
    expect(slugify("ESPAÑA")).toBe("espana");
  });

  it("reemplaza espacios y símbolos por guiones", () => {
    expect(slugify("hola mundo")).toBe("hola-mundo");
    expect(slugify("hola@mundo")).toBe("hola-mundo");
    expect(slugify("hola---mundo")).toBe("hola-mundo");
  });

  it("colapsa guiones repetidos", () => {
    expect(slugify("hola--mundo")).toBe("hola-mundo");
    expect(slugify("hola---mundo")).toBe("hola-mundo");
  });

  it("recorta guiones de los extremos", () => {
    expect(slugify("-hola")).toBe("hola");
    expect(slugify("hola-")).toBe("hola");
    expect(slugify("--hola--")).toBe("hola");
    expect(slugify("@@hola@@")).toBe("hola");
  });

  it("limita a 50 caracteres", () => {
    const long = "a".repeat(60);
    expect(slugify(long)).toHaveLength(50);
    expect(slugify(long)).toBe("a".repeat(50));
  });

  it("recorta guion final tras truncar a 50", () => {
    // 50 'a's + guion + 'b' -> debería truncar a 50 y quitar el guion final
    const input = "a".repeat(50) + "-b";
    expect(slugify(input)).toBe("a".repeat(50));
  });

  it("devuelve string vacío si el nombre queda vacío tras normalizar", () => {
    expect(slugify("")).toBe("");
    expect(slugify("@@@")).toBe("");
    expect(slugify("---")).toBe("");
    expect(slugify("   ")).toBe("");
  });

  it("maneja números correctamente", () => {
    expect(slugify("Curso 101")).toBe("curso-101");
    expect(slugify("v2.0")).toBe("v2-0");
  });

  it("maneja combinaciones complejas", () => {
    expect(slugify("Curso de JavaScript: ¡Avanzado!")).toBe("curso-de-javascript-avanzado");
    expect(slugify("Niño & Niña")).toBe("nino-nina");
  });
});