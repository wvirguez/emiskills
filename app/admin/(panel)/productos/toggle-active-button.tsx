"use client";

import { useActionState } from "react";

export interface ToggleActiveButtonProps {
  action: (isActive: boolean, formData: FormData) => Promise<void>;
  isActive: boolean;
  productId: number;
  /** Producto de Hotmart pendiente de poner el enlace de afiliado: no se puede activar. */
  needsReview?: boolean;
}

interface ToggleState {
  error?: string;
  pending?: boolean;
}

export default function ToggleActiveButton({ action, isActive, productId, needsReview = false }: ToggleActiveButtonProps) {
  const [state, formAction, pending] = useActionState<ToggleState, FormData>(
    async (_prevState, formData) => {
      const newIsActive = formData.get("isActive") === "true";
      try {
        await action(newIsActive, formData);
        return { error: undefined, pending: false };
      } catch (err) {
        return { error: err instanceof Error ? err.message : "Error desconocido", pending: false };
      }
    },
    { error: undefined, pending: false }
  );

  const blocked = needsReview && !isActive;

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="productId" value={String(productId)} />
      <input type="hidden" name="isActive" value={String(!isActive)} />
      <button
        type="submit"
        disabled={pending || blocked}
        aria-describedby={blocked ? `review-hint-${productId}` : undefined}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isActive
            ? "text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200 focus:ring-gray-500"
            : "text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 focus:ring-blue-500"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {pending
          ? isActive
            ? "Desactivando..."
            : "Activando..."
          : isActive
          ? "Desactivar"
          : "Activar"}
      </button>
      {blocked && (
        <p id={`review-hint-${productId}`} className="mt-1 text-xs text-amber-700">
          Guarda tu enlace de afiliado para poder activarlo.
        </p>
      )}
      {state.error && (
        <p role="alert" className="mt-1 text-sm text-red-600" aria-live="polite">
          {state.error}
        </p>
      )}
    </form>
  );
}