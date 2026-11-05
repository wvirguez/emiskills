// src/components/OnlineLearning.tsx
import Link from "next/link";

const students = [
  { id: 1, name: "Student 1" },
  { id: 2, name: "Student 2" },
  { id: 3, name: "Student 3" },
  { id: 4, name: "Student 4" },
];

export default function OnlineLearning() {
  return (
    <section className="bg-gradient-to-b from-white to-violet-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left - Student Cards (2x2) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {students.map((student) => (
              <div
                key={student.id}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-fuchsia-50 to-violet-50 shadow-md ring-1 ring-violet-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:ring-violet-200"
              >
                {/* Placeholder avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 shadow-lg sm:h-24 sm:w-24">
                    <svg
                      className="h-10 w-10 text-white/90 sm:h-12 sm:w-12"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>

          {/* Right - Gain for our Online Learning */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ganancia por nuestro{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Aprendizaje en línea
              </span>
            </h2>

            <p className="mt-4 text-base leading-relaxed text-gray-600">
              El nuevo y completo sistema educativo que cambiar&aacute; tu vida
              para siempre. &Uacute;nete a los miles de aprendices que ya usan nuestro sistema y
              abre la puerta a nuevas oportunidades.
            </p>

            <ul className="mt-8 space-y-6">
              {/* Online Degree */}
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Título en línea
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Obtén títulos reconocidos totalmente en línea de instituciones de primer nivel.
                  </p>
                </div>
              </li>

              {/* Certification */}
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Certificaci&oacute;n
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Obtén certificados reconocidos por la industria tras completar los cursos.
                  </p>
                </div>
              </li>

              {/* Placements */}
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Placements
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Apoyo dedicado a la colocación laboral para ayudarte a conseguir el trabajo de tus sueños.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <Link
                href="#courses"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-100"
              >
                Comienza a Aprender Hoy
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
        </div>
      </div>
    </section>
  );
}