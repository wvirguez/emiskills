"use client";

import { useActionState } from "react";
import { slugify } from "@/lib/slug";

export interface CategoryFormState {
  error?: string;
  fieldErrors?: {
    name?: string[];
  };
  success?: boolean;
}

export interface CategoryFormProps {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  initialName?: string;
  isCreating?: boolean;
}

export default function CategoryForm({ action, initialName = "", isCreating = true }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(action, {
    error: undefined,
    fieldErrors: undefined,
    success: undefined,
  });

  const slugPreview = isCreating ? slugify(initialName) : null;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          required
          disabled={pending}
          defaultValue={initialName}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
            state.fieldErrors?.name
              ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          aria-invalid={state.fieldErrors?.name ? "true" : "false"}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
        />
        {state.fieldErrors?.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      {isCreating && slugPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Slug:</span> <code className="text-gray-900">{slugPreview}</code>
          </p>
          <p className="mt-1 text-xs text-gray-500">Se genera automáticamente al crear la categoría.</p>
        </div>
      )}

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
          ? "Crear categoría"
          : "Guardar cambios"}
      </button>
    </form>
  );
}