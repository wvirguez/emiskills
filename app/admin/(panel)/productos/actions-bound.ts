"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { setProductActive, deleteProduct } from "@/lib/admin-products";

export async function toggleProductActiveByIdAction(
  isActive: boolean,
  formData: FormData,
): Promise<void> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  const productId = parseInt(formData.get("productId") as string, 10);

  if (!Number.isInteger(productId) || productId <= 0) {
    redirect("/admin/productos?ok=eliminado");
  }

  const result = await setProductActive(productId, isActive);

  if (!result.ok) {
    if (result.error === "not-found") {
      redirect("/admin/productos?ok=eliminado");
    }
    redirect("/admin/productos?error=has-clicks&count=0");
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]", "page");
  redirect(`/admin/productos?ok=${isActive ? "activado" : "desactivado"}`);
}

export async function deleteProductByIdAction(
  formData: FormData,
): Promise<void> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  const productId = parseInt(formData.get("productId") as string, 10);

  if (!Number.isInteger(productId) || productId <= 0) {
    redirect("/admin/productos?ok=eliminado");
  }

  const result = await deleteProduct(productId);

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