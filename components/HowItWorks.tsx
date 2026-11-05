// src/components/HowItWorks.tsx
export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Cómo funciona
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Paso 1 */}
            <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
              <div className="h-12 w-12 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Explora el catálogo
              </h3>
              <p className="text-sm text-gray-600">
                Navega por categorías y productos de forma honesta y transparente.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
              <div className="h-12 w-12 rounded-full bg-fuchsia-600 flex items-center justify-center text-white text-sm font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Elige tu producto
              </h3>
              <p className="text-sm text-gray-600">
                Revisa descripciones, precios y plataformas de origen sin presiones.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
              <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Accede a la plataforma
              </h3>
              <p className="text-sm text-gray-600">
                Es redirigido al sitio del productor con tu enlace de afiliado transparente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}