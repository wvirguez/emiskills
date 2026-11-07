import Link from "next/link";
import type { PlatformDTO, FilterOptions } from "@/lib/products";
import { formatLanguage } from "@/lib/product-ui";
import { buildProductsHref, type ExtraFilters } from "@/lib/search-params";

type Props = {
  q?: string;
  categoria?: string;
  filters: ExtraFilters;
  platforms: Pick<PlatformDTO, "slug" | "name">[];
  options: FilterOptions;
};

const field =
  "w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500";
const label = "mb-1 block text-xs font-medium text-gray-600";

export default function ProductFilters({
  q,
  categoria,
  filters,
  platforms,
  options,
}: Props) {
  const active = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <input
        id="f-toggle"
        type="checkbox"
        defaultChecked={active}
        aria-label="Mostrar filtros"
        className="peer sr-only"
      />
      <label
        htmlFor="f-toggle"
        className="block cursor-pointer text-sm font-semibold text-violet-700 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-violet-500 md:hidden"
      >
        Filtros{active ? " (activos)" : ""}
      </label>
      <form
        method="get"
        action="/productos/"
        aria-label="Filtros de productos"
        className="mt-4 hidden gap-4 peer-checked:grid sm:grid-cols-2 md:mt-0 md:grid lg:grid-cols-5"
      >
        {q ? <input type="hidden" name="q" value={q} /> : null}
        {categoria ? <input type="hidden" name="categoria" value={categoria} /> : null}

        <div>
          <label htmlFor="f-precio-min" className={label}>
            Precio mínimo
          </label>
          <input
            id="f-precio-min"
            type="number"
            name="precioMin"
            min={0}
            step="0.01"
            inputMode="decimal"
            defaultValue={filters.precioMin}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="f-precio-max" className={label}>
            Precio máximo
          </label>
          <input
            id="f-precio-max"
            type="number"
            name="precioMax"
            min={0}
            step="0.01"
            inputMode="decimal"
            defaultValue={filters.precioMax}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="f-moneda" className={label}>
            Moneda
          </label>
          <select id="f-moneda" name="moneda" defaultValue={filters.moneda ?? ""} className={field}>
            <option value="">Todas</option>
            {options.currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-idioma" className={label}>
            Idioma
          </label>
          <select id="f-idioma" name="idioma" defaultValue={filters.idioma ?? ""} className={field}>
            <option value="">Todos</option>
            {options.languages.map((l) => (
              <option key={l} value={l}>
                {formatLanguage(l)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-plataforma" className={label}>
            Plataforma
          </label>
          <select
            id="f-plataforma"
            name="plataforma"
            defaultValue={filters.plataforma ?? ""}
            className={field}
          >
            <option value="">Todas</option>
            {platforms.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-500 sm:col-span-2 lg:col-span-5">
          El rango de precio se aplica en la moneda seleccionada; no convertimos monedas.
        </p>
        <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-5">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Aplicar filtros
          </button>
          <Link
            href={buildProductsHref({ q, categoria })}
            className="text-sm font-medium text-violet-700 hover:underline"
          >
            Limpiar filtros
          </Link>
        </div>
      </form>
    </div>
  );
}
