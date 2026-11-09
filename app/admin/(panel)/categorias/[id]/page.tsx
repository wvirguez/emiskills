import { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { getCategoryById } from "@/lib/categories";
import CategoryForm from "../category-form";
import { updateCategoryAction } from "../actions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editar categoría | Panel de administración",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarCategoriaPage({ params }: PageProps) {
  await verifySession();

  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  const boundUpdateAction = updateCategoryAction.bind(null, id);

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
          <h1 className="text-2xl font-bold text-gray-900">Editar categoría</h1>
          <p className="mt-1 text-sm text-gray-600">Modifica el nombre de la categoría.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
        <CategoryForm
          action={boundUpdateAction}
          initialName={category.name}
          isCreating={false}
        />
      </div>
    </div>
  );
}