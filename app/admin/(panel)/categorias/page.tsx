import { Metadata } from "next";
import { verifySession } from "@/lib/auth/session";
import { listCategoriesWithCount } from "@/lib/categories";
import { getOkMessage, getErrorMessage } from "./messages";
import { deleteCategoryAction } from "./actions";
import DeleteCategoryButton from "./delete-category-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categorías | Panel de administración",
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; count?: string }>;
}) {
  await verifySession();

  const params = await searchParams;
  const okMessage = getOkMessage(params.ok ?? null);
  const errorMessage = getErrorMessage(params.error ?? null, params.count ?? null);

  const categories = await listCategoriesWithCount();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Panel
          </Link>
          <span className="text-gray-300">/</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
            <p className="mt-1 text-sm text-gray-600">Gestiona las categorías de productos.</p>
          </div>
        </div>
        <Link
          href="/admin/categorias/nueva"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors self-start"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva categoría
        </Link>
      </div>

      {okMessage && (
        <div role="status" className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
          {okMessage}
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay categorías</h3>
          <p className="mt-2 text-sm text-gray-600">Crea la primera categoría para empezar a organizar los productos.</p>
          <div className="mt-6">
            <Link
              href="/admin/categorias/nueva"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear categoría
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/categorias/${category.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(category.productCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* En el archivo actions.ts, deleteCategoryAction tiene la firma (id, _prevState, formData) => Promise<void>
      DeleteCategoryButton espera (formData) => Promise<void>
      Usamos una función wrapper para adaptar la firma */}

          <DeleteCategoryButton
            action={async (formData: FormData) => {
              "use server";
              await deleteCategoryAction(category.id, undefined, formData);
            }}
            productCount={category.productCount}
            categoryName={category.name}
          />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4">
            {categories.map((category) => (
              <article
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/categorias/${category.id}`}
                    className="text-blue-600 hover:text-blue-900 font-medium text-lg"
                  >
                    {category.name}
                  </Link>
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {formatNumber(category.productCount)} {category.productCount === 1 ? "producto" : "productos"}
                  </span>
                  <DeleteCategoryButton
                    action={async (formData: FormData) => {
                      "use server";
                      await deleteCategoryAction(category.id, undefined, formData);
                    }}
                    productCount={category.productCount}
                    categoryName={category.name}
                  />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}