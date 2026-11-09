"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { categorySchema, createCategory, updateCategory, deleteCategory } from "@/lib/categories";

export async function createCategoryAction(
  _prevState: { error?: string; fieldErrors?: { name?: string[] } } | undefined,
  formData: FormData,
): Promise<{ error?: string; fieldErrors?: { name?: string[] } }> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  const validated = categorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validated.success) {
    const fieldErrors: { name?: string[] } = {};
    for (const issue of validated.error.issues) {
      if (issue.path[0] === "name") {
        fieldErrors.name = [issue.message];
        break;
      }
    }
    return { fieldErrors };
  }

  const result = await createCategory({ name: validated.data.name });

  if (!result.ok) {
    if (result.error === "slug-exists") {
      return { fieldErrors: { name: ["Ya existe una categoría con ese nombre (slug duplicado)."] } };
    }
    return { error: "Error al crear la categoría. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/productos");
  redirect(`/admin/categorias?ok=creada`);
}

export async function updateCategoryAction(
  id: number,
  _prevState: { error?: string; fieldErrors?: { name?: string[] } } | undefined,
  formData: FormData,
): Promise<{ error?: string; fieldErrors?: { name?: string[] } }> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID de categoría inválido." };
  }

  const validated = categorySchema.safeParse({
    name: formData.get("name"),
  });

  if (!validated.success) {
    const fieldErrors: { name?: string[] } = {};
    for (const issue of validated.error.issues) {
      if (issue.path[0] === "name") {
        fieldErrors.name = [issue.message];
        break;
      }
    }
    return { fieldErrors };
  }

  const result = await updateCategory(id, { name: validated.data.name });

  if (!result.ok) {
    if (result.error === "not-found") {
      return { error: "Categoría no encontrada." };
    }
    return { error: "Error al actualizar la categoría. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  revalidatePath("/productos");
  redirect(`/admin/categorias?ok=editada`);
}

export async function deleteCategoryAction(
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
    redirect("/admin/categorias?ok=eliminada");
  }

  const result = await deleteCategory(id);

  if (!result.ok) {
    if (result.error === "has-products") {
      redirect(`/admin/categorias?error=has-products&count=${result.count}`);
    }
    if (result.error === "not-found") {
      redirect("/admin/categorias?ok=eliminada");
    }
  }

  revalidatePath("/");
  revalidatePath("/productos");
  redirect("/admin/categorias?ok=eliminada");
}