// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn((url) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/auth/session", () => ({
  verifySession: mocks.verifySession,
}));

vi.mock("@/lib/categories", () => ({
  createCategory: mocks.createCategory,
  updateCategory: mocks.updateCategory,
  deleteCategory: mocks.deleteCategory,
  categorySchema: {
    safeParse: vi.fn((data) => {
      const name = (data as { name?: unknown }).name;
      if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
        return {
          success: false,
          error: {
            issues: [{ path: ["name"], message: "El nombre debe tener al menos 2 caracteres" }],
          },
        } as const;
      }
      return { success: true, data: { name: name.trim() } } as const;
    }),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/admin/(panel)/categorias/actions";

describe("createCategoryAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId: 1 });
    mocks.createCategory.mockResolvedValue({ ok: true, category: { id: 1, slug: "nueva", name: "Nueva" } });
  });

  it("sin sesión → redirige a login y no toca la BD", async () => {
    mocks.verifySession.mockResolvedValue(null);

    await expect(createCategoryAction(undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(mocks.createCategory).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("datos inválidos → retorna error de campo", async () => {
    const formData = new FormData();
    formData.set("name", "a");

    const result = await createCategoryAction(undefined, formData);

    expect(result.fieldErrors?.name).toEqual(["El nombre debe tener al menos 2 caracteres"]);
    expect(mocks.createCategory).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("slug duplicado → retorna error de campo", async () => {
    mocks.createCategory.mockResolvedValue({ ok: false, error: "slug-exists" });

    const formData = new FormData();
    formData.set("name", "Categoría Existente");

    const result = await createCategoryAction(undefined, formData);

    expect(result.fieldErrors?.name).toEqual(["Ya existe una categoría con ese nombre (slug duplicado)."]);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("éxito → llama revalidatePath y redirect", async () => {
    const formData = new FormData();
    formData.set("name", "Nueva Categoría");

    await expect(createCategoryAction(undefined, formData)).rejects.toThrow("NEXT_REDIRECT:/admin/categorias?ok=creada");

    expect(mocks.createCategory).toHaveBeenCalledWith({ name: "Nueva Categoría" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/productos");
    expect(mocks.redirect).toHaveBeenCalledWith("/admin/categorias?ok=creada");
  });

  it("error genérico de createCategory → retorna error general", async () => {
    // Create a mock error that's not "slug-exists" to trigger generic error
    const originalCreateCategory = mocks.createCategory;
    mocks.createCategory.mockImplementationOnce(async () => {
      throw new Error("Database connection failed");
    });

    const formData = new FormData();
    formData.set("name", "Nueva Categoría");

    await expect(createCategoryAction(undefined, formData)).rejects.toThrow("Database connection failed");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
    
    // Restore
    mocks.createCategory.mockImplementation(originalCreateCategory);
  });
});

describe("updateCategoryAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId: 1 });
    mocks.updateCategory.mockResolvedValue({ ok: true, category: { id: 1, slug: "existente", name: "Actualizada" } });
  });

  it("sin sesión → redirige a login y no toca la BD", async () => {
    mocks.verifySession.mockResolvedValue(null);

    await expect(updateCategoryAction(1, undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(mocks.updateCategory).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("ID inválido → retorna error", async () => {
    const formData = new FormData();
    formData.set("name", "Válido");

    const result = await updateCategoryAction(0, undefined, formData);

    expect(result.error).toBe("ID de categoría inválido.");
    expect(mocks.updateCategory).not.toHaveBeenCalled();
  });

  it("datos inválidos → retorna error de campo", async () => {
    const formData = new FormData();
    formData.set("name", "a");

    const result = await updateCategoryAction(1, undefined, formData);

    expect(result.fieldErrors?.name).toEqual(["El nombre debe tener al menos 2 caracteres"]);
    expect(mocks.updateCategory).not.toHaveBeenCalled();
  });

  it("categoría no encontrada → retorna error", async () => {
    mocks.updateCategory.mockResolvedValue({ ok: false, error: "not-found" });

    const formData = new FormData();
    formData.set("name", "Nuevo Nombre");

    const result = await updateCategoryAction(999, undefined, formData);

    expect(result.error).toBe("Categoría no encontrada.");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("éxito → llama revalidatePath y redirect", async () => {
    const formData = new FormData();
    formData.set("name", "Categoría Actualizada");

    await expect(updateCategoryAction(1, undefined, formData)).rejects.toThrow("NEXT_REDIRECT:/admin/categorias?ok=editada");

    expect(mocks.updateCategory).toHaveBeenCalledWith(1, { name: "Categoría Actualizada" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/productos");
    expect(mocks.redirect).toHaveBeenCalledWith("/admin/categorias?ok=editada");
  });
});

describe("deleteCategoryAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({ userId: 1 });
    mocks.deleteCategory.mockResolvedValue({ ok: true });
  });

  it("sin sesión → redirige a login y no toca la BD", async () => {
    mocks.verifySession.mockResolvedValue(null);

    await expect(deleteCategoryAction(1, undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/login");
    expect(mocks.deleteCategory).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("ID inválido → redirige a lista con ok=eliminada (sin tocar BD)", async () => {
    await expect(deleteCategoryAction(0, undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/categorias?ok=eliminada");
    expect(mocks.deleteCategory).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("categoría con productos → bloquea y redirige con error", async () => {
    mocks.deleteCategory.mockResolvedValue({ ok: false, error: "has-products", count: 3 });

    await expect(deleteCategoryAction(1, undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/categorias?error=has-products&count=3");

    expect(mocks.deleteCategory).toHaveBeenCalledWith(1);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("categoría no encontrada → redirige a lista con ok=eliminada", async () => {
    mocks.deleteCategory.mockResolvedValue({ ok: false, error: "not-found" });

    await expect(deleteCategoryAction(999, undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/categorias?ok=eliminada");

    expect(mocks.deleteCategory).toHaveBeenCalledWith(999);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("éxito → llama revalidatePath y redirect", async () => {
    await expect(deleteCategoryAction(1, undefined, new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/categorias?ok=eliminada");

    expect(mocks.deleteCategory).toHaveBeenCalledWith(1);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/productos");
    expect(mocks.redirect).toHaveBeenCalledWith("/admin/categorias?ok=eliminada");
  });
});