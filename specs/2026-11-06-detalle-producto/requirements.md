# Requisitos — Página de detalle de producto (Fase 9)

## Alcance

### Incluye
- Ruta `app/productos/[slug]/page.tsx` (Server Component) que usa `getProductBySlug` (`lib/products.ts`, Fase 7).
- Ficha del producto con los datos de la tabla.
- Botón **"Ir a la oferta"** que apunta a `/go/[slug]` (la ruta se implementa en la Fase 13; hasta entonces da 404, aceptado de forma temporal).
- Aviso de divulgación de afiliados visible junto al precio/botón (texto breve; el aviso completo ya existe en `AffiliateDisclosure`).
- Enlace "← Volver al catálogo" a la landing (`/#productos`, o `/` si no existe el ancla).
- `generateMetadata` dinámica (título y descripción desde el producto).
- `app/productos/[slug]/not-found.tsx` en español para slug inexistente o producto inactivo.
- Tests de página/componentes.

### No incluye
- La ruta `/go/[slug]` ni el registro de clics (Fases 13–14).
- Productos relacionados, reseñas, valoraciones o contenido genérico inventado ("qué incluye", "para quién").
- Imágenes reales con `next/image` (se mantiene el degradado, igual que `ProductCard`).
- SEO avanzado: sitemap, Open Graph, JSON-LD (Fase 23).
- Cambios de esquema o migraciones.

### Datos de la ficha
| Dato | Origen (`ProductDTO`) | Notas |
|---|---|---|
| Título | `title` | `h1` |
| Categoría | `category.name` | Badge |
| Plataforma | `platform.name` | "Plataforma: Hotmart" |
| Idioma | `language` | Mostrar nombre legible (`es` → Español, `en` → Inglés, `pt` → Portugués; otro → código en mayúsculas) |
| Precio | `price` + `currency` | `29.00 USD`, moneda de origen, sin conversión |
| Descripción | `description` ?? `shortDescription` | Texto plano, respetando saltos de párrafo; sin HTML |
| Fondo | `imageGradient` | Si es `null`, degradado por defecto (reutilizar el de `ProductCard`) |
| Oferta | `slug` | `href="/go/<slug>"` |

## Decisiones
- **Botón a `/go/[slug]` desde ya:** fija el contrato del enlace saliente; la Fase 13 solo añade la ruta. Nunca se expone `affiliateUrl` en la página.
- **`notFound()` para slug inexistente o inactivo:** `getProductBySlug` ya filtra `isActive: true`; responde 404 real en lugar de redirigir.
- **`generateMetadata` propia:** título `"<título> | EmiSkills"` y descripción = `shortDescription` recortada a ~160 caracteres; si no existe el producto, metadatos del 404.
- **Renderizado por petición:** los datos viven en BD y la landing ya es dinámica (se quitó `output: 'export'`). No usar `generateStaticParams`. Antes de codificar, leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` (en esta versión `params` es una `Promise`) y `not-found.md`.
- **Texto plano:** `description` se renderiza como texto (React escapa); no se admite HTML/Markdown en esta fase.
- **Reutilización:** extraer a un módulo compartido el degradado por defecto (hoy constante dentro de `ProductCard`) si se necesita en ambos componentes; sin duplicar.
- **Slug en URL:** `trailingSlash: true` está activo en `next.config.ts`; los enlaces de `ProductCard` (`/productos/<slug>`) se redirigen a la versión con barra final. Verificar que funciona y que el botón `/go/<slug>` se comporta igual.

## Contexto
- **Tono:** honesto y objetivo. Sin urgencia, escasez, descuentos, "más vendido" ni reseñas. Aviso sugerido junto al botón: "Al comprar en la plataforma del productor podemos recibir una comisión, sin costo extra para ti." (sin afirmar nada que no sea cierto del acuerdo concreto).
- **Estilo:** mismo lenguaje visual que la landing (acento violeta/fucsia, tarjetas redondeadas, `max-w-7xl`). Móvil primero: una columna en móvil; en `lg` dos columnas (visual/degradado + contenido) o ficha centrada.
- **Stack:** Server Components, sin `"use client"`, sin dependencias nuevas, TypeScript estricto sin `any`, interfaz solo en español.
- **Patrones existentes:** `components/ProductCard.tsx` para estilos del badge, precio y botón; tests con Vitest + Testing Library y mock de `@/lib/products` (ver `components/FeaturedProducts.test.tsx`). Cuidado: no devolver el mock desde `beforeEach(() => mock.reset())` (Vitest lo ejecuta como limpieza).
