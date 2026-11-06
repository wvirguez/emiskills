import Link from "next/link";
import type { ProductDTO } from "@/lib/products";

const DEFAULT_GRADIENT = "from-violet-500 to-fuchsia-500";

export default function ProductCard({ product }: { product: ProductDTO }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`relative h-48 overflow-hidden bg-gradient-to-br ${product.imageGradient ?? DEFAULT_GRADIENT}`}
      >
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm">
            {product.category.name}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-violet-600">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {product.shortDescription}
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Plataforma:{" "}
          <span className="text-violet-600">{product.platform.name}</span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-2xl font-bold text-violet-600">
            {product.price.toFixed(2)}{" "}
            <span className="text-sm font-medium">{product.currency}</span>
          </span>
          <Link
            href={`/productos/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:scale-105 hover:bg-violet-100"
          >
            Ver producto
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
