"use client";

export default function ProductError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-gray-900">No pudimos cargar el producto</h1>
      <p className="mt-4 text-gray-600">Ocurrió un problema temporal. Inténtalo de nuevo.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
      >
        Reintentar
      </button>
    </section>
  );
}
