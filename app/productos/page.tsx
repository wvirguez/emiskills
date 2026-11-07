import type { Metadata } from "next";
import { connection } from "next/server";
import CategoryChips from "@/components/CategoryChips";
import Pagination from "@/components/Pagination";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import { getCategories, getProducts } from "@/lib/products";
import { parseSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Catálogo de productos | EmiSkills",
  description:
    "Busca y filtra cursos, ebooks, plantillas y membresías de varios productores.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: Props) {
  await connection();
  const filters = parseSearchParams(await searchParams);

  const categories = await getCategories();
  const categoria = categories.some((c) => c.slug === filters.categoria)
    ? filters.categoria
    : undefined;

  const result = await getProducts({
    q: filters.q,
    categorySlug: categoria,
    page: filters.page,
  });

  return (
    <section className="bg-gradient-to-b from-violet-50 to-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Catálogo de productos
        </h1>

        <div className="mx-auto mt-8 max-w-2xl">
          <SearchForm q={filters.q} categoria={categoria} />
        </div>
        <div className="mt-6 mb-10">
          <CategoryChips categories={categories} activeSlug={categoria} q={filters.q} />
        </div>

        <SearchResults result={result} />
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          q={filters.q}
          categoria={categoria}
        />
      </div>
    </section>
  );
}
