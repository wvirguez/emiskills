import "server-only";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Métricas de clics para el panel admin (solo servidor). Fechas siempre en UTC. */

export const RANGES = ["7d", "30d", "todo"] as const;
export type MetricsRange = (typeof RANGES)[number];
export const DEFAULT_RANGE: MetricsRange = "30d";

const rangeSchema = z.enum(RANGES);

/** Valor inválido, vacío o múltiple → rango por defecto (nunca lanza). */
export function parseRange(value: unknown): MetricsRange {
  const parsed = rangeSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_RANGE;
}

const RANGE_DAYS: Record<"7d" | "30d", number> = { "7d": 7, "30d": 30 };
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Inicio del rango (00:00 UTC, incluye el día actual); `null` para "todo". */
export function getRangeStart(range: MetricsRange, now: Date = new Date()): Date | null {
  if (range === "todo") return null;
  return new Date(startOfUtcDay(now).getTime() - (RANGE_DAYS[range] - 1) * DAY_MS);
}

function dateFilter(range: MetricsRange, now?: Date) {
  const start = getRangeStart(range, now);
  return start ? { createdAt: { gte: start } } : {};
}

export type ProductClicks = { id: number; name: string; categoryName: string; clicks: number };
export type CategoryClicks = { id: number; name: string; clicks: number };
export type DayClicks = { date: string; clicks: number };

function byClicksThenName<T extends { clicks: number; name: string }>(a: T, b: T): number {
  return b.clicks - a.clicks || a.name.localeCompare(b.name, "es");
}

export async function getClickTotals(range: MetricsRange): Promise<number> {
  return db.click.count({ where: dateFilter(range) });
}

async function clicksByProductId(range: MetricsRange): Promise<Map<number, number>> {
  const groups = await db.click.groupBy({
    by: ["productId"],
    where: dateFilter(range),
    _count: { _all: true },
  });
  return new Map(groups.map((g) => [g.productId, g._count._all]));
}

export async function getClicksByProduct(range: MetricsRange): Promise<ProductClicks[]> {
  const [counts, products] = await Promise.all([
    clicksByProductId(range),
    db.product.findMany({
      select: { id: true, title: true, category: { select: { name: true } } },
    }),
  ]);
  return products
    .map((p) => ({
      id: p.id,
      name: p.title,
      categoryName: p.category.name,
      clicks: counts.get(p.id) ?? 0,
    }))
    .sort(byClicksThenName);
}

export async function getClicksByCategory(range: MetricsRange): Promise<CategoryClicks[]> {
  const [counts, products, categories] = await Promise.all([
    clicksByProductId(range),
    db.product.findMany({ select: { id: true, categoryId: true } }),
    db.category.findMany({ select: { id: true, name: true } }),
  ]);
  const totals = new Map<number, number>();
  for (const p of products) {
    totals.set(p.categoryId, (totals.get(p.categoryId) ?? 0) + (counts.get(p.id) ?? 0));
  }
  return categories
    .map((c) => ({ id: c.id, name: c.name, clicks: totals.get(c.id) ?? 0 }))
    .sort(byClicksThenName);
}

type DayRow = { day: Date | string; clicks: bigint | number };

function toDayKey(day: Date | string): string {
  return (day instanceof Date ? day.toISOString() : String(day)).slice(0, 10);
}

/** Clics por día UTC, más reciente primero. Rellena con 0 los rangos acotados. */
export async function getClicksByDay(range: MetricsRange, now: Date = new Date()): Promise<DayClicks[]> {
  const start = getRangeStart(range, now);
  // `createdAt` se guarda en UTC (DATETIME sin zona), así DATE() devuelve el día UTC.
  const rows = start
    ? await db.$queryRaw<DayRow[]>(
        Prisma.sql`SELECT DATE(createdAt) AS day, COUNT(*) AS clicks FROM clicks WHERE createdAt >= ${start} GROUP BY DATE(createdAt)`,
      )
    : await db.$queryRaw<DayRow[]>(
        Prisma.sql`SELECT DATE(createdAt) AS day, COUNT(*) AS clicks FROM clicks GROUP BY DATE(createdAt)`,
      );
  const byDay = new Map(rows.map((r) => [toDayKey(r.day), Number(r.clicks)]));

  if (range === "todo") {
    return [...byDay.entries()]
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  const days = RANGE_DAYS[range];
  const today = startOfUtcDay(now).getTime();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today - i * DAY_MS).toISOString().slice(0, 10);
    return { date, clicks: byDay.get(date) ?? 0 };
  });
}
