// src/components/SearchCourses.tsx
import Link from "next/link";

export default function SearchCourses() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title + Search Bar */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Buscar Productos
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Encuentra el producto perfecto para tus objetivos profesionales.
          </p>

          {/* Search Input + Category Chips */}
          <div className="mt-8 mx-auto max-w-2xl">
            <div className="flex rounded-full bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 transition">
              <div className="flex items-center pl-5 text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full border-0 bg-transparent py-4 pl-3 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 text-base"
              />
              <button
                type="button"
                className="m-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:scale-105 active:scale-100"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-100"
            >
              Todos
            </button>
            <button
              type="button"
              className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
            >
              Cursos
            </button>
            <button
              type="button"
              className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
            >
              Ebooks
            </button>
            <button
              type="button"
              className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
            >
              Plantillas
            </button>
            <button
              type="button"
              className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-50"
            >
              Membresías
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}