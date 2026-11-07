import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ProductDetail from "@/components/ProductDetail";
import { getProductBySlug } from "@/lib/products";
import { truncate } from "@/lib/product-ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | EmiSkills" };
  return {
    title: `${product.title} | EmiSkills`,
    description: truncate(product.shortDescription, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
