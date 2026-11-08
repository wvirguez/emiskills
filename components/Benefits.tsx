import type { IconType } from "react-icons"
import { FiAward, FiZap, FiLock, FiHeadphones } from "react-icons/fi"

interface Benefit {
  title: string
  description: string
  Icon: IconType
}

const BENEFITS: Benefit[] = [
  { title: "Alta Calidad", description: "Productos Premium y útiles", Icon: FiAward },
  { title: "Acceso Instantáneo", description: "Descarga inmediata después de comprar", Icon: FiZap },
  { title: "Pago Seguro", description: "Pagos seguros y encriptados", Icon: FiLock },
  { title: "Gran Apoyo", description: "Estamos aquí para ayudarte en cualquier momento", Icon: FiHeadphones },
]

export default function Benefits() {
  return (
    <section aria-label="Beneficios" className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ title, description, Icon }) => (
            <li
              key={title}
              className="flex flex-col items-center rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center sm:p-6"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
