/* Productos de ejemplo para la landing page de FrontPage como hub de productos digitales.
   Estos son productos ficticios con fines de demostración visual.
   No representan productos reales ni afiliaciones reales.
*/

export type Product = {
  id: string
  slug: string
  title: string
  category: string
  source: string
  price: number
  currency: string
  shortDescription: string
  imageGradient: string
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    slug: "desarrollo-java-fullstack",
    title: "Desarrollo Java Full Stack",
    category: "Curso",
    source: "Hotmart",
    price: 45.99,
    currency: "USD",
    shortDescription: "Domina el desarrollo de aplicaciones enterprise con Java y Spring Boot desde cero.",
    imageGradient: "from-violet-500 to-purple-600",
  },
  {
    id: "2",
    slug: "ebook-marketing-digital",
    title: "Manual de Marketing Digital",
    category: "Ebook",
    source: "Hotmart",
    price: 29.99,
    currency: "USD",
    shortDescription: "Guía completa estratégica para campañas efectivas en redes y buscadores.",
    imageGradient: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "3",
    slug: "plantilla-contrato",
    title: "Plantilla de Contrato",
    category: "Plantilla",
    source: "Productor Independiente",
    price: 19.99,
    currency: "USD",
    shortDescription: "Plantilla jurídica lista para usar para la redacción de contratos laborales.",
    imageGradient: "from-indigo-500 to-violet-600",
  },
  {
    id: "4",
    slug: "membresia-diseño",
    title: "Membresía de Diseño",
    category: "Membresía",
    source: "Hotmart",
    price: 39.99,
    currency: "USD",
    shortDescription: "Acceso mensual a recursos exclusivos de diseño gráfico y UI/UX.",
    imageGradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "5",
    slug: "curso-photoshop-basico",
    title: "Curso Básico de Photoshop",
    category: "Curso",
    source: "Producto Manual",
    price: 59.99,
    currency: "USD",
    shortDescription: "Aprenda edición de imágenes y diseño gráfico desde nivel principiante hasta intermedio.",
    imageGradient: "from-orange-500 to-amber-600",
  },
  {
    id: "6",
    slug: "plantilla-cv",
    title: "Plantilla CV Moderno",
    category: "Plantilla",
    source: "Producto Manual",
    price: 14.99,
    currency: "USD",
    shortDescription: "Formato profesional para resúmenes ejecutivos y cartas de presentación.",
    imageGradient: "from-rose-500 to-pink-600",
  },
]