import "server-only";
import { db } from "../db";
import { getDefaultGradient } from "../product-options";
import { listProductOffers, listProducts } from "./client";
import type { HotmartProduct } from "./schemas";
import {
  buildSlug,
  FALLBACK_CATEGORY_NAME,
  FALLBACK_CATEGORY_SLUG,
  isSupportedCurrency,
  mapFormatToCategorySlug,
  pickMainOffer,
} from "./sync-mapping";

/** Sincroniza productos de Hotmart con la base de datos (solo servidor). Ver specs/2026-11-10-sincronizacion-hotmart. */

export type SyncClient = {
  listProducts: () => Promise<HotmartProduct[]>;
  listProductOffers: (ucode: string) => ReturnType<typeof listProductOffers>;
};

export type SyncResult = {
  created: number;
  updated: number;
  deactivated: number;
  unchanged: number;
  skipped: { id: number; name: string; reason: string }[];
  errors: { id: number; message: string }[];
};

export class SyncInProgressError extends Error {
  constructor() {
    super("Ya hay una sincronización en curso");
    this.name = "SyncInProgressError";
  }
}

export const PLACEHOLDER_DESCRIPTION = "Producto de Hotmart pendiente de revisión.";
const ACTIVE_STATUS = "ACTIVE";

const defaultClient: SyncClient = {
  listProducts: () => listProducts(),
  listProductOffers: (ucode) => listProductOffers(ucode),
};

let running = false;

export async function syncHotmartProducts(client: SyncClient = defaultClient): Promise<SyncResult> {
  if (running) throw new SyncInProgressError();
  running = true;
  try {
    return await run(client);
  } finally {
    running = false;
  }
}

async function run(client: SyncClient): Promise<SyncResult> {
  const result: SyncResult = { created: 0, updated: 0, deactivated: 0, unchanged: 0, skipped: [], errors: [] };

  // 1. Leer la lista completa ANTES de escribir: si falla, no se toca la BD.
  const remote = await client.listProducts();
  const remoteIds = new Set(remote.map((p) => String(p.id)));

  const [platform, fallbackCategory] = await Promise.all([
    db.platform.upsert({ where: { slug: "hotmart" }, update: {}, create: { slug: "hotmart", name: "Hotmart" }, select: { id: true } }),
    db.category.upsert({
      where: { slug: FALLBACK_CATEGORY_SLUG },
      update: {},
      create: { slug: FALLBACK_CATEGORY_SLUG, name: FALLBACK_CATEGORY_NAME },
      select: { id: true },
    }),
  ]);
  const categories = await db.category.findMany({ select: { id: true, slug: true } });
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  const linkedRows = await db.product.findMany({
    where: { externalId: { not: null } },
    select: { id: true, externalId: true, title: true, price: true, currency: true, externalUcode: true, isActive: true },
  });
  const linked = new Map(linkedRows.map((r) => [r.externalId as string, r]));
  const slugs = new Set((await db.product.findMany({ select: { slug: true } })).map((r) => r.slug));

  // 2. Reconciliar cada producto de Hotmart.
  for (const product of remote) {
    const externalId = String(product.id);
    const existing = linked.get(externalId);
    try {
      if (product.status !== ACTIVE_STATUS) {
        if (existing?.isActive) {
          await db.product.update({ where: { id: existing.id }, data: { isActive: false, syncedAt: new Date() } });
          result.deactivated++;
        }
        continue;
      }

      const offer = pickMainOffer(await client.listProductOffers(product.ucode));
      if (!offer) {
        result.skipped.push({ id: product.id, name: product.name, reason: "Sin ofertas en Hotmart" });
        continue;
      }
      if (!isSupportedCurrency(offer.price.currency)) {
        result.skipped.push({ id: product.id, name: product.name, reason: `Moneda no soportada (${offer.price.currency})` });
        continue;
      }
      if (!(offer.price.value >= 0)) {
        result.skipped.push({ id: product.id, name: product.name, reason: "Precio inválido" });
        continue;
      }
      const { value: price, currency } = offer.price;

      if (existing) {
        const same =
          existing.title === product.name &&
          Number(existing.price) === price &&
          existing.currency === currency &&
          existing.externalUcode === product.ucode;
        if (same) {
          result.unchanged++;
          continue;
        }
        await db.product.update({
          where: { id: existing.id },
          data: { title: product.name, price, currency, externalUcode: product.ucode, syncedAt: new Date() },
        });
        result.updated++;
        continue;
      }

      if (!offer.directOfferLink) {
        result.skipped.push({ id: product.id, name: product.name, reason: "La oferta no trae enlace" });
        continue;
      }
      const slug = buildSlug(product.name, externalId, (s) => slugs.has(s));
      const categoryId =
        categoryBySlug.get(mapFormatToCategorySlug(product.format, product.isSubscription)) ?? fallbackCategory.id;
      await db.product.create({
        data: {
          slug,
          title: product.name,
          shortDescription: PLACEHOLDER_DESCRIPTION,
          price,
          currency,
          language: "es",
          imageGradient: getDefaultGradient(),
          affiliateUrl: offer.directOfferLink,
          isActive: false,
          needsReview: true,
          categoryId,
          platformId: platform.id,
          externalId,
          externalUcode: product.ucode,
          syncedAt: new Date(),
        },
      });
      slugs.add(slug);
      result.created++;
    } catch (e) {
      result.errors.push({ id: product.id, message: e instanceof Error ? e.message : "Error desconocido" });
    }
  }

  // 3. Vinculados que ya no aparecen en Hotmart → desactivar (nunca borrar).
  for (const row of linkedRows) {
    if (remoteIds.has(row.externalId as string) || !row.isActive) continue;
    try {
      await db.product.update({ where: { id: row.id }, data: { isActive: false, syncedAt: new Date() } });
      result.deactivated++;
    } catch (e) {
      result.errors.push({ id: row.id, message: e instanceof Error ? e.message : "Error desconocido" });
    }
  }

  return result;
}
