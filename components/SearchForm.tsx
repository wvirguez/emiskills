type Props = { q?: string; categoria?: string; id?: string };

export default function SearchForm({ q, categoria, id = "q" }: Props) {
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
        className="w-full min-w-0 border-0 bg-transparent py-4 pl-5 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      {categoria ? <input type="hidden" name="categoria" value={categoria} /> : null}
      <button
        type="submit"
        className="m-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
      >
        Buscar
      </button>
    </form>
  );
}
