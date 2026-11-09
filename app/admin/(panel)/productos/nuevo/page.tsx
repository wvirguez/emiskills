import { Metadata } from "next";
import { verifySession } from "@/lib/auth/session";
import { getCategories } from "@/lib/products";
import { listPlatforms } from "@/lib/admin-products";
import ProductForm from "../product-form";
import { createProductAction } from "../actions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nuevo producto | Panel de administración",
};

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  await verifySession();

  const [categories, platforms] = await Promise.all([getCategories(), listPlatforms()]);

  if (categories.length === 0 || platforms.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/productos"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver a productos
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
            <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
            <p className="mt-1 text-sm text-gray-600">Crea un nuevo producto manual.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-medium mb-2">No se puede crear un producto</h3>
            <p className="text-sm">
              Necesitas tener al menos una categoría y una plataforma creadas antes de poder crear productos.
            </p>
            <div className="mt-4">
              <Link
                href="/admin/categorias"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Ir a categorías
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/productos"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Volver a productos
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
          <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
          <p className="mt-1 text-sm text-gray-600">Crea un nuevo producto manual.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
        <ProductForm action={createProductAction} categories={categories} platforms={platforms} isCreating={true} />
      </div>
    </div>
  );
}