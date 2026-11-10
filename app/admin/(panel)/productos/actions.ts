"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import {
  productSchema,
} from "@/app/admin/(panel)/productos/schema";
import { type ProductFormState, type ProductFormData } from "@/app/admin/(panel)/productos/form-types";
import {
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/lib/admin-products";

function formatFieldErrors(
  issues: readonly import("zod").ZodIssue[],
): ProductFormState["fieldErrors"] {
  const fieldErrors: ProductFormState["fieldErrors"] = {};
  for (const issue of issues) {
    const path = issue.path[0];
    if (typeof path === "string" && path in fieldErrors) {
      (fieldErrors as Record<string, string[]>)[path] = [issue.message];
    }
  }
  return fieldErrors;
}

export async function createProductAction(
  _prevState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  const rawData: ProductFormData = {
    title: String(formData.get("title") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency: String(formData.get("currency") ?? ""),
    language: String(formData.get("language") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageGradient: String(formData.get("imageGradient") ?? ""),
    affiliateUrl: String(formData.get("affiliateUrl") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    platformId: String(formData.get("platformId") ?? ""),
    isActive: formData.get("isActive") === "true",
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { fieldErrors: formatFieldErrors(validated.error.issues) };
  }

  const data = validated.data;

  const input: CreateProductInput = {
    title: data.title,
    shortDescription: data.shortDescription,
    description: data.description,
    price: data.price,
    currency: data.currency,
    language: data.language,
    imageUrl: data.imageUrl,
    imageGradient: data.imageGradient,
    affiliateUrl: data.affiliateUrl,
    categoryId: data.categoryId,
    platformId: data.platformId,
  };

  const result = await createProduct(input);

  if (!result.ok) {
    if (result.error === "slug-exists") {
      return { fieldErrors: { title: ["Ya existe un producto con ese título (slug duplicado)."] } };
    }
    if (result.error === "invalid-category") {
      return { fieldErrors: { categoryId: ["La categoría seleccionada no existe."] } };
    }
    if (result.error === "invalid-platform") {
      return { fieldErrors: { platformId: ["La plataforma seleccionada no existe."] } };
    }
    return { error: "Error al crear el producto. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]", "page");
  redirect("/admin/productos?ok=creado");
}

export async function updateProductAction(
  id: number,
  _prevState: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID de producto inválido." };
  }

  const rawData: ProductFormData = {
    title: String(formData.get("title") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    currency: String(formData.get("currency") ?? ""),
    language: String(formData.get("language") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    imageGradient: String(formData.get("imageGradient") ?? ""),
    affiliateUrl: String(formData.get("affiliateUrl") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    platformId: String(formData.get("platformId") ?? ""),
    isActive: formData.get("isActive") === "true",
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { fieldErrors: formatFieldErrors(validated.error.issues) };
  }

  const data = validated.data;

  const input: UpdateProductInput = {
    title: data.title,
    shortDescription: data.shortDescription,
    description: data.description,
    price: data.price,
    currency: data.currency,
    language: data.language,
    imageUrl: data.imageUrl,
    imageGradient: data.imageGradient,
    affiliateUrl: data.affiliateUrl,
    categoryId: data.categoryId,
    platformId: data.platformId,
    isActive: data.isActive,
  };

  const result = await updateProduct(id, input);

  if (!result.ok) {
    if (result.error === "not-found") {
      return { error: "Producto no encontrado." };
    }
    if (result.error === "invalid-category") {
      return { fieldErrors: { categoryId: ["La categoría seleccionada no existe."] } };
    }
    if (result.error === "invalid-platform") {
      return { fieldErrors: { platformId: ["La plataforma seleccionada no existe."] } };
    }
    if (result.error === "needs-review") {
      return { error: "Este producto viene de Hotmart: guarda tu enlace de afiliado antes de activarlo." };
    }
    return { error: "Error al actualizar el producto. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]", "page");
  redirect("/admin/productos?ok=editado");
}

export async function toggleProductActiveAction(
  id: number,
  _prevState: void,
  formData: FormData,
): Promise<void> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  if (!Number.isInteger(id) || id <= 0) {
    redirect("/admin/productos?ok=eliminado");
  }

  const isActive = formData.get("isActive") === "true";

  const result = await setProductActive(id, isActive);

  if (!result.ok) {
    if (result.error === "not-found") {
      redirect("/admin/productos?ok=eliminado");
    }
    if (result.error === "needs-review") {
      redirect("/admin/productos?error=needs-review");
    }
    redirect("/admin/productos");
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]", "page");
  redirect(`/admin/productos?ok=${isActive ? "activado" : "desactivado"}`);
}

export async function deleteProductAction(
  id: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData,
): Promise<void> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  if (!Number.isInteger(id) || id <= 0) {
    redirect("/admin/productos?ok=eliminado");
  }

  const result = await deleteProduct(id);

  if (!result.ok) {
    if (result.error === "has-clicks") {
      redirect(`/admin/productos?error=has-clicks&count=${result.count}`);
    }
    if (result.error === "not-found") {
      redirect("/admin/productos?ok=eliminado");
    }
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]", "page");
  redirect("/admin/productos?ok=eliminado");
}