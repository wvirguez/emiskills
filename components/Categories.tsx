import { connection } from "next/server";
import Link from "next/link";
import { getCategories, getProducts, type CategoryDTO, type ProductDTO } from "@/lib/products";
import { buildHomeCategoryHref } from "@/lib/search-params";
import ProductCarousel from "@/components/ProductCarousel";

interface CategoriesProps {
  categoriaActiva?: string;
}

async function loadCategories(): Promise<CategoryDTO[]> {
  try {
    return await getCategories();
  } catch (error) {
    console.error("No se pudieron cargar las categorías", error);
    return [];
  }
}

async function loadProducts(categorySlug?: string): Promise<ProductDTO[]> {
  try {
    const { items } = await getProducts({ categorySlug, pageSize: 12 });
    return items;
  } catch (error) {
    console.error("No se pudieron cargar los productos", error);
    return [];
  }
}

export default async function Categories({ categoriaActiva }: CategoriesProps) {
  await connection();

  const categories = await loadCategories();

  const validSlug = categories.some((c) => c.slug === categoriaActiva) ? categoriaActiva : undefined;

  const activeCategoryName = validSlug
    ? categories.find((c) => c.slug === validSlug)?.name ?? "Todas"
    : "Todas";
  const products = await loadProducts(validSlug);

  return (
    <section id="categorias" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Categorías
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Explora productos por categoría
          </p>
        </div>

        <nav
          aria-label="Categorías"
          className="flex flex-wrap justify-center gap-2 mb-8"
          role="tablist"
        >
          <Link
            href={buildHomeCategoryHref()}
            aria-current={!validSlug ? "page" : undefined}
            aria-controls="productos-panel"
            role="tab"
            scroll={false}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !validSlug
                ? "bg-violet-600 text-white"
                : "bg-violet-50 text-violet-600 hover:bg-violet-100"
            }`}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-violet-600"
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
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={buildHomeCategoryHref(cat.slug)}
              aria-current={validSlug === cat.slug ? "page" : undefined}
              aria-controls="productos-panel"
              role="tab"
              scroll={false}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                validSlug === cat.slug
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-600 hover:bg-violet-100"
              }`}
            >
              <svg
                aria-hidden="true"
                className={`h-4 w-4 ${validSlug === cat.slug ? "text-white" : "text-violet-600"}`}
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
        </nav>

        <ProductCarousel
          products={products}
          activeCategoryName={activeCategoryName}
          validSlug={validSlug}
        />
      </div>
    </section>
  );
}