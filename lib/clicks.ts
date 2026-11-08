import { z } from "zod";
import { db } from "@/lib/db";

/** Capa de datos para registro de clics (solo servidor). */

const recordClickSchema = z.object({
  productId: z.number().int().positive(),
  referer: z.string().max(500).optional().nullable(),
});

function truncateReferer(referer: string | null | undefined): string | null {
  if (!referer) return null;
  return referer.length > 500 ? referer.slice(0, 500) : referer;
}

export async function recordClick(input: { productId: number; referer?: string | null }): Promise<void> {
  const referer = truncateReferer(input.referer);
  const parsed = recordClickSchema.parse({ productId: input.productId, referer });

  await db.click.create({
    data: {
      productId: parsed.productId,
      referer: parsed.referer ?? null,
    },
  });
}