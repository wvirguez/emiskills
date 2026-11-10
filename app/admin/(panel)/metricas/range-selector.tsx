import Link from "next/link";
import type { MetricsRange } from "@/lib/click-metrics";

const OPTIONS: { value: MetricsRange; label: string }[] = [
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "todo", label: "Todo" },
];

export default function RangeSelector({ active }: { active: MetricsRange }) {
  return (
    <nav aria-label="Rango de fechas" className="inline-flex rounded-md border border-gray-200 bg-white p-1">
      {OPTIONS.map((o) => {
        const isActive = o.value === active;
        return (
          <Link
            key={o.value}
            href={`/admin/metricas?rango=${o.value}`}
            aria-current={isActive ? "page" : undefined}
            className={`px-3 py-1.5 text-sm font-medium rounded ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
    </nav>
  );
}
