import type { Metadata } from "next";
import { connection } from "next/server";
import CategoryChips from "@/components/CategoryChips";
import Pagination from "@/components/Pagination";
import ProductFilters from "@/components/ProductFilters";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import AffiliateNotice from "@/components/AffiliateNotice";
import { getCategories, getFilterOptions, getPlatforms, getProducts } from "@/lib/products";
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

  const [categories, platforms, options] = await Promise.all([
    getCategories(),
    getPlatforms(),
    getFilterOptions(),
  ]);
  const categoria = categories.some((c) => c.slug === filters.categoria)
    ? filters.categoria
    : undefined;
  const plataforma = platforms.some((p) => p.slug === filters.plataforma)
    ? filters.plataforma
    : undefined;
  const idioma = options.languages.includes(filters.idioma ?? "")
    ? filters.idioma
    : undefined;
  const hasPrice = filters.precioMin !== undefined || filters.precioMax !== undefined;
  const moneda = options.currencies.includes(filters.moneda ?? "")
    ? filters.moneda
    : hasPrice
      ? options.currencies[0]
      : undefined;
  const extra = {
    precioMin: filters.precioMin,
    precioMax: filters.precioMax,
    moneda,
    idioma,
    plataforma,
  };

  const result = await getProducts({
    q: filters.q,
    categorySlug: categoria,
    minPrice: filters.precioMin,
    maxPrice: filters.precioMax,
    currency: moneda,
    language: idioma,
    platformSlug: plataforma,
    page: filters.page,
  });

  return (
    <section className="bg-gradient-to-b from-violet-50 to-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Catálogo de productos
        </h1>

        <div className="mx-auto mt-8 max-w-2xl">
          <SearchForm q={filters.q} categoria={categoria} filters={extra} />
        </div>
        <div className="mt-6 mb-10">
          <CategoryChips categories={categories} activeSlug={categoria} q={filters.q} filters={extra} />
        </div>

        <div className="mb-8">
          <ProductFilters
            q={filters.q}
            categoria={categoria}
            filters={extra}
            platforms={platforms}
            options={options}
          />
        </div>

        <AffiliateNotice />

        <SearchResults result={result} />
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          q={filters.q}
          categoria={categoria}
          filters={extra}
        />
      </div>
    </section>
  );
}
