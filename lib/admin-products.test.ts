// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@/generated/prisma/client";

const mocks = vi.hoisted(() => ({
  productFindMany: vi.fn(),
  productFindUnique: vi.fn(),
  productCreate: vi.fn(),
  productUpdate: vi.fn(),
  productDelete: vi.fn(),
  productCount: vi.fn(),
  categoryFindUnique: vi.fn(),
  platformFindUnique: vi.fn(),
  clickCount: vi.fn(),
  categoryFindMany: vi.fn(),
  platformFindMany: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    product: {
      findMany: mocks.productFindMany,
      findUnique: mocks.productFindUnique,
      create: mocks.productCreate,
      update: mocks.productUpdate,
      delete: mocks.productDelete,
      count: mocks.productCount,
    },
    category: {
      findUnique: mocks.categoryFindUnique,
      findMany: mocks.categoryFindMany,
    },
    platform: {
      findUnique: mocks.platformFindUnique,
      findMany: mocks.platformFindMany,
    },
    click: {
      count: mocks.clickCount,
    },
  },
}));

import {
  listProductsForAdmin,
  getProductForAdmin,
  listPlatforms,
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
} from "@/lib/admin-products";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("listProductsForAdmin", () => {
  it("devuelve productos con sus relaciones ordenados por createdAt desc", async () => {
    const now = new Date();
    mocks.productFindMany.mockResolvedValue([
      {
        id: 1,
        slug: "producto-1",
        title: "Producto 1",
        shortDescription: "Desc 1",
        description: null,
        price: 100,
        currency: "USD",
        language: "es",
        imageUrl: null,
        imageGradient: "from-violet-500 to-fuchsia-500",
        affiliateUrl: "https://example.com/1",
        isActive: true,
        categoryId: 1,
        platformId: 1,
        _count: { clicks: 5 },
        createdAt: new Date(now.getTime() + 1000),
        updatedAt: now,
        category: { slug: "cat1", name: "Categoría 1" },
        platform: { slug: "plat1", name: "Plataforma 1" },
      },
      {
        id: 2,
        slug: "producto-2",
        title: "Producto 2",
        shortDescription: "Desc 2",
        description: "Desc larga",
        price: 200,
        currency: "EUR",
        language: "en",
        imageUrl: "https://img.com/2.jpg",
        imageGradient: "from-blue-500 to-cyan-500",
        affiliateUrl: "https://example.com/2",
        isActive: false,
        categoryId: 2,
        platformId: 2,
        _count: { clicks: 0 },
        createdAt: now,
        updatedAt: now,
        category: { slug: "cat2", name: "Categoría 2" },
        platform: { slug: "plat2", name: "Plataforma 2" },
      },
    ]);

    const res = await listProductsForAdmin();

    expect(res).toEqual([
      {
        id: 1,
        slug: "producto-1",
        title: "Producto 1",
        category: { slug: "cat1", name: "Categoría 1" },
        platform: { slug: "plat1", name: "Plataforma 1" },
        price: "100",
        isActive: true,
        clickCount: 5,
      },
      {
        id: 2,
        slug: "producto-2",
        title: "Producto 2",
        category: { slug: "cat2", name: "Categoría 2" },
        platform: { slug: "plat2", name: "Plataforma 2" },
        price: "200",
        isActive: false,
        clickCount: 0,
      },
    ]);
    expect(mocks.productFindMany.mock.calls[0][0]).toEqual({
      select: expect.objectContaining({
        id: true,
        slug: true,
        title: true,
        _count: { select: { clicks: true } },
        category: { select: { slug: true, name: true } },
        platform: { select: { slug: true, name: true } },
      }),
      orderBy: { createdAt: "desc" },
    });
  });

  it("devuelve array vacío si no hay productos", async () => {
    mocks.productFindMany.mockResolvedValue([]);
    expect(await listProductsForAdmin()).toEqual([]);
  });
});

describe("getProductForAdmin", () => {
  it("devuelve el producto con todos los campos si existe", async () => {
    const now = new Date();
    mocks.productFindUnique.mockResolvedValue({
      id: 1,
      slug: "mi-producto",
      title: "Mi Producto",
      shortDescription: "Desc corta",
      description: "Desc larga",
      price: 99.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://img.com/p.jpg",
      imageGradient: "from-emerald-500 to-teal-500",
      affiliateUrl: "https://aff.com/p",
      isActive: true,
      categoryId: 1,
      platformId: 2,
      _count: { clicks: 10 },
      createdAt: now,
      updatedAt: now,
      category: { slug: "cat1", name: "Cat 1" },
      platform: { slug: "plat2", name: "Plat 2" },
    });

    const res = await getProductForAdmin(1);

    expect(res).toEqual({
      id: 1,
      slug: "mi-producto",
      title: "Mi Producto",
      shortDescription: "Desc corta",
      description: "Desc larga",
      price: 99.99,
      currency: "USD",
      language: "es",
      imageUrl: "https://img.com/p.jpg",
      imageGradient: "from-emerald-500 to-teal-500",
      affiliateUrl: "https://aff.com/p",
      isActive: true,
      categoryId: 1,
      platformId: 2,
      clickCount: 10,
      createdAt: now,
      updatedAt: now,
    });
    expect(mocks.productFindUnique.mock.calls[0][0]).toEqual({
      where: { id: 1 },
      select: expect.any(Object),
    });
  });

  it("devuelve null si no existe", async () => {
    mocks.productFindUnique.mockResolvedValue(null);
    expect(await getProductForAdmin(999)).toBeNull();
  });

  it("devuelve null con id inválido (0)", async () => {
    expect(await getProductForAdmin(0)).toBeNull();
    expect(mocks.productFindUnique).not.toHaveBeenCalled();
  });

  it("devuelve null con id negativo", async () => {
    expect(await getProductForAdmin(-5)).toBeNull();
    expect(mocks.productFindUnique).not.toHaveBeenCalled();
  });

  it("devuelve null con id no entero", async () => {
    expect(await getProductForAdmin(1.5)).toBeNull();
    expect(mocks.productFindUnique).not.toHaveBeenCalled();
  });
});

describe("listPlatforms", () => {
  it("delega a getPlatforms de lib/products", async () => {
    mocks.platformFindMany.mockResolvedValue([
      { id: 1, slug: "web", name: "Web" },
      { id: 2, slug: "mobile", name: "Mobile" },
    ]);

    const res = await listPlatforms();

    expect(res).toEqual([
      { id: 1, slug: "web", name: "Web" },
      { id: 2, slug: "mobile", name: "Mobile" },
    ]);
    expect(mocks.platformFindMany).toHaveBeenCalledWith({
      select: { id: true, slug: true, name: true },
      orderBy: { name: "asc" },
    });
  });
});

describe("createProduct", () => {
  const validInput = {
    title: "Nuevo Producto",
    shortDescription: "Descripción corta",
    description: "Descripción larga",
    price: 150,
    currency: "USD" as const,
    language: "es" as const,
    imageUrl: "https://img.com/p.jpg",
    imageGradient: "from-violet-500 to-fuchsia-500" as const,
    affiliateUrl: "https://aff.com/p",
    categoryId: 1,
    platformId: 2,
  };

  it("crea el producto derivando el slug del título", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    mocks.productCreate.mockResolvedValue({ id: 10, slug: "nuevo-producto" });

    const res = await createProduct(validInput);

    expect(res).toEqual({ ok: true, product: { id: 10, slug: "nuevo-producto" } });
    expect(mocks.productCreate.mock.calls[0][0]).toEqual({
      data: {
        title: "Nuevo Producto",
        slug: "nuevo-producto",
        shortDescription: "Descripción corta",
        description: "Descripción larga",
        price: 150,
        currency: "USD",
        language: "es",
        imageUrl: "https://img.com/p.jpg",
        imageGradient: "from-violet-500 to-fuchsia-500",
        affiliateUrl: "https://aff.com/p",
        isActive: true,
        categoryId: 1,
        platformId: 2,
      },
      select: { id: true, slug: true },
    });
  });

  it("recorta espacios del título y descripción corta", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    mocks.productCreate.mockResolvedValue({ id: 10, slug: "producto" });

    const res = await createProduct({ ...validInput, title: "  Producto  ", shortDescription: "  Desc  " });

    expect(res.ok).toBe(true);
    expect(mocks.productCreate.mock.calls[0][0].data.title).toBe("Producto");
    expect(mocks.productCreate.mock.calls[0][0].data.shortDescription).toBe("Desc");
  });

  it("usa el degradado por defecto si no se proporciona", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    mocks.productCreate.mockResolvedValue({ id: 10, slug: "producto" });

    await createProduct({ ...validInput, imageGradient: undefined });

    expect(mocks.productCreate.mock.calls[0][0].data.imageGradient).toBe("from-violet-500 to-fuchsia-500");
  });

  it("usa imageUrl null si no se proporciona", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    mocks.productCreate.mockResolvedValue({ id: 10, slug: "producto" });

    await createProduct({ ...validInput, imageUrl: undefined });

    expect(mocks.productCreate.mock.calls[0][0].data.imageUrl).toBeNull();
  });

  it("devuelve slug-exists si el slug ya existe (P2002)", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "1.0.0",
      meta: { target: ["slug"] },
    });
    mocks.productCreate.mockRejectedValue(error);

    const res = await createProduct(validInput);

    expect(res).toEqual({ ok: false, error: "slug-exists" });
  });

  it("devuelve invalid-category si categoryId no existe", async () => {
    mocks.categoryFindUnique.mockResolvedValue(null);
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });

    const res = await createProduct(validInput);

    expect(res).toEqual({ ok: false, error: "invalid-category" });
    expect(mocks.productCreate).not.toHaveBeenCalled();
  });

  it("devuelve invalid-platform si platformId no existe", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue(null);

    const res = await createProduct(validInput);

    expect(res).toEqual({ ok: false, error: "invalid-platform" });
    expect(mocks.productCreate).not.toHaveBeenCalled();
  });

  it("devuelve invalid-category si P2003 en categoryId", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
      code: "P2003",
      clientVersion: "1.0.0",
      meta: { field_name: "categoryId" },
    });
    mocks.productCreate.mockRejectedValue(error);

    const res = await createProduct(validInput);

    expect(res).toEqual({ ok: false, error: "invalid-category" });
  });

  it("devuelve invalid-platform si P2003 en platformId", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
      code: "P2003",
      clientVersion: "1.0.0",
      meta: { field_name: "platformId" },
    });
    mocks.productCreate.mockRejectedValue(error);

    const res = await createProduct(validInput);

    expect(res).toEqual({ ok: false, error: "invalid-platform" });
  });

  it("propaga otros errores de Prisma (P2002 en otro campo)", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1 });
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2002",
      clientVersion: "1.0.0",
      meta: { target: ["other_field"] },
    });
    mocks.productCreate.mockRejectedValue(error);

    await expect(createProduct(validInput)).rejects.toThrow();
  });

  it("devuelve slug-exists si el título genera slug vacío", async () => {
    const res = await createProduct({ ...validInput, title: "@@@" });
    expect(res).toEqual({ ok: false, error: "slug-exists" });
    expect(mocks.productCreate).not.toHaveBeenCalled();
  });
});

describe("updateProduct", () => {
  const baseRow = {
    id: 1,
    slug: "producto-original",
    title: "Producto Original",
    shortDescription: "Desc original",
    description: "Desc larga original",
    price: 100,
    currency: "USD",
    language: "es",
    imageUrl: "https://img.com/orig.jpg",
    imageGradient: "from-violet-500 to-fuchsia-500",
    affiliateUrl: "https://aff.com/orig",
    isActive: true,
    categoryId: 1,
    platformId: 1,
    _count: { clicks: 5 },
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { slug: "cat1", name: "Cat 1" },
    platform: { slug: "plat1", name: "Plat 1" },
  };

  it("actualiza los campos proporcionados (no toca el slug)", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 2 });
    mocks.productUpdate.mockResolvedValue({
      ...baseRow,
      title: "Nuevo Título",
      price: 200,
      currency: "EUR",
      categoryId: 2,
      category: { slug: "cat2", name: "Cat 2" },
    });

    const res = await updateProduct(1, { title: "Nuevo Título", price: 200, currency: "EUR", categoryId: 2 });

    expect(res).toEqual({
      ok: true,
      product: expect.objectContaining({
        id: 1,
        slug: "producto-original", // slug no cambia
        title: "Nuevo Título",
        price: 200,
        currency: "EUR",
        categoryId: 2,
      }),
    });
    expect(mocks.productUpdate.mock.calls[0][0]).toEqual({
      where: { id: 1 },
      data: expect.objectContaining({
        title: "Nuevo Título",
        price: 200,
        currency: "EUR",
        category: { connect: { id: 2 } },
      }),
      select: expect.any(Object),
    });
  });

  it("recorta espacios del título y descripción corta", async () => {
    mocks.productUpdate.mockResolvedValue({ ...baseRow, title: "Título", shortDescription: "Desc" });

    const res = await updateProduct(1, { title: "  Título  ", shortDescription: "  Desc  " });

    expect(res.ok).toBe(true);
    expect(mocks.productUpdate.mock.calls[0][0].data.title).toBe("Título");
    expect(mocks.productUpdate.mock.calls[0][0].data.shortDescription).toBe("Desc");
  });

  it("permite establecer description a null", async () => {
    mocks.productUpdate.mockResolvedValue({ ...baseRow, description: null });

    const res = await updateProduct(1, { description: null });

    expect(res.ok).toBe(true);
    expect(mocks.productUpdate.mock.calls[0][0].data.description).toBeNull();
  });

  it("devuelve not-found si el producto no existe (P2025)", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "1.0.0",
    });
    mocks.productUpdate.mockRejectedValue(error);

    const res = await updateProduct(999, { title: "Nuevo" });

    expect(res).toEqual({ ok: false, error: "not-found" });
  });

  it("devuelve invalid-category si categoryId no existe", async () => {
    mocks.categoryFindUnique.mockResolvedValue(null);

    const res = await updateProduct(1, { categoryId: 999 });

    expect(res).toEqual({ ok: false, error: "invalid-category" });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

  it("devuelve invalid-platform si platformId no existe", async () => {
    mocks.platformFindUnique.mockResolvedValue(null);

    const res = await updateProduct(1, { platformId: 999 });

    expect(res).toEqual({ ok: false, error: "invalid-platform" });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

  it("devuelve invalid-category si P2003 en categoryId", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 2 });
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
      code: "P2003",
      clientVersion: "1.0.0",
      meta: { field_name: "categoryId" },
    });
    mocks.productUpdate.mockRejectedValue(error);

    const res = await updateProduct(1, { categoryId: 2 });

    expect(res).toEqual({ ok: false, error: "invalid-category" });
  });

  it("devuelve invalid-platform si P2003 en platformId", async () => {
    mocks.platformFindUnique.mockResolvedValue({ id: 2 });
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
      code: "P2003",
      clientVersion: "1.0.0",
      meta: { field_name: "platformId" },
    });
    mocks.productUpdate.mockRejectedValue(error);

    const res = await updateProduct(1, { platformId: 2 });

    expect(res).toEqual({ ok: false, error: "invalid-platform" });
  });

  it("propaga otros errores de Prisma", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2002",
      clientVersion: "1.0.0",
    });
    mocks.productUpdate.mockRejectedValue(error);

    await expect(updateProduct(1, { title: "Nuevo" })).rejects.toThrow();
  });

  it("devuelve not-found con id inválido (0)", async () => {
    const res = await updateProduct(0, { title: "Nuevo" });
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id negativo", async () => {
    const res = await updateProduct(-5, { title: "Nuevo" });
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });
});

describe("setProductActive", () => {
  it("activa el producto", async () => {
    mocks.productUpdate.mockResolvedValue({ id: 1 });

    const res = await setProductActive(1, true);

    expect(res).toEqual({ ok: true, isActive: true });
    expect(mocks.productUpdate.mock.calls[0][0]).toEqual({
      where: { id: 1 },
      data: { isActive: true },
      select: { id: true },
    });
  });

  it("desactiva el producto", async () => {
    mocks.productUpdate.mockResolvedValue({ id: 1 });

    const res = await setProductActive(1, false);

    expect(res).toEqual({ ok: true, isActive: false });
    expect(mocks.productUpdate.mock.calls[0][0].data).toEqual({ isActive: false });
  });

  it("devuelve not-found si el producto no existe (P2025)", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "1.0.0",
    });
    mocks.productUpdate.mockRejectedValue(error);

    const res = await setProductActive(999, true);

    expect(res).toEqual({ ok: false, error: "not-found" });
  });

  it("propaga otros errores de Prisma", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2003",
      clientVersion: "1.0.0",
    });
    mocks.productUpdate.mockRejectedValue(error);

    await expect(setProductActive(1, true)).rejects.toThrow();
  });

  it("devuelve not-found con id inválido (0)", async () => {
    const res = await setProductActive(0, true);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id negativo", async () => {
    const res = await setProductActive(-5, true);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });
});

describe("deleteProduct", () => {
  it("elimina el producto si no tiene clics", async () => {
    mocks.clickCount.mockResolvedValue(0);
    mocks.productDelete.mockResolvedValue({});

    const res = await deleteProduct(1);

    expect(res).toEqual({ ok: true });
    expect(mocks.clickCount.mock.calls[0][0]).toEqual({ where: { productId: 1 } });
    expect(mocks.productDelete.mock.calls[0][0]).toEqual({ where: { id: 1 } });
  });

  it("devuelve has-clicks con el conteo si hay clics", async () => {
    mocks.clickCount.mockResolvedValue(7);

    const res = await deleteProduct(1);

    expect(res).toEqual({ ok: false, error: "has-clicks", count: 7 });
    expect(mocks.productDelete).not.toHaveBeenCalled();
  });

  it("devuelve not-found si el producto no existe (P2025)", async () => {
    mocks.clickCount.mockResolvedValue(0);
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "1.0.0",
    });
    mocks.productDelete.mockRejectedValue(error);

    const res = await deleteProduct(999);

    expect(res).toEqual({ ok: false, error: "not-found" });
  });

  it("devuelve has-clicks si hay carrera y aparece P2003", async () => {
    mocks.clickCount.mockResolvedValueOnce(0); // primera verificación
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
      code: "P2003",
      clientVersion: "1.0.0",
    });
    mocks.productDelete.mockRejectedValue(error);
    mocks.clickCount.mockResolvedValueOnce(4); // verificación tras carrera

    const res = await deleteProduct(1);

    expect(res).toEqual({ ok: false, error: "has-clicks", count: 4 });
  });

  it("propaga otros errores de Prisma", async () => {
    mocks.clickCount.mockResolvedValue(0);
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2002",
      clientVersion: "1.0.0",
    });
    mocks.productDelete.mockRejectedValue(error);

    await expect(deleteProduct(1)).rejects.toThrow();
  });

  it("devuelve not-found con id inválido (0)", async () => {
    const res = await deleteProduct(0);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.clickCount).not.toHaveBeenCalled();
    expect(mocks.productDelete).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id negativo", async () => {
    const res = await deleteProduct(-5);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.clickCount).not.toHaveBeenCalled();
    expect(mocks.productDelete).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id no entero", async () => {
    const res = await deleteProduct(1.5);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.clickCount).not.toHaveBeenCalled();
    expect(mocks.productDelete).not.toHaveBeenCalled();
  });
});