import type { ExtraFilters } from "@/lib/search-params";

type Props = { q?: string; categoria?: string; id?: string; filters?: ExtraFilters };

export default function SearchForm({ q, categoria, id = "q", filters }: Props) {
  return (
    <form
      role="search"
      method="get"
      action="/productos/"
      className="flex overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-violet-500"
    >
      <label htmlFor={id} className="sr-only">
        Buscar productos
      </label>
      <input
        id={id}
        type="search"
        name="q"
        defaultValue={q}
        maxLength={100}
        placeholder="Buscar productos..."
        className="w-full min-w-0 border-0 bg-transparent py-4 pl-5 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none min-h-[44px]"
      />
      {categoria ? <input type="hidden" name="categoria" value={categoria} /> : null}
      {filters?.precioMin !== undefined ? (
        <input type="hidden" name="precioMin" value={filters.precioMin} />
      ) : null}
      {filters?.precioMax !== undefined ? (
        <input type="hidden" name="precioMax" value={filters.precioMax} />
      ) : null}
      {filters?.moneda ? <input type="hidden" name="moneda" value={filters.moneda} /> : null}
      {filters?.idioma ? <input type="hidden" name="idioma" value={filters.idioma} /> : null}
      {filters?.plataforma ? (
        <input type="hidden" name="plataforma" value={filters.plataforma} />
      ) : null}
      <button
        type="submit"
        className="m-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-base font-semibold text-white shadow-md transition hover:shadow-lg min-h-[44px] min-w-[44px]"
      >
        Buscar
      </button>
    </form>
  );
}
