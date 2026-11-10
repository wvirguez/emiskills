/** Datos base (sin productos) que necesita el catálogo en cualquier entorno. */
export const BASE_PLATFORMS = [
  { slug: "hotmart", name: "Hotmart" },
  { slug: "manual", name: "Manual" },
] as const;

export const BASE_CATEGORIES = [
  { slug: "curso", name: "Curso" },
  { slug: "ebook", name: "Ebook" },
  { slug: "plantilla", name: "Plantilla" },
  { slug: "membresia", name: "Membresía" },
] as const;

type Upserter = {
  upsert(args: {
    where: { slug: string };
    update: Record<string, never>;
    create: { slug: string; name: string };
  }): Promise<unknown>;
};

export type BaseSeedClient = { platform: Upserter; category: Upserter };

/**
 * Crea plataformas y categorías base. Idempotente: `update` vacío, así que nunca
 * pisa nombres ni datos editados desde el panel de administración.
 */
export async function seedBase(client: BaseSeedClient): Promise<void> {
  for (const platform of BASE_PLATFORMS) {
    await client.platform.upsert({ where: { slug: platform.slug }, update: {}, create: { ...platform } });
  }
  for (const category of BASE_CATEGORIES) {
    await client.category.upsert({ where: { slug: category.slug }, update: {}, create: { ...category } });
  }
}
