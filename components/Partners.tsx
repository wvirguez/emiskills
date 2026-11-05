// src/components/Partners.tsx
export default function Partners() {
  return (
    <section className="bg-gradient-to-r from-violet-100 via-fuchsia-50 to-violet-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-wider text-violet-600">
          Plataformas de origen de los productos
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 md:gap-x-20">
          {/* Hotmart */}
          <div className="flex items-center gap-2 text-gray-600 transition-all hover:text-gray-900 hover:scale-105">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.32-2.48 3.96-2.48 1.26 0 2.43.74 3.28.74.84 0 2.17-.91 3.66-.78 1.42.11 2.48.75 3.19 1.85-2.89 1.55-2.42 5.24.4 6.42-.56 1.45-1.28 2.9-2.48 4.36zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-lg font-semibold">Hotmart</span>
          </div>

          {/* Otros productores */}
          <div className="flex items-center gap-2 text-gray-600 transition-all hover:text-gray-900 hover:scale-105">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-violet-600 text-sm font-bold text-white">
              +
            </div>
            <span className="text-lg font-semibold">Otros productores</span>
          </div>
        </div>
      </div>
    </section>
  );
}