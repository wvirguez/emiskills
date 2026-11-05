// src/components/FinalCTA.tsx
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-100 via-fuchsia-50 to-violet-50 py-16 sm:py-20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              ¡Gracias por visitar EmiSkills!
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                ¡Estamos aquí para ayudarte a encontrar lo que necesitas!
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 mx-auto lg:mx-0">
              Explora nuestro catálogo de productos digitales, elige el que mejor se adapte a tus necesidades y
              accede directamente a la plataforma del productor. Tu aprendizaje comienza aquí.
            </p>

            <div className="mt-10">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-100"
              >
                Ver productos
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right - Image + Badge */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md order-1 lg:order-2">
            {/* Main circular container */}
            <div className="relative mx-auto aspect-square w-64 sm:w-72 lg:w-80">
              {/* Purple circle background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 shadow-2xl" />

              {/* Decorative rings */}
              <div className="absolute -inset-3 rounded-full border-2 border-violet-300/40" />
              <div className="absolute -inset-6 rounded-full border border-fuchsia-200/30" />

              {/* Placeholder for the guy image */}
              <div className="absolute inset-4 overflow-hidden rounded-full bg-gradient-to-b from-violet-100 to-fuchsia-50 flex items-end justify-center">
                <div className="relative h-full w-full flex items-end justify-center">
                  <div className="mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-300 sm:h-40 sm:w-40">
                    <svg
                      className="h-16 w-16 text-white/90 sm:h-20 sm:w-20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge - Catálogo variado */}
            <div className="absolute -left-2 top-6 sm:left-0 sm:top-10 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                  <svg
                    className="h-5 w-5 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Catálogo variado</p>
                  <p className="text-xs text-gray-500">Productos digitales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}