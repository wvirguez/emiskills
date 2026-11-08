import Link from "next/link";
import type { CategoryDTO } from "@/lib/products";
import { buildProductsHref, type ExtraFilters } from "@/lib/search-params";

type Props = {
  categories: Pick<CategoryDTO, "slug" | "name">[];
  activeSlug?: string;
  q?: string;
  filters?: ExtraFilters;
};

const base = "rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-[44px] flex items-center";
const idle = "bg-violet-50 text-violet-600 hover:bg-violet-100";
const active = "bg-violet-600 text-white";

export default function CategoryChips({ categories, activeSlug, q, filters }: Props) {
  return (
    <nav aria-label="Categorías" className="flex flex-wrap justify-center gap-2">
      <Link
        href={buildProductsHref({ q, ...filters })}
        aria-current={!activeSlug ? "page" : undefined}
        className={`${base} ${!activeSlug ? active : idle}`}
      >
        Todos
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={buildProductsHref({ q, ...filters, categoria: c.slug })}
          aria-current={activeSlug === c.slug ? "page" : undefined}
          className={`${base} ${activeSlug === c.slug ? active : idle}`}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
