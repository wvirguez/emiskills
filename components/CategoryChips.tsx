import Link from "next/link";
import type { CategoryDTO } from "@/lib/products";
import { buildProductsHref } from "@/lib/search-params";

type Props = {
  categories: Pick<CategoryDTO, "slug" | "name">[];
  activeSlug?: string;
  q?: string;
};

const base = "rounded-full px-3 py-1.5 text-xs font-medium transition-colors";
const idle = "bg-violet-50 text-violet-600 hover:bg-violet-100";
const active = "bg-violet-600 text-white";

export default function CategoryChips({ categories, activeSlug, q }: Props) {
  return (
    <nav aria-label="Categorías" className="flex flex-wrap justify-center gap-2">
      <Link
        href={buildProductsHref({ q })}
        aria-current={!activeSlug ? "page" : undefined}
        className={`${base} ${!activeSlug ? active : idle}`}
      >
        Todos
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={buildProductsHref({ q, categoria: c.slug })}
          aria-current={activeSlug === c.slug ? "page" : undefined}
          className={`${base} ${activeSlug === c.slug ? active : idle}`}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
