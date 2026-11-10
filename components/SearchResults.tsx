import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductPage } from "@/lib/products";

export default function SearchResults({ result }: { result: ProductPage }) {
  if (result.items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">
          No encontramos productos que coincidan con tu búsqueda.
        </p>
        <Link
          href="/productos"
          className="mt-4 inline-flex rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100"
        >
          Ver todos los productos
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="sr-only">Resultados</h2>
      <p className="mb-6 text-sm text-gray-600" aria-live="polite">
        {result.total} {result.total === 1 ? "producto" : "productos"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
