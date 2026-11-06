# Requisitos — Esquema inicial: Product, Category, Platform (Fase 6)

## Alcance

**Incluye**
- Modelos Prisma `Product`, `Category` y `Platform` en `prisma/schema.prisma` (provider `mysql`).
- Primera migración versionada (`prisma migrate dev`).
- Seed idempotente (`upsert`) con los 6 productos de `data/sample-products.ts`, las plataformas y las categorías.
- Script npm `db:seed` y configuración del seed en `prisma.config.ts`.
- Tests del esquema y del seed.

**No incluye**
- Tablas `Click`, usuarios o admin (fases 14-15).
- Campos de sincronización de Hotmart: `externalId`, última sincronización, datos crudos (fases 19-20).
- Consultas de listado/detalle (Fase 7) ni reemplazo de los datos de ejemplo en la UI (Fase 8).

### Modelos

**Platform** (origen de venta)

| Campo | Tipo | Notas |
|---|---|---|
| id | Int, PK autoincremental | |
| slug | String, único | `hotmart`, `manual` |
| name | String | Nombre visible |
| products | Product[] | Relación 1:N |

**Category** (tipo de producto)

| Campo | Tipo | Notas |
|---|---|---|
| id | Int, PK autoincremental | |
| slug | String, único | `curso`, `ebook`, `plantilla`, `membresia` |
| name | String | Nombre visible |
| products | Product[] | Relación 1:N |

**Product**

| Campo | Tipo | Notas |
|---|---|---|
| id | Int, PK autoincremental | |
| slug | String, único | Usado por `/go/[slug]` y el detalle |
| title | String | |
| shortDescription | String | Descripción objetiva, sin exageraciones |
| description | Text, opcional | Detalle largo (Fase 9) |
| price | Decimal(10,2) | En la moneda de origen |
| currency | String(3) | Código ISO 4217, p. ej. `USD` |
| language | String(2), por defecto `es` | Código ISO 639-1; base del filtro de la Fase 11 |
| imageUrl | String, opcional | |
| imageGradient | String, opcional | Clases Tailwind del placeholder actual; se retira cuando haya imágenes reales |
| affiliateUrl | String | URL destino del enlace de afiliado |
| isActive | Boolean, por defecto `true` | Los inactivos no se listan |
| categoryId | Int, FK → Category | |
| platformId | Int, FK → Platform | |
| createdAt / updatedAt | DateTime | |

Índices: `categoryId`, `platformId`, `isActive` (necesarios para los filtros de las fases 10-11).

## Decisiones

- **Núcleo del catálogo** (sin campos Hotmart): se añaden en la fase que los necesita, con su propia migración.
- **Precio `Decimal(10,2)` + moneda ISO:** evita errores de coma flotante y respeta la misión de mostrar la moneda de origen sin conversiones.
- **Categoría y plataforma 1:N:** un producto tiene una sola de cada una; simple y suficiente para los filtros de las fases 10-11.
- **Seed con los datos de ejemplo actuales:** conserva el contenido de la landing al pasar a datos reales. El campo `source` de los ejemplos se normaliza a dos plataformas: `Hotmart` y `Manual` ("Productor Independiente" y "Producto Manual" pasan a `manual`).
- **`affiliateUrl` en el seed:** los ejemplos no tienen enlace real; se usan URLs ficticias `https://example.com/...` y se documenta que no son afiliaciones reales.
- **`language` por defecto `es`:** todos los ejemplos están en español.
- **Seed idempotente:** `upsert` por `slug`; se puede ejecutar varias veces sin duplicar.

## Contexto

- Stack: Next.js 16 (App Router), Prisma 7 con `@prisma/adapter-mariadb`, MySQL local, TypeScript estricto sin `any`, Vitest. Cliente generado en `generated/prisma`; usar el singleton `lib/db.ts`.
- Antes de codificar, revisar la documentación actual de Prisma 7 (seed y `prisma.config.ts`) y `node_modules/next/dist/docs/`.
- No añadir dependencias nuevas sin aprobación. Si el seed requiere `tsx`, ya se usa en `db:check`.
- Secretos solo en variables de entorno; `.env*` fuera de git.
- Los textos del seed son demostrativos y deben mantener el tono honesto de la misión (sin falsas urgencias ni reseñas).
