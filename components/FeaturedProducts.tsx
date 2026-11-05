// src/components/FeaturedProducts.tsx
import Link from "next/link";
import { sampleProducts } from "@/data/sample-products";

export default function FeaturedProducts() {
  return (
    <section className="bg-gradient-to-b from-violet-50 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Productos Destacados
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              (productos de ejemplo)
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Estos productos son de ejemplo para demostrar la funcionalidad del hub.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image / Gradient placeholder */}
              <div
                className={`relative h-48 bg-gradient-to-br ${product.imageGradient} overflow-hidden`}
              >
                {/* Decorative code pattern */}
                <div className="absolute inset-0 opacity-20" />

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                  {product.title}
                </h3>

                {/* Origin + Price */}
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-violet-600">
                      {product.source}
                    </span>
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-violet-600 font-medium">
                    {product.price} {product.currency}
                  </span>
                </div>

                {/* Price + Button */}
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-violet-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`#producto-${product.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 hover:scale-105"
                  >
                    Ver producto
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
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
          ))}
        </div>
      </div>
    </section>
  )
}