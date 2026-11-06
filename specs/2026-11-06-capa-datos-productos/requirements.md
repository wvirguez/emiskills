# Requisitos — Capa de datos de productos (Fase 7)

## Alcance

### Incluye
- Módulo `lib/products.ts` (solo servidor) con consultas de lectura sobre el singleton `db` de `lib/db.ts`:
  - `getProducts({ page?, pageSize? })` → listado paginado de productos **activos**.
  - `getProductBySlug(slug)` → detalle de un producto activo, o `null` si no existe o está inactivo.
  - `getCategories()` y `getPlatforms()` → listas ordenadas por nombre, para filtros y navegación futuros.
- Tipos DTO planos y exportados; ningún consumidor depende de tipos de Prisma ni de `Decimal`.
- Pruebas unitarias con Prisma mockeado.

### No incluye
- Filtros de búsqueda, categoría, precio, idioma o plataforma (Fases 10–11).
- Cambios al esquema, migraciones o seed.
- Uso en la landing o en páginas (Fases 8–9).
- Caché (`use cache`/revalidación): se evalúa al integrar las consultas en páginas.

### Datos devueltos
| Tipo | Campos |
|---|---|
| `ProductDTO` | `id`, `slug`, `title`, `shortDescription`, `description` (`string \| null`), `price` (`number`), `currency`, `language`, `imageUrl`, `imageGradient`, `category` (`{ slug, name }`), `platform` (`{ slug, name }`) |
| `ProductPage` | `items: ProductDTO[]`, `total`, `page`, `pageSize`, `totalPages` |
| `CategoryDTO` / `PlatformDTO` | `id`, `slug`, `name` |

`affiliateUrl`, `isActive`, `createdAt` y `updatedAt` **no** se exponen: el enlace de afiliado solo se usará vía `/go/[slug]` (Fase 13).

## Decisiones
- **DTO plano en `lib/products.ts`** (elegido): desacopla la UI del ORM; `price` se convierte con `Number()` (precisión de 2 decimales suficiente para mostrar).
- **Orden:** `createdAt desc`, con `id desc` como desempate para paginación estable.
- **Tamaño de página:** 12 por defecto; máximo 50. `page` y `pageSize` inválidos (no enteros, < 1) se normalizan a los valores por defecto/mínimos, sin lanzar errores. Una página fuera de rango devuelve `items: []` con el `total` correcto.
- **Solo activos:** todas las consultas filtran `isActive: true`.
- **Pruebas con mocks** (elegido): `vi.mock("@/lib/db")`, sin MySQL real.
- **Validación:** Zod para normalizar los parámetros de paginación y el slug.

## Contexto
- Server Components por defecto; este módulo no usa `"use client"` y lleva `import "server-only"` solo si el paquete ya está disponible (no añadir dependencias).
- Seguir el patrón de `lib/db.ts`/`lib/env.ts`: TypeScript estricto, sin `any`, alias `@/`.
- Sin texto visible para el usuario en esta fase; los mensajes de error, si los hubiera, en español.
- Antes de escribir código, revisar `node_modules/next/dist/docs/` si se toca algo específico de Next.
