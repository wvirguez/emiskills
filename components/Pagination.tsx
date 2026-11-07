import Link from "next/link";
import { buildProductsHref, type ExtraFilters } from "@/lib/search-params";

type Props = {
  page: number;
  totalPages: number;
  q?: string;
  categoria?: string;
  filters?: ExtraFilters;
};

const linkClass =
  "rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100";

export default function Pagination({ page, totalPages, q, categoria, filters }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link
          rel="prev"
          href={buildProductsHref({ q, categoria, ...filters, page: page - 1 })}
          className={linkClass}
        >
          ← Anterior
        </Link>
      ) : null}
      <span className="text-sm text-gray-600">
        Página {Math.min(page, totalPages)} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          rel="next"
          href={buildProductsHref({ q, categoria, ...filters, page: page + 1 })}
          className={linkClass}
        >
          Siguiente →
        </Link>
      ) : null}
    </nav>
  );
}
