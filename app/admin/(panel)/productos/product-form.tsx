"use client";

import { useActionState } from "react";
import { slugify } from "@/lib/slug";
import { CURRENCIES, LANGUAGES, GRADIENT_PRESETS } from "@/lib/product-options";

export interface ProductFormState {
  error?: string;
  fieldErrors?: {
    title?: string[];
    shortDescription?: string[];
    description?: string[];
    price?: string[];
    currency?: string[];
    language?: string[];
    imageUrl?: string[];
    imageGradient?: string[];
    affiliateUrl?: string[];
    categoryId?: string[];
    platformId?: string[];
    isActive?: string[];
  };
  success?: boolean;
}

export interface ProductFormProps {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initialData?: Partial<ProductFormData>;
  categories: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  isCreating?: boolean;
}

export interface ProductFormData {
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  currency: string;
  language: string;
  imageUrl: string;
  imageGradient: string;
  affiliateUrl: string;
  categoryId: string;
  platformId: string;
  isActive: boolean;
}

const DEFAULT_DATA: ProductFormData = {
  title: "",
  shortDescription: "",
  description: "",
  price: "",
  currency: "USD",
  language: "es",
  imageUrl: "",
  imageGradient: "",
  affiliateUrl: "",
  categoryId: "",
  platformId: "",
  isActive: true,
};

export default function ProductForm({
  action,
  initialData = {},
  categories,
  platforms,
  isCreating = true,
}: ProductFormProps) {
  const mergedInitialData = { ...DEFAULT_DATA, ...initialData };

  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {
    error: undefined,
    fieldErrors: undefined,
    success: undefined,
  });

  const slugPreview = isCreating && mergedInitialData.title
    ? slugify(mergedInitialData.title)
    : null;

  return (
    <form action={formAction} className="space-y-6" noValidate data-testid="product-form">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          required
          disabled={pending}
          defaultValue={mergedInitialData.title}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
            state.fieldErrors?.title
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          aria-invalid={state.fieldErrors?.title ? "true" : "false"}
          aria-describedby={state.fieldErrors?.title ? "title-error" : undefined}
        />
        {state.fieldErrors?.title && (
          <p id="title-error" role="alert" className="mt-1 text-sm text-red-600">
            {state.fieldErrors.title[0]}
          </p>
        )}
      </div>

      {isCreating && slugPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Slug:</span> <code className="text-gray-900">{slugPreview}</code>
          </p>
          <p className="mt-1 text-xs text-gray-500">Se genera automáticamente al crear el producto.</p>
        </div>
      )}

      <div>
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción corta <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          rows={3}
          required
          disabled={pending}
          defaultValue={mergedInitialData.shortDescription}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
            state.fieldErrors?.shortDescription
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          aria-invalid={state.fieldErrors?.shortDescription ? "true" : "false"}
          aria-describedby={state.fieldErrors?.shortDescription ? "shortDescription-error" : undefined}
        />
        {state.fieldErrors?.shortDescription && (
          <p id="shortDescription-error" role="alert" className="mt-1 text-sm text-red-600">
            {state.fieldErrors.shortDescription[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción completa
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          disabled={pending}
          defaultValue={mergedInitialData.description}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
            state.fieldErrors?.description
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          aria-invalid={state.fieldErrors?.description ? "true" : "false"}
          aria-describedby={state.fieldErrors?.description ? "description-error" : undefined}
        />
        {state.fieldErrors?.description && (
          <p id="description-error" role="alert" className="mt-1 text-sm text-red-600">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Precio <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="text"
            autoComplete="off"
            required
            disabled={pending}
            defaultValue={mergedInitialData.price}
            placeholder="Ej: 29.99 o 29,99"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              state.fieldErrors?.price
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            aria-invalid={state.fieldErrors?.price ? "true" : "false"}
            aria-describedby={state.fieldErrors?.price ? "price-error" : undefined}
          />
          {state.fieldErrors?.price && (
            <p id="price-error" role="alert" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.price[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Moneda <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="currency"
            name="currency"
            required
            disabled={pending}
            defaultValue={mergedInitialData.currency}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              state.fieldErrors?.currency
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            aria-invalid={state.fieldErrors?.currency ? "true" : "false"}
            aria-describedby={state.fieldErrors?.currency ? "currency-error" : undefined}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          {state.fieldErrors?.currency && (
            <p id="currency-error" role="alert" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.currency[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Idioma <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="language"
            name="language"
            required
            disabled={pending}
            defaultValue={mergedInitialData.language}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              state.fieldErrors?.language
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            aria-invalid={state.fieldErrors?.language ? "true" : "false"}
            aria-describedby={state.fieldErrors?.language ? "language-error" : undefined}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.language && (
            <p id="language-error" role="alert" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.language[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            disabled={pending}
            defaultValue={mergedInitialData.categoryId}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              state.fieldErrors?.categoryId
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            aria-invalid={state.fieldErrors?.categoryId ? "true" : "false"}
            aria-describedby={state.fieldErrors?.categoryId ? "categoryId-error" : undefined}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.categoryId && (
            <p id="categoryId-error" role="alert" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.categoryId[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="platformId" className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="platformId"
            name="platformId"
            required
            disabled={pending}
            defaultValue={mergedInitialData.platformId}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              state.fieldErrors?.platformId
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            aria-invalid={state.fieldErrors?.platformId ? "true" : "false"}
            aria-describedby={state.fieldErrors?.platformId ? "platformId-error" : undefined}
          >
            <option value="">Seleccionar plataforma</option>
            {platforms.map((plat) => (
              <option key={plat.id} value={String(plat.id)}>
                {plat.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.platformId && (
            <p id="platformId-error" role="alert" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.platformId[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="imageGradient" className="block text-sm font-medium text-gray-700 mb-1">
            Degradado de imagen
          </label>
          <select
            id="imageGradient"
            name="imageGradient"
            disabled={pending}
            defaultValue={mergedInitialData.imageGradient}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
              state.fieldErrors?.imageGradient
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
            aria-invalid={state.fieldErrors?.imageGradient ? "true" : "false"}
            aria-describedby={state.fieldErrors?.imageGradient ? "imageGradient-error" : undefined}
          >
            <option value="">Sin degradado (usar imagen)</option>
            {GRADIENT_PRESETS.map((grad) => (
              <option key={grad.value} value={grad.value}>
                {grad.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.imageGradient && (
            <p id="imageGradient-error" role="alert" className="mt-1 text-sm text-red-600">
              {state.fieldErrors.imageGradient[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          URL de imagen
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          autoComplete="off"
          disabled={pending}
          defaultValue={mergedInitialData.imageUrl}
          placeholder="https://ejemplo.com/imagen.jpg"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
            state.fieldErrors?.imageUrl
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          aria-invalid={state.fieldErrors?.imageUrl ? "true" : "false"}
          aria-describedby={state.fieldErrors?.imageUrl ? "imageUrl-error" : undefined}
        />
        {state.fieldErrors?.imageUrl && (
          <p id="imageUrl-error" role="alert" className="mt-1 text-sm text-red-600">
            {state.fieldErrors.imageUrl[0]}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">Debe ser una URL https válida (máx. 500 caracteres). Opcional si hay degradado.</p>
      </div>

      <div>
        <label htmlFor="affiliateUrl" className="block text-sm font-medium text-gray-700 mb-1">
          URL de afiliado <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="affiliateUrl"
          name="affiliateUrl"
          type="url"
          autoComplete="off"
          required
          disabled={pending}
          defaultValue={mergedInitialData.affiliateUrl}
          placeholder="https://ejemplo.com/producto?ref=..."
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
            state.fieldErrors?.affiliateUrl
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          aria-invalid={state.fieldErrors?.affiliateUrl ? "true" : "false"}
          aria-describedby={state.fieldErrors?.affiliateUrl ? "affiliateUrl-error" : undefined}
        />
        {state.fieldErrors?.affiliateUrl && (
          <p id="affiliateUrl-error" role="alert" className="mt-1 text-sm text-red-600">
            {state.fieldErrors.affiliateUrl[0]}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">Debe ser una URL https válida (máx. 500 caracteres).</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={mergedInitialData.isActive}
          disabled={pending}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
          aria-invalid={state.fieldErrors?.isActive ? "true" : "false"}
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Producto activo
        </label>
        {state.fieldErrors?.isActive && (
          <p role="alert" className="ml-3 text-sm text-red-600">
            {state.fieldErrors.isActive[0]}
          </p>
        )}
      </div>

      {state.error && (
        <div role="alert" aria-live="polite" className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending
          ? isCreating
            ? "Creando..."
            : "Guardando..."
          : isCreating
          ? "Crear producto"
          : "Guardar cambios"}
      </button>
    </form>
  );
}