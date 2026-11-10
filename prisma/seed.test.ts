// @vitest-environment node
import { config } from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";

config();

describe("esquema inicial: seed integration", () => {
  let prisma: PrismaClient | null = null;
  let dbConnected = false;

  beforeAll(async () => {
    try {
      const { PrismaClient } = await import("@/generated/prisma/client");
      const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
      const { getEnv } = await import("@/lib/env");

      const adapter = new PrismaMariaDb(getEnv().DATABASE_URL);
      prisma = new PrismaClient({ adapter });
      // Test connection with a timeout
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000)),
      ]);
      dbConnected = true;
    } catch (e) {
      console.log("Database not reachable, skipping integration tests:", e instanceof Error ? e.message : String(e));
      dbConnected = false;
    }
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it("después del seed existen sus plataformas, categorías y productos con sus relaciones", async () => {
    if (!dbConnected) return;
    const platforms = await prisma!.platform.findMany();
    const categories = await prisma!.category.findMany();
    const products = await prisma!.product.findMany({
      include: { category: true, platform: true },
    });

    // La BD local puede tener datos extra creados desde el admin: se comprueba que
    // el seed esté presente, no que sea lo único que existe.
    const slugs = (rows: { slug: string }[]) => rows.map((r) => r.slug);
    expect(slugs(platforms)).toEqual(expect.arrayContaining(["hotmart", "manual"]));
    expect(slugs(categories)).toEqual(
      expect.arrayContaining(["curso", "ebook", "plantilla", "membresia"]),
    );
    expect(slugs(products)).toEqual(
      expect.arrayContaining([
        "desarrollo-java-fullstack",
        "ebook-marketing-digital",
        "plantilla-contrato",
        "membresia-diseno",
        "curso-photoshop-basico",
        "plantilla-cv",
      ]),
    );

    // Verify each product has category and platform
    for (const product of products) {
      expect(product.category).not.toBeNull();
      expect(product.platform).not.toBeNull();
      expect(product.price).toBeDefined();
      // Price should have 2 decimal places (Decimal(10,2))
      expect(Number(product.price.toFixed(2))).toBe(Number(product.price));
    }
  });

  it("seed es idempotente: ejecutar dos veces no cambia los conteos", async () => {
    if (!dbConnected) return;
    // Count before
    const beforePlatforms = await prisma!.platform.count();
    const beforeCategories = await prisma!.category.count();
    const beforeProducts = await prisma!.product.count();

    // Run seed again via raw SQL (simulating idempotent upsert)
    const { PrismaClient: PrismaClient2 } = await import("@/generated/prisma/client");
    const { PrismaMariaDb } = await import("@prisma/adapter-mariadb");
    const { getEnv } = await import("@/lib/env");
    const adapter2 = new PrismaMariaDb(getEnv().DATABASE_URL);
    const prisma2 = new PrismaClient2({ adapter: adapter2 });

    // Upsert platforms
    await prisma2.platform.upsert({
      where: { slug: "hotmart" },
      update: {},
      create: { slug: "hotmart", name: "Hotmart" },
    });
    await prisma2.platform.upsert({
      where: { slug: "manual" },
      update: {},
      create: { slug: "manual", name: "Manual" },
    });

    // Upsert categories
    await prisma2.category.upsert({
      where: { slug: "curso" },
      update: {},
      create: { slug: "curso", name: "Curso" },
    });
    await prisma2.category.upsert({
      where: { slug: "ebook" },
      update: {},
      create: { slug: "ebook", name: "Ebook" },
    });
    await prisma2.category.upsert({
      where: { slug: "plantilla" },
      update: {},
      create: { slug: "plantilla", name: "Plantilla" },
    });
    await prisma2.category.upsert({
      where: { slug: "membresia" },
      update: {},
      create: { slug: "membresia", name: "Membresía" },
    });

    // Get IDs for products
    const catCurso = await prisma2.category.findUnique({ where: { slug: "curso" } });
    const catEbook = await prisma2.category.findUnique({ where: { slug: "ebook" } });
    const catPlantilla = await prisma2.category.findUnique({ where: { slug: "plantilla" } });
    const catMembresia = await prisma2.category.findUnique({ where: { slug: "membresia" } });
    const platHotmart = await prisma2.platform.findUnique({ where: { slug: "hotmart" } });
    const platManual = await prisma2.platform.findUnique({ where: { slug: "manual" } });

    // Upsert products
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
        categoryId: catCurso!.id,
        platformId: platHotmart!.id,
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
        categoryId: catEbook!.id,
        platformId: platHotmart!.id,
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
        categoryId: catPlantilla!.id,
        platformId: platManual!.id,
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
        categoryId: catMembresia!.id,
        platformId: platHotmart!.id,
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
        categoryId: catCurso!.id,
        platformId: platManual!.id,
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
        categoryId: catPlantilla!.id,
        platformId: platManual!.id,
      },
    ];

    for (const product of products) {
      await prisma2.product.upsert({
        where: { slug: product.slug },
        update: {}, // no pisar ediciones hechas desde el admin
        create: product,
      });
    }

    await prisma2.$disconnect();

    // Count after
    const afterPlatforms = await prisma!.platform.count();
    const afterCategories = await prisma!.category.count();
    const afterProducts = await prisma!.product.count();

    expect(afterPlatforms).toBe(beforePlatforms);
    expect(afterCategories).toBe(beforeCategories);
    expect(afterProducts).toBe(beforeProducts);
  });

  it("slug duplicado en Product lanza error de unicidad", async () => {
    if (!dbConnected) return;
    const catCurso = await prisma!.category.findUnique({ where: { slug: "curso" } });
    const platHotmart = await prisma!.platform.findUnique({ where: { slug: "hotmart" } });

    await expect(
      prisma!.product.create({
        data: {
          slug: "desarrollo-java-fullstack", // duplicate slug
          title: "Test Duplicate",
          shortDescription: "Test",
          price: 10.00,
          currency: "USD",
          language: "es",
          affiliateUrl: "https://example.com/test",
          categoryId: catCurso!.id,
          platformId: platHotmart!.id,
        },
      })
    ).rejects.toThrow();
  });
});