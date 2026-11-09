import { describe, expect, it } from "vitest";
import { productSchema } from "@/app/admin/(panel)/productos/schema";

describe("productSchema", () => {
  it("valida título muy corto", () => {
    const result = productSchema.safeParse({
      title: "ab",
      shortDescription: "Descripción válida",
      description: "",
      price: "29.99",
      currency: "USD",
      language: "es",
      imageUrl: "",
      imageGradient: "",
      affiliateUrl: "https://ejemplo.com/producto",
      categoryId: "1",
      platformId: "1",
      isActive: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "title")).toBe(true);
    }
  });

  it("valida datos correctos", () => {
    const result = productSchema.safeParse({
      title: "Producto Válido",
      shortDescription: "Descripción válida",
      description: "Descripción completa",
      price: "29.99",
      currency: "USD",
      language: "es",
      imageUrl: "https://ejemplo.com/imagen.jpg",
      imageGradient: "from-violet-500 to-fuchsia-500",
      affiliateUrl: "https://ejemplo.com/producto",
      categoryId: "1",
      platformId: "1",
      isActive: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(29.99);
      expect(result.data.categoryId).toBe(1);
      expect(result.data.platformId).toBe(1);
    }
  });
});