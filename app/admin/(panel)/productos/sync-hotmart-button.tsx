"use client";

import { useActionState } from "react";
import type { SyncActionState } from "./sync-action";

export interface SyncHotmartButtonProps {
  action: (prevState: SyncActionState) => Promise<SyncActionState>;
}

export default function SyncHotmartButton({ action }: SyncHotmartButtonProps) {
  const [state, formAction, pending] = useActionState<SyncActionState, FormData>(
    (prev) => action(prev),
    undefined,
  );
  const result = state?.result;

  return (
    <div className="space-y-3">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Sincronizando..." : "Sincronizar con Hotmart"}
        </button>
      </form>

      {state?.error && (
        <p role="alert" className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </p>
      )}

      {result && (
        <div role="status" className="p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md space-y-2">
          <p>
            Creados: {result.created} · Actualizados: {result.updated} · Desactivados: {result.deactivated} · Sin
            cambios: {result.unchanged}
          </p>
          {result.created > 0 && (
            <p>
              Los productos nuevos quedan inactivos. El enlace sincronizado es el del productor, no de afiliado: añade
              tu enlace de afiliado antes de activarlos.
            </p>
          )}
          {result.skipped.length > 0 && (
            <div>
              <p className="font-medium">Omitidos ({result.skipped.length}):</p>
              <ul className="list-disc pl-5">
                {result.skipped.map((s) => (
                  <li key={s.id}>
                    {s.name}: {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.errors.length > 0 && (
            <div role="alert" className="text-red-700">
              <p className="font-medium">Errores ({result.errors.length}):</p>
              <ul className="list-disc pl-5">
                {result.errors.map((e) => (
                  <li key={e.id}>
                    #{e.id}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
