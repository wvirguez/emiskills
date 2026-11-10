import "server-only";
import { z } from "zod";
import { db } from "../db";

/** Manejo de eventos del webhook de Hotmart. Ver specs/2026-11-10-eventos-webhook-hotmart. */

const ACTIVE_STATUS = "ACTIVE";
const MAX_TITLE = 200;

export type EventResult =
  | "updated"
  | "deactivated"
  | "unchanged"
  | "ignored:evento_no_soportado"
  | "ignored:payload_invalido"
  | "ignored:producto_no_vinculado";

/** Esquema tolerante: campos extra permitidos; `id` puede llegar como número o texto. */
export const productEventSchema = z.looseObject({
  product: z.looseObject({
    id: z.union([z.number().int().positive(), z.string().regex(/^\d+$/)]),
    ucode: z.string().min(1).max(50).optional(),
    name: z.string().optional(),
    status: z.string().optional(),
  }),
});

export type ProductEventData = z.infer<typeof productEventSchema>["product"];

/** trim + máximo 200 caracteres; vacío → undefined (no se actualiza). */
export function sanitizeTitle(name: string | undefined): string | undefined {
  const title = name?.trim().slice(0, MAX_TITLE).trim();
  return title ? title : undefined;
}

export async function applyProductEvent(product: ProductEventData): Promise<EventResult> {
  const existing = await db.product.findUnique({
    where: { externalId: String(product.id) },
    select: { id: true, title: true, externalUcode: true, isActive: true },
  });
  if (!existing) return "ignored:producto_no_vinculado";

  const title = sanitizeTitle(product.name);
  const data: {
    title?: string;
    externalUcode?: string;
    isActive?: boolean;
    syncedAt: Date;
  } = { syncedAt: new Date() };
  if (title !== undefined) data.title = title;
  if (product.ucode !== undefined) data.externalUcode = product.ucode;

  // Estado explícito distinto de ACTIVE → desactivar; nunca se reactiva.
  const deactivate = product.status !== undefined && product.status !== ACTIVE_STATUS && existing.isActive;
  if (deactivate) data.isActive = false;

  const changed =
    deactivate ||
    (data.title !== undefined && data.title !== existing.title) ||
    (data.externalUcode !== undefined && data.externalUcode !== existing.externalUcode);

  await db.product.update({ where: { id: existing.id }, data });
  if (deactivate) return "deactivated";
  return changed ? "updated" : "unchanged";
}

export async function dispatchHotmartEvent(event: string, data: unknown): Promise<EventResult> {
  if (event !== "PRODUCT_UPDATE") return "ignored:evento_no_soportado";
  const parsed = productEventSchema.safeParse(data);
  if (!parsed.success) return "ignored:payload_invalido";
  return applyProductEvent(parsed.data.product);
}
