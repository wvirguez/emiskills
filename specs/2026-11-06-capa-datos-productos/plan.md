# Plan — Capa de datos de productos (Fase 7)

## 1. Base de datos
1.1 Confirmar que el esquema actual basta (sin migraciones nuevas).
1.2 Verificar el seed local: 6 productos, 4 categorías, 2 plataformas.

## 2. Módulo de datos (`lib/products.ts`)
2.1 Definir tipos `ProductDTO`, `ProductPage`, `CategoryDTO`, `PlatformDTO`.
2.2 Esquema Zod de paginación (`page` ≥ 1, `pageSize` 1–50, defaults 1 y 12).
2.3 Función interna `toProductDTO` (Decimal → number, omitir campos internos).
2.4 `getProducts`: `findMany` + `count` con `isActive: true`, `include` de category/platform, `orderBy [createdAt desc, id desc]`, `skip/take`.
2.5 `getProductBySlug`: `findFirst` con `slug` e `isActive: true`.
2.6 `getCategories` y `getPlatforms`: orden por `name asc`.

## 3. Componentes
Sin cambios (Fase 8 consumirá la capa).

## 4. Página y ruta
Sin cambios.

## 5. Navegación
Sin cambios.

## 6. Pruebas (`lib/products.test.ts`)
6.1 Mock de `@/lib/db`.
6.2 `getProducts`: paginación por defecto, `skip/take` correctos, `totalPages`, normalización de parámetros inválidos, página fuera de rango.
6.3 Mapeo DTO: `price` es `number`, no aparece `affiliateUrl`.
6.4 `getProductBySlug`: encontrado, inexistente → `null`, consulta incluye `isActive: true`.
6.5 `getCategories`/`getPlatforms`: orden y forma.
6.6 Marcar Fase 7 como `[x]` en `specs/roadmap.md` tras validar.
