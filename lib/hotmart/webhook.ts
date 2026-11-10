import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getHotmartWebhookEnv } from "../env";

/** Webhook de Hotmart: verifica el hottok y valida el cuerpo. Ver specs/2026-11-10-webhook-hotmart-firma. */

export const HOTTOK_HEADER = "x-hotmart-hottok";

/** Esquema mínimo y tolerante: `event` no se restringe para aceptar eventos nuevos. */
export const webhookPayloadSchema = z.looseObject({
  id: z.string().optional(),
  event: z.string().min(1),
  version: z.string().optional(),
  creation_date: z.number().optional(),
  data: z.unknown().optional(),
});

export type HotmartWebhookPayload = z.infer<typeof webhookPayloadSchema>;

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/** Comparación en tiempo constante (hashes SHA-256, así la longitud no se filtra). */
export function verifyHottok(received: string | null, expected: string): boolean {
  if (!received || !expected) return false;
  return timingSafeEqual(sha256(received), sha256(expected));
}

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status });

export async function handleHotmartWebhook(request: Request): Promise<Response> {
  let expected: string;
  try {
    expected = getHotmartWebhookEnv().HOTMART_HOTTOK;
  } catch {
    console.error("[hotmart-webhook] HOTMART_HOTTOK no está configurada");
    return json({ error: "webhook_not_configured" }, 503);
  }

  if (!verifyHottok(request.headers.get(HOTTOK_HEADER), expected)) {
    return json({ error: "unauthorized" }, 401);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "invalid_payload" }, 400);
  }

  const parsed = webhookPayloadSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid_payload" }, 400);

  const { event, id, creation_date } = parsed.data;
  console.info(
    `[hotmart-webhook] evento recibido: ${event} id=${id ?? "-"} fecha=${creation_date ?? "-"}`
  );
  return json({ received: true }, 200);
}
