"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import {
  HotmartApiError,
  HotmartAuthError,
  HotmartNetworkError,
  HotmartRateLimitError,
  HotmartResponseError,
} from "@/lib/hotmart";
import { SyncInProgressError, syncHotmartProducts, type SyncResult } from "@/lib/hotmart/sync";

export type SyncActionState = { result?: SyncResult; error?: string } | undefined;

function messageFor(error: unknown): string {
  if (error instanceof SyncInProgressError) return "Ya hay una sincronización en curso. Espera a que termine.";
  if (error instanceof HotmartAuthError) return "Hotmart rechazó las credenciales. Revisa HOTMART_* en el entorno.";
  if (error instanceof HotmartRateLimitError) return "Hotmart limitó las peticiones. Inténtalo de nuevo en unos minutos.";
  if (error instanceof HotmartNetworkError) return "No se pudo conectar con Hotmart. Inténtalo de nuevo.";
  if (error instanceof HotmartApiError || error instanceof HotmartResponseError) {
    return "Hotmart respondió con un error inesperado. No se modificó el catálogo.";
  }
  if (error instanceof Error && error.message.startsWith("Variables de entorno de Hotmart")) return error.message;
  return "No se pudo sincronizar con Hotmart. Inténtalo de nuevo.";
}

export async function syncHotmartAction(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: SyncActionState,
): Promise<SyncActionState> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  let result: SyncResult;
  try {
    result = await syncHotmartProducts();
  } catch (error) {
    return { error: messageFor(error) };
  }

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/productos/[slug]", "page");
  revalidatePath("/admin/productos");
  return { result };
}
