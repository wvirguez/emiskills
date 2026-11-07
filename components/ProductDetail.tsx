import Link from "next/link";
import type { ProductDTO } from "@/lib/products";
import { DEFAULT_GRADIENT, formatLanguage, formatPrice } from "@/lib/product-ui";

export default function ProductDetail({ product }: { product: ProductDTO }) {
  const paragraphs = (product.description ?? product.shortDescription)
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="bg-gradient-to-b from-violet-50 to-white py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/productos"
          className="text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          ← Volver al catálogo
        </Link>

        <article className="mt-6 grid gap-8 lg:grid-cols-2">
          <div
            className={`relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br shadow-md lg:h-full lg:min-h-80 ${product.imageGradient ?? DEFAULT_GRADIENT}`}
          >
            <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm">
              {product.category.name}
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.title}
            </h1>

            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
              <div className="flex gap-1">
                <dt>Plataforma:</dt>
                <dd className="text-violet-600">{product.platform.name}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Idioma:</dt>
                <dd className="text-violet-600">{formatLanguage(product.language)}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-700">
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
              <p className="text-3xl font-bold text-violet-600">
                {formatPrice(product.price, product.currency)}
              </p>
              <Link
                href={`/go/${product.slug}`}
                rel="sponsored nofollow"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-700 sm:w-auto"
              >
                Ir a la oferta
              </Link>
              <p className="mt-3 text-xs text-gray-500">
                Aviso de afiliado: si compras en la plataforma del productor,
                podemos recibir una comisión, sin costo extra para ti. El precio
                se muestra en la moneda de origen del producto.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
