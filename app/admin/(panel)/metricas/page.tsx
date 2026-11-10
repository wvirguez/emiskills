import { Metadata } from "next";
import Link from "next/link";
import { verifySession } from "@/lib/auth/session";
import {
  getClickTotals,
  getClicksByCategory,
  getClicksByDay,
  getClicksByProduct,
  parseRange,
} from "@/lib/click-metrics";
import RangeSelector from "./range-selector";
import { CategoryTable, DayList, ProductTable } from "./metrics-tables";

export const metadata: Metadata = {
  title: "Métricas | Panel de administración",
};

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: Promise<{ rango?: string | string[] }>;
}) {
  await verifySession();

  const range = parseRange((await searchParams).rango);

  const [total, byProduct, byCategory, byDay] = await Promise.all([
    getClickTotals(range),
    getClicksByProduct(range),
    getClicksByCategory(range),
    getClicksByDay(range),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Volver al panel
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Métricas de clics</h1>
          <p className="mt-1 text-sm text-gray-600">Un clic no equivale a una venta.</p>
        </div>
        <RangeSelector active={range} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600">Total de clics</p>
        <p className="text-3xl font-bold text-gray-900" data-testid="total-clicks">
          {new Intl.NumberFormat("es-ES").format(total)}
        </p>
      </div>

      {total === 0 && (
        <p role="status" className="p-3 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
          No hay clics registrados en este rango.
        </p>
      )}

      <ProductTable rows={byProduct} />
      <CategoryTable rows={byCategory} total={total} />
      <DayList rows={total === 0 ? [] : byDay} />
    </div>
  );
}
