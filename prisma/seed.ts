import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { getEnv } from "@/lib/env";

const adapter = new PrismaMariaDb(getEnv().DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Platforms
  const platformHotmart = await prisma.platform.upsert({
    where: { slug: "hotmart" },
    update: {},
    create: { slug: "hotmart", name: "Hotmart" },
  });

  const platformManual = await prisma.platform.upsert({
    where: { slug: "manual" },
    update: {},
    create: { slug: "manual", name: "Manual" },
  });

  console.log("Platforms:", { hotmart: platformHotmart.id, manual: platformManual.id });

  // Categories
  const categoryCurso = await prisma.category.upsert({
    where: { slug: "curso" },
    update: {},
    create: { slug: "curso", name: "Curso" },
  });

  const categoryEbook = await prisma.category.upsert({
    where: { slug: "ebook" },
    update: {},
    create: { slug: "ebook", name: "Ebook" },
  });

  const categoryPlantilla = await prisma.category.upsert({
    where: { slug: "plantilla" },
    update: {},
    create: { slug: "plantilla", name: "Plantilla" },
  });

  const categoryMembresia = await prisma.category.upsert({
    where: { slug: "membresia" },
    update: {},
    create: { slug: "membresia", name: "Membresía" },
  });

  console.log("Categories:", {
    curso: categoryCurso.id,
    ebook: categoryEbook.id,
    plantilla: categoryPlantilla.id,
    membresia: categoryMembresia.id,
  });

  // Products from data/sample-products.ts
  const products = [
    {
      slug: "desarrollo-java-fullstack",
      title: "Desarrollo Java Full Stack",
      shortDescription: "Domina el desarrollo de aplicaciones enterprise con Java y Spring Boot desde cero.",
      price: 45.99,
      currency: "USD",
      language: "es",
      imageGradient: "from-violet-500 to-purple-600",
      affiliateUrl: "https://example.com/desarrollo-java-fullstack",
      categoryId: categoryCurso.id,
      platformId: platformHotmart.id,
    },
    {
      slug: "ebook-marketing-digital",
      title: "Manual de Marketing Digital",
      shortDescription: "Guía completa estratégica para campañas efectivas en redes y buscadores.",
      price: 29.99,
      currency: "USD",
      language: "es",
      imageGradient: "from-fuchsia-500 to-pink-600",
      affiliateUrl: "https://example.com/ebook-marketing-digital",
      categoryId: categoryEbook.id,
      platformId: platformHotmart.id,
    },
    {
      slug: "plantilla-contrato",
      title: "Plantilla de Contrato",
      shortDescription: "Plantilla jurídica lista para usar para la redacción de contratos laborales.",
      price: 19.99,
      currency: "USD",
      language: "es",
      imageGradient: "from-indigo-500 to-violet-600",
      affiliateUrl: "https://example.com/plantilla-contrato",
      categoryId: categoryPlantilla.id,
      platformId: platformManual.id,
    },
    {
      slug: "membresia-diseno",
      title: "Membresía de Diseño",
      shortDescription: "Acceso mensual a recursos exclusivos de diseño gráfico y UI/UX.",
      price: 39.99,
      currency: "USD",
      language: "es",
      imageGradient: "from-teal-500 to-emerald-600",
      affiliateUrl: "https://example.com/membresia-diseno",
      categoryId: categoryMembresia.id,
      platformId: platformHotmart.id,
    },
    {
      slug: "curso-photoshop-basico",
      title: "Curso Básico de Photoshop",
      shortDescription: "Aprenda edición de imágenes y diseño gráfico desde nivel principiante hasta intermedio.",
      price: 59.99,
      currency: "USD",
      language: "es",
      imageGradient: "from-orange-500 to-amber-600",
      affiliateUrl: "https://example.com/curso-photoshop-basico",
      categoryId: categoryCurso.id,
      platformId: platformManual.id,
    },
    {
      slug: "plantilla-cv",
      title: "Plantilla CV Moderno",
      shortDescription: "Formato profesional para resúmenes ejecutivos y cartas de presentación.",
      price: 14.99,
      currency: "USD",
      language: "es",
      imageGradient: "from-rose-500 to-pink-600",
      affiliateUrl: "https://example.com/plantilla-cv",
      categoryId: categoryPlantilla.id,
      platformId: platformManual.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  const count = await prisma.product.count();
  console.log(`Seeded ${count} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });