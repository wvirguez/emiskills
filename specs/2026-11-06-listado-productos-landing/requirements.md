# Requisitos — Listado de productos en la landing (Fase 8)

## Alcance

### Incluye
- `FeaturedProducts` deja de usar `data/sample-products.ts` y lee de la BD con `getProducts({ pageSize: 6 })` (`lib/products.ts`, Fase 7): los 6 productos activos más recientes.
- Tarjeta de producto (extraída a un componente propio) con los campos de la tabla.
- Estado vacío honesto cuando no hay productos o la consulta falla.
- Se eliminan los textos "(productos de ejemplo)" y la aclaración de que son de ejemplo.
- Tests de componente (Testing Library) para listado y estado vacío.

### No incluye
- Paginación, "Ver todos", buscador ni filtros (Fases 10–11).
- Página de detalle `/productos/[slug]` (Fase 9): el enlace se deja apuntando a esa ruta futura.
- Ruta `/go/[slug]` y enlaces de afiliado (Fase 13). La tarjeta nunca expone `affiliateUrl`.
- Imágenes reales con `next/image`: se mantiene el degradado (`imageGradient`) como fondo.
- Cambios de esquema o migraciones.

### Datos de la tarjeta
| Dato | Origen (`ProductDTO`) | Notas |
|---|---|---|
| Título | `title` | `h3` |
| Descripción corta | `shortDescription` | Máx. 2 líneas (`line-clamp-2`) |
| Categoría | `category.name` | Badge sobre el degradado |
| Plataforma | `platform.name` | Origen del producto |
| Precio | `price` + `currency` | Moneda real del producto, sin conversión (ej. `29.00 USD`) |
| Fondo | `imageGradient` | Si es `null`, degradado por defecto violeta/fucsia |
| Enlace | `slug` | `Ver producto` → `/productos/[slug]` |

## Decisiones
- **6 más recientes, sin paginación:** es una vitrina de landing; el catálogo completo llega con buscador y filtros.
- **Se elimina el uso de datos de ejemplo en el componente:** `data/sample-products.ts` **se conserva** porque `prisma/seed.ts` lo usa para sembrar la BD; ya no se importa desde la UI.
- **Estado vacío en lugar de respaldo falso:** si no hay productos o falla la BD, se muestra un mensaje neutro y la página sigue cargando. Mostrar productos inventados contradice la misión.
- **Enlace a `/productos/[slug]`:** hasta la Fase 9 dará 404; es aceptado de forma temporal y se anota en validación.
- **Datos en tiempo de petición:** `next.config` no usa `cacheComponents`, así que la landing se prerenderizaría en build con la BD de ese momento. `FeaturedProducts` debe leer datos por petición (p. ej. `await connection()` de `next/server` dentro de `<Suspense>`, o `dynamic = "force-dynamic"`); confirmar la opción en `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` y `06-fetching-data.md`.
- **Errores:** `try/catch` alrededor de `getProducts`; ante error se registra con `console.error` y se renderiza el estado vacío.

## Contexto
- **Tono:** honesto y objetivo. Título "Productos destacados", subtítulo neutro (p. ej. "Los productos más recientes de nuestro catálogo."). Sin badges de oferta, escasez, "mejor valorado" ni reseñas.
- **Estilo:** conservar clases Tailwind y diseño actual de `FeaturedProducts` (grid `sm:grid-cols-2 lg:grid-cols-3`, tarjetas redondeadas, acento violeta). Móvil primero, página ligera.
- **Stack:** Server Component por defecto, sin `"use client"`; sin dependencias nuevas; TypeScript estricto sin `any`; interfaz solo en español.
- **Patrones existentes:** capa de datos en `lib/products.ts`; tests con Vitest + Testing Library (ver `components/Hero.test.tsx`); mock de `@/lib/products` en los tests del componente.
- **Precio:** formatear sin símbolo `$` fijo, para no confundir monedas distintas (usar `price.toFixed(2)` + `currency`).
