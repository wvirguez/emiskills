import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ProductDetail from "@/components/ProductDetail";
import { getProductBySlug } from "@/lib/products";
import { truncate } from "@/lib/product-ui";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: false },
    };
  }
  return buildMetadata({
    title: product.title,
    description: truncate(product.shortDescription, 160),
    path: `/productos/${product.slug}/`,
    image: product.imageUrl,
  });
}

export default async function ProductPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
