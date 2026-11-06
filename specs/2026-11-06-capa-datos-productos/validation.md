# Validación — Capa de datos de productos (Fase 7)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan.
- `lib/products.test.ts` afirma que:
  - `getProducts()` sin argumentos consulta `skip: 0`, `take: 12`, `where: { isActive: true }` y orden `createdAt desc, id desc`.
  - `getProducts({ page: 2, pageSize: 5 })` usa `skip: 5`, `take: 5`; `totalPages = ceil(total / pageSize)`.
  - Parámetros inválidos (`page: 0`, `pageSize: 999`, `NaN`) se normalizan sin lanzar.
  - Página fuera de rango devuelve `items: []` y `total` correcto.
  - `price` es `number` y los DTO no contienen `affiliateUrl`, `isActive`, `createdAt` ni `updatedAt`.
  - `getProductBySlug` devuelve `null` si no existe y filtra por `isActive: true`.
  - `getCategories` y `getPlatforms` ordenan por `name asc`.

## Manual
- Con MySQL local sembrado, ejecutar un script temporal (`npx tsx`) que llame a las cuatro funciones: 6 productos, 4 categorías, 2 plataformas; slug inexistente → `null`.
- Desactivar un producto en `db:studio` y confirmar que desaparece del listado y del detalle; reactivarlo después.
- Sin `DATABASE_URL`, el error viene de `lib/env.ts` y es claro.

## Verificación del tono
- No aplica: sin texto visible para el usuario.

## Definición de "terminado"
- `lib/products.ts` y `lib/products.test.ts` implementados, sin `any` ni dependencias nuevas.
- Todas las comprobaciones automatizadas pasan.
- Fase 7 marcada `[x]` en `specs/roadmap.md`.
