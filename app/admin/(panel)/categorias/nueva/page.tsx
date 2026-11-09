import { Metadata } from "next";
import { verifySession } from "@/lib/auth/session";
import CategoryForm from "../category-form";
import { createCategoryAction } from "../actions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nueva categoría | Panel de administración",
};

export default async function NuevaCategoriaPage() {
  await verifySession();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categorias"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Volver a categorías
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Panel
          </Link>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Nueva categoría</h1>
          <p className="mt-1 text-sm text-gray-600">Crea una nueva categoría para organizar los productos.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
        <CategoryForm action={createCategoryAction} isCreating={true} />
      </div>
    </div>
  );
}