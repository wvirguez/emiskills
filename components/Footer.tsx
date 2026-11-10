'use client';
// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 min-h-[44px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Emi<span className="text-violet-400">Skills</span>
              </span>
            </Link>
            <p className="text-base leading-relaxed text-gray-400 max-w-xs">
              Libera tu potencial. Explora, aprende y crece con los mejores productos digitales y cursos en línea.
            </p>
            <p className="text-base leading-relaxed text-gray-400 max-w-xs">
              Reunimos productos de Hotmart y de otros productores.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Enlaces rápidos
            </h2>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/#productos" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/#categorias" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/#buscar" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                  Buscar
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-violet-400 transition-colors min-h-[44px] flex items-center">
                  Cómo funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Affiliate Disclosure */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Aviso de afiliados
            </h2>
            <p className="text-base leading-relaxed text-gray-400">
              EmiSkills es un hub de productos digitales que muestra ofertas de varios productores. Cuando haces clic en un producto y te registras o compras en la plataforma del productor, podemos recibir una comisión por referencia. Las comisiones no influyen en el orden ni en la presentación de los productos.
            </p>
          </div>

          {/* Contact / Social */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Estar Conectado
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Suscríbete para recibir los últimos cursos y ofertas
            </p>
            <div className="flex gap-3">
              {/* Twitter / X */}
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-violet-600 hover:text-white min-h-[44px] min-w-[44px]"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.792l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-violet-600 hover:text-white min-h-[44px] min-w-[44px]"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-violet-600 hover:text-white min-h-[44px] min-w-[44px]"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-base text-gray-400">
            © {new Date().getFullYear()} EmiSkills. Todos los Derechos Reservados.
          </p>
          <p className="text-base text-gray-400">
            Diseñado con ❤️ para visitantes de todo el Mundo
          </p>
        </div>
      </div>
    </footer>
  )
}