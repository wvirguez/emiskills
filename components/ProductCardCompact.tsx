import Link from "next/link";
import type { ProductDTO } from "@/lib/products";
import { DEFAULT_GRADIENT } from "@/lib/product-ui";

interface ProductCardCompactProps {
  product: ProductDTO;
}

export default function ProductCardCompact({ product }: ProductCardCompactProps) {
  return (
    <article className="shrink-0 snap-start w-64 flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
      <div
        data-testid="gradient-bg"
        className={`relative h-32 overflow-hidden bg-gradient-to-br ${product.imageGradient ?? DEFAULT_GRADIENT}`}
      >
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm font-medium text-violet-700">
          {product.category.name}
        </p>
        <h3 className="mt-1 text-base font-bold text-gray-900 line-clamp-2">
          {product.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Plataforma:{" "}
          <span className="text-violet-600">{product.platform.name}</span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-bold text-violet-600">
            {product.price.toFixed(2)}{" "}
            <span className="text-sm font-medium">{product.currency}</span>
          </span>
          <Link
            href={`/productos/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 min-h-[44px]"
          >
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}