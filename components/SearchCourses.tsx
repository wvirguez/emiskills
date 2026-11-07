import CategoryChips from "@/components/CategoryChips";
import SearchForm from "@/components/SearchForm";
import { getCategories, type CategoryDTO } from "@/lib/products";

async function loadCategories(): Promise<CategoryDTO[]> {
  try {
    return await getCategories();
  } catch (error) {
    console.error("No se pudieron cargar las categorías", error);
    return [];
  }
}

export default async function SearchCourses() {
  const categories = await loadCategories();

  return (
    <section id="buscar" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Buscar Productos
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Encuentra el producto perfecto para tus objetivos profesionales.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchForm id="q-landing" />
          </div>
          <div className="mt-8">
            <CategoryChips categories={categories} />
          </div>
        </div>
      </div>
    </section>
  );
}
