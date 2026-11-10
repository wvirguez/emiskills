import type { CategoryClicks, DayClicks, ProductClicks } from "@/lib/click-metrics";

const nf = new Intl.NumberFormat("es-ES");
const df = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeZone: "UTC" });

export function formatDay(date: string): string {
  return df.format(new Date(`${date}T00:00:00Z`));
}

export function percentOf(part: number, total: number): string {
  if (total <= 0) return "0 %";
  return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format((part / total) * 100)} %`;
}

const th = "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

export function ProductTable({ rows }: { rows: ProductClicks[] }) {
  return (
    <Section title="Clics por producto">
      {rows.length === 0 ? (
        <p className="text-sm text-gray-600">No hay productos.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className={th}>Producto</th>
                  <th scope="col" className={th}>Categoría</th>
                  <th scope="col" className={`${th} text-right`}>Clics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.categoryName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{nf.format(r.clicks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="md:hidden space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-600">{r.categoryName}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{nf.format(r.clicks)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

export function CategoryTable({ rows, total }: { rows: CategoryClicks[]; total: number }) {
  return (
    <Section title="Clics por categoría">
      {rows.length === 0 ? (
        <p className="text-sm text-gray-600">No hay categorías.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className={th}>Categoría</th>
                  <th scope="col" className={`${th} text-right`}>Clics</th>
                  <th scope="col" className={`${th} text-right`}>% del total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{nf.format(r.clicks)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{percentOf(r.clicks, total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="md:hidden space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between gap-3">
                <p className="font-medium text-gray-900">{r.name}</p>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{nf.format(r.clicks)}</span>{" "}
                  <span className="text-gray-600">({percentOf(r.clicks, total)})</span>
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

export function DayList({ rows }: { rows: DayClicks[] }) {
  const max = Math.max(1, ...rows.map((r) => r.clicks));
  return (
    <Section title="Clics por día (fechas en UTC)">
      {rows.length === 0 ? (
        <p className="text-sm text-gray-600">No hay clics en este rango.</p>
      ) : (
        <ul className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {rows.map((r) => (
            <li key={r.date} className="flex items-center gap-3 px-4 py-2 text-sm">
              <time dateTime={r.date} className="w-28 shrink-0 text-gray-700">{formatDay(r.date)}</time>
              <div className="flex-1 h-2 rounded bg-gray-100" aria-hidden="true">
                <div
                  data-testid="day-bar"
                  className="h-2 rounded bg-blue-500"
                  style={{ width: `${(r.clicks / max) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right font-medium text-gray-900">{nf.format(r.clicks)}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
