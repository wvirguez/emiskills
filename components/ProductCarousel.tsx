"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import type { ProductDTO } from "@/lib/products";
import ProductCardCompact from "@/components/ProductCardCompact";
import { buildProductsHref } from "@/lib/search-params";

interface ProductCarouselProps {
  products: ProductDTO[];
  activeCategoryName: string;
  validSlug?: string;
}

const SCROLL_AMOUNT = 320; // ~ancho de tarjeta + gap

export default function ProductCarousel({
  products,
  activeCategoryName,
  validSlug,
}: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    }
  }, []);

  if (products.length === 0) {
    return (
      <p className="shrink-0 w-64 text-center text-gray-600 py-8">
        Aún no hay productos en esta categoría.
      </p>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Botón anterior */}
      <button
        type="button"
        onClick={scrollLeft}
        aria-label="Desplazar a la izquierda"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-gray-200 text-violet-600 transition-all hover:bg-white hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[44px] min-w-[44px]"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Carrusel */}
      <div
        ref={carouselRef}
        id="productos-panel"
        role="region"
        aria-label={`Productos de ${activeCategoryName}`}
        tabIndex={0}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4 pr-16 pl-16 scrollbar-hide"
      >
        <ul role="list" aria-label={`Productos de ${activeCategoryName}`} className="flex gap-4">
          {products.map((product) => (
            <li key={product.id} className="shrink-0 snap-start">
              <ProductCardCompact product={product} />
            </li>
          ))}
          <li className="shrink-0 snap-start w-64 flex items-center">
            <Link
              href={buildProductsHref({ categoria: validSlug })}
              className="inline-flex items-center gap-1.5 w-full justify-center rounded-full bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 min-h-[44px]"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Ver todos en el catálogo
            </Link>
          </li>
        </ul>
      </div>

      {/* Botón siguiente */}
      <button
        type="button"
        onClick={scrollRight}
        aria-label="Desplazar a la derecha"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-gray-200 text-violet-600 transition-all hover:bg-white hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[44px] min-w-[44px]"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}