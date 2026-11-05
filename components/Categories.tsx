// src/components/Categories.tsx
import Link from "next/link";

type Category = {
  name: string
  slug: string
}

const categories: Category[] = [
  { name: "Cursos", slug: "cursos" },
  { name: "Ebooks", slug: "ebooks" },
  { name: "Plantillas", slug: "plantillas" },
  { name: "Membresías", slug: "membresias" },
]

export default function Categories() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Categorías
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Explora productos por categoría
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`#${cat.slug}`}
              className={`inline-flex items-center rounded-full border-2 border-violet-600 bg-white px-4 py-2 text-sm font-medium text-violet-600 transition-all hover:bg-violet-50 hover:scale-105`}
            >
              <svg
                className="h-4 w-4 mr-2 text-violet-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}