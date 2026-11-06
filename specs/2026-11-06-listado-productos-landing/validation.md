# Validación — Listado de productos en la landing (Fase 8)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan.
- `components/ProductCard.test.tsx` afirma que:
  - Muestra título, descripción corta, categoría, plataforma y precio con moneda (`29.00 USD`).
  - El enlace "Ver producto" tiene `href="/productos/<slug>"`.
  - Con `imageGradient: null` se aplica el degradado por defecto sin lanzar.
  - No se renderiza ningún `affiliateUrl`.
- `components/FeaturedProducts.test.tsx` afirma que:
  - Se llama a `getProducts` con `{ pageSize: 6 }`.
  - Se renderiza una tarjeta por producto devuelto.
  - `items: []` y un `getProducts` rechazado muestran el estado vacío sin lanzar.
  - No aparece el texto "ejemplo" en el DOM.
- `grep -r "sample-products" components app` no devuelve resultados (solo `prisma/seed.ts` lo usa).

## Manual
- Con MySQL local sembrado, `npm run dev`: la landing muestra 6 tarjetas con datos reales de la BD (título, categoría, plataforma, precio y moneda).
- Desactivar un producto en `npm run db:studio` y recargar: desaparece sin reconstruir; reactivarlo después.
- Vaciar o detener la BD: la landing carga y muestra el estado vacío, sin pantalla de error.
- `npm run build && npm start`: la lista refleja cambios en la BD tras el build (no queda estática).
- Móvil (~375 px): 1 columna, sin desbordes, descripción cortada a 2 líneas; en `sm` 2 columnas y en `lg` 3.
- "Ver producto" lleva a `/productos/[slug]` (404 hasta la Fase 9; esperado).

## Verificación del tono
- Título "Productos destacados" sin "(ejemplo)".
- Sin urgencia, escasez, ofertas ni reseñas inventadas.
- Precio con su moneda real, sin `$` fijo ni conversiones.
- Estado vacío neutro, en español.

## Definición de "terminado"
- `ProductCard` y `FeaturedProducts` implementados con datos reales, sin `any` ni dependencias nuevas.
- `FeaturedProducts` ya no importa datos de ejemplo.
- Todas las comprobaciones automatizadas y manuales pasan.
- Fase 8 marcada `[x]` en `specs/roadmap.md`.
