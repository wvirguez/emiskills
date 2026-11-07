import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-gray-900">No encontramos este producto</h1>
      <p className="mt-4 text-gray-600">
        Puede que el enlace sea incorrecto o que el producto ya no esté disponible.
      </p>
      <Link
        href="/#productos"
        className="mt-8 inline-flex rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
      >
        Volver al catálogo
      </Link>
    </section>
  );
}
