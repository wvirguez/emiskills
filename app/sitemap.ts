import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getSitemapProducts } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Depende de la BD: se genera en cada petición, no durante el build.
  await connection();
  const products = await getSitemapProducts();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/productos/"), changeFrequency: "daily", priority: 0.8 },
    ...products.map((product) => ({
      url: absoluteUrl(`/productos/${product.slug}/`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
