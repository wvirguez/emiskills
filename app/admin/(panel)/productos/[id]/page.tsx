import { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import { getProductForAdmin, listPlatforms } from "@/lib/admin-products";
import { getCategories } from "@/lib/products";
import ProductForm from "../product-form";
import { updateProductAction, deleteProductAction, toggleProductActiveAction } from "../actions";
import DeleteProductButton from "../delete-product-button";
import ToggleActiveButton from "../toggle-active-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editar producto | Panel de administración",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: PageProps) {
  await verifySession();

  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const product = await getProductForAdmin(id);

  if (!product) {
    notFound();
  }

  const [categories, platforms] = await Promise.all([getCategories(), listPlatforms()]);

  const boundUpdateAction = updateProductAction.bind(null, id);

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
          <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
          <p className="mt-1 text-sm text-gray-600">Modifica los datos del producto.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl">
        <ProductForm
          action={boundUpdateAction}
          initialData={{
            title: product.title,
            shortDescription: product.shortDescription,
            description: product.description ?? "",
            price: String(product.price),
            currency: product.currency,
            language: product.language,
            imageUrl: product.imageUrl ?? "",
            imageGradient: product.imageGradient ?? "",
            affiliateUrl: product.affiliateUrl,
            categoryId: String(product.categoryId),
            platformId: String(product.platformId),
            isActive: product.isActive,
          }}
          categories={categories}
          platforms={platforms}
          isCreating={false}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Acciones adicionales</h2>
        <div className="flex flex-wrap items-center gap-4">
          <ToggleActiveButton
            action={async (isActive: boolean, formData: FormData) => {
              "use server";
              await toggleProductActiveAction(id, undefined, formData);
            }}
            isActive={product.isActive}
            productId={id}
          />
          <DeleteProductButton
            action={async (formData: FormData) => {
              "use server";
              await deleteProductAction(id, undefined, formData);
            }}
            clickCount={product.clickCount}
            productName={product.title}
            productId={id}
          />
        </div>
        <p className="text-sm text-gray-500">
          El slug ({product.slug}) no se modifica al editar el producto.
        </p>
      </div>
    </div>
  );
}