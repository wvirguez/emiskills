import { Metadata } from "next";
import { verifySession } from "@/lib/auth/session";
import { listProductsForAdmin } from "@/lib/admin-products";
import { getOkMessage, getErrorMessage } from "./messages";
import { toggleProductActiveByIdAction, deleteProductByIdAction } from "./actions-bound";
import DeleteProductButton from "./delete-product-button";
import ToggleActiveButton from "./toggle-active-button";
import SyncHotmartButton from "./sync-hotmart-button";
import ProductBadges from "./product-badges";
import { syncHotmartAction } from "./sync-action";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Productos | Panel de administración",
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

function formatPrice(price: string, currency: string = "USD"): string {
  const num = Number(price);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; count?: string }>;
}) {
  await verifySession();

  const params = await searchParams;
  const okMessage = getOkMessage(params.ok ?? null);
  const errorMessage = getErrorMessage(params.error ?? null, params.count ?? null);

  const products = await listProductsForAdmin();

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
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="mt-1 text-sm text-gray-600">Gestiona los productos manuales.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 self-start">
          <SyncHotmartButton action={syncHotmartAction} />
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors self-start"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo producto
          </Link>
        </div>
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

      {products.length === 0 ? (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay productos</h3>
          <p className="mt-2 text-sm text-gray-600">Crea el primer producto para empezar.</p>
          <div className="mt-6">
            <Link
              href="/admin/productos/nuevo"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear producto
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
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clics
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {product.title}
                        </Link>
                        <ProductBadges isHotmart={product.isHotmart} needsReview={product.needsReview} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.platform.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ToggleActiveButton
                          action={toggleProductActiveByIdAction}
                          isActive={product.isActive}
                          productId={product.id}
                          needsReview={product.needsReview}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                        {formatNumber(product.clickCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DeleteProductButton
                          action={deleteProductByIdAction}
                          clickCount={product.clickCount}
                          productName={product.title}
                          productId={product.id}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="text-blue-600 hover:text-blue-900 font-medium text-lg flex-1 pr-4"
                  >
                    {product.title}
                    <ProductBadges isHotmart={product.isHotmart} needsReview={product.needsReview} />
                  </Link>
                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded shrink-0">
                    {product.slug}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {product.category.name} / {product.platform.name}
                  </span>
                  <span className="font-mono text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ToggleActiveButton
                      action={toggleProductActiveByIdAction}
                      isActive={product.isActive}
                      productId={product.id}
                      needsReview={product.needsReview}
                    />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-mono">
                      {formatNumber(product.clickCount)} {product.clickCount === 1 ? "clic" : "clics"}
                    </span>
                    <DeleteProductButton
                      action={deleteProductByIdAction}
                      clickCount={product.clickCount}
                      productName={product.title}
                      productId={product.id}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}