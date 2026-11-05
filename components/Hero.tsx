// src/components/Hero.tsx
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-fuchsia-50 to-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Desbloquea tu potencial{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                con Nosotros
              </span>
              <br />
              Explora, Aprende y Crece!
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 mx-auto lg:mx-0">
              Bienvenido a EmiSkills, donde comienza tu camino hacia el conocimiento!
              <br />
              Domina las habilidades más demandadas del mercado sin perder meses en teoría inútil.
              Cursos y recursos digitales diseñados para que pases de cero a la ejecución en tiempo record.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-100"
              >
                Obten una Propuesta
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center justify-center rounded-full border-2 border-violet-600 bg-white px-8 py-3.5 text-base font-semibold text-violet-600 transition-all hover:bg-violet-50 hover:scale-105 active:scale-100"
              >
                Intentalo Ahora!
              </Link>
            </div>
          </div>

          {/* Right image + badges */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Main circular container */}
            <div className="relative mx-auto aspect-square w-72 sm:w-80 lg:w-96">
              {/* Purple circle background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 shadow-2xl" />

              {/* Decorative rings */}
              <div className="absolute -inset-3 rounded-full border-2 border-violet-300/50" />
              <div className="absolute -inset-6 rounded-full border border-fuchsia-200/40" />

              {/* Placeholder for the girl image - replace with real image later */}
              <div className="absolute inset-4 overflow-hidden rounded-full bg-gradient-to-b from-violet-100 to-fuchsia-50 flex items-end justify-center">
                {/* Temporary avatar placeholder - replace src with your image */}
                <div className="relative h-full w-full">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[90%] rounded-t-full bg-gradient-to-t from-violet-200 to-transparent flex items-end justify-center">
                    <svg
                      className="h-40 w-40 text-violet-400/80 mb-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge - Productos digitales */}
            <div className="absolute -left-2 top-8 sm:left-0 sm:top-12 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
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
                  <p className="text-lg font-bold text-gray-900">Productos digitales</p>
                  <p className="text-xs text-gray-500">Catálogo variado</p>
                </div>
              </div>
            </div>

            {/* Floating badge - Cursos y Recursos */}
            <div className="absolute -right-2 bottom-16 sm:right-0 sm:bottom-20 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100">
                  <svg
                    className="h-5 w-5 text-fuchsia-600"
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
                <div>
                  <p className="text-lg font-bold text-gray-900">Cursos y Recursos</p>
                  <p className="text-xs text-gray-500">Amplia selección</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}