// src/components/PopularCourses.tsx
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Desarrollo Java Full Stack",
    category: "Desarrollo",
    price: 45.0,
    rating: 4.8,
    students: 1250,
    imageGradient: "from-violet-500 to-purple-600",
  },
  {
    id: 2,
    title: "Desarrollo Python Full Stack",
    category: "Desarrollo",
    price: 42.0,
    rating: 4.9,
    students: 1890,
    imageGradient: "from-fuchsia-500 to-pink-600",
  },
  {
    id: 3,
    title: "Desarrollo Front & Full Stack",
    category: "Desarrollo",
    price: 39.0,
    rating: 4.7,
    students: 980,
    imageGradient: "from-indigo-500 to-violet-600",
  },
];

export default function PopularCourses() {
  return (
    <section className="bg-gradient-to-b from-violet-50 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros Cursos{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Más Populares
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Estos temas ofrecen un marco integral para estructurar tus
            objetivos y resultan atractivos tanto para principiantes como para aprendices avanzados. Explora
            las áreas que más te interesen.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image / Gradient placeholder */}
              <div
                className={`relative h-48 bg-gradient-to-br ${course.imageGradient} overflow-hidden`}
              >
                {/* Decorative code pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 text-white/80 font-mono text-xs leading-relaxed">
                    <div>const learn = () =&gt; {"{"}</div>
                    <div className="pl-4">return success;</div>
                    <div>{"}"}</div>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                  {course.title}
                </h3>

                {/* Rating + Students */}
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-gray-700">
                      {course.rating}
                    </span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>

                {/* Price + Button */}
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-violet-600">
                      ${course.price.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`#course-${course.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 hover:scale-105"
                  >
                    View Course
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

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link
            href="#all-courses"
            className="inline-flex items-center gap-2 rounded-full border-2 border-violet-600 bg-white px-8 py-3 text-sm font-semibold text-violet-600 transition-all hover:bg-violet-50 hover:scale-105"
          >
            Ver todos los Cursos
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
    </section>
  );
}