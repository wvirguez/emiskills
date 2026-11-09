"use client";

import { useState, useRef, FormEvent } from "react";

export interface DeleteProductButtonProps {
  action: (formData: FormData) => Promise<void>;
  clickCount: number;
  productName: string;
  productId: number;
}

export default function DeleteProductButton({ action, clickCount, productName, productId }: DeleteProductButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const hasClicks = clickCount > 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await action(formData);
  };

  const handleConfirmClick = () => {
    setShowConfirm(true);
    if (detailsRef.current) {
      detailsRef.current.open = true;
    }
  };

  const handleCancelClick = () => {
    setShowConfirm(false);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  if (hasClicks) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled
          className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed"
          title="No se puede eliminar: el producto tiene clics registrados"
        >
          Eliminar
        </button>
        <span className="text-sm text-gray-500">
          Tiene {clickCount} {clickCount === 1 ? "clic" : "clics"} registrad{clickCount === 1 ? "o" : "os"}; desactívalo en su lugar.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="inline">
      <input type="hidden" name="productId" value={String(productId)} />
      <details ref={detailsRef} className="relative" open={showConfirm} data-testid="delete-confirmation">
        <summary className="list-none">
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            aria-expanded={showConfirm}
            onClick={handleConfirmClick}
          >
            Eliminar
          </button>
        </summary>

        <div className="absolute right-0 z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            <p className="px-3 py-2 text-sm text-gray-700">
              {`¿Eliminar "${productName}"?`}
            </p>
            <div className="border-t border-gray-100 flex gap-2 p-2">
              <button
                type="submit"
                className="flex-1 px-2 py-1.5 text-sm font-medium text-white bg-red-600 border border-red-700 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Confirmar eliminación
              </button>
              <button
                type="button"
                className="flex-1 px-2 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={handleCancelClick}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </details>
    </form>
  );
}