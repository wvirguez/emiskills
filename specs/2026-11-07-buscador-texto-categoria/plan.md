# Plan — Buscador: texto + filtro por categoría (Fase 10)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones.
1.2 Ampliar `GetProductsParams` con `q?: string` y `categorySlug?: string`.
1.3 En `getProducts`, construir `where` = `{ isActive: true }` + `category: { slug }` si hay categoría + `OR: [{ title: { contains: q } }, { shortDescription: { contains: q } }]` si hay texto; usar el mismo `where` en `findMany` y `count`.
1.4 Crear `lib/search-params.ts` con `parseSearchParams(raw)` (Zod): normaliza `q`, `categoria` y `page`; tolera arrays (`?q=a&q=b` → primer valor) y valores inválidos.

## 2. Componentes
2.1 Reescribir `components/SearchCourses.tsx` como Server Component asíncrono: `<form role="search" method="get" action="/productos">`, `label` oculto, input `name="q"` y botón `type="submit"`; chips desde `getCategories()` (con `try/catch` → solo "Todos" si falla).
2.2 Extraer `components/CategoryChips.tsx` (props: categorías, slug activo, `q` opcional para conservar el texto) reutilizado por la landing y `/productos`.
2.3 Actualizar `components/Categories.tsx` para leer `getCategories()` y enlazar a `/productos?categoria=<slug>` (mantener iconos/estilo actual; si hay iconos por slug, mapear con los slugs reales de la BD).
2.4 Crear `components/Pagination.tsx` (anterior/siguiente conservando `q` y `categoria`; oculto si `totalPages <= 1`).
2.5 Crear `components/SearchResults.tsx`: contador ("N productos"), grid de `ProductCard` o estado sin resultados con enlace "Ver todos los productos".

## 3. Página y ruta
3.1 `app/productos/page.tsx`: `searchParams` como `Promise`; `await connection()`; `parseSearchParams`; validar la categoría contra `getCategories()`; `getProducts({ q, categorySlug, page })`; renderizar formulario, chips, resultados y paginación.
3.2 Metadatos estáticos: título "Catálogo de productos | EmiSkills" (con `q` en el título es opcional y no se incluye en esta fase).
3.3 `app/productos/error.tsx` en español con botón "Reintentar" (reutilizar el patrón de `app/productos/[slug]/error.tsx`).
3.4 Confirmar que `/productos` no choca con `/productos/[slug]`.

## 4. Navegación
4.1 `Navbar`: cambiar anclas a `/#productos`, `/#categorias`, `/#buscar`, `/#como-funciona` (y los enlaces del menú móvil).
4.2 Añadir `id="categorias"` y `id="buscar"` en las secciones si faltan, sin cambiar estilos.
4.3 En la ficha de producto, "Volver al catálogo" puede apuntar a `/productos`; decidir al implementar y mantener coherencia con los tests de `ProductDetail`.

## 5. Pruebas
5.1 `lib/products.test.ts`: `q` genera `OR` sobre título y descripción corta; `categorySlug` filtra por `category.slug`; ambos se combinan con `isActive: true`; `count` usa el mismo `where`; sin filtros el `where` no cambia.
5.2 `lib/search-params.test.ts`: recorte y límite de 100 caracteres de `q`; `q` vacío/espacios → sin filtro; array → primer valor; `page` inválido → 1; `categoria` con formato inválido → `undefined`.
5.3 `components/SearchCourses.test.tsx`: formulario GET a `/productos` con input `q`; chips desde categorías mockeadas con `href="/productos?categoria=<slug>"`; si `getCategories` falla, se renderiza solo "Todos".
5.4 `components/CategoryChips.test.tsx`, `components/Pagination.test.tsx` (enlaces conservan filtros; ocultos con 1 página) y `components/SearchResults.test.tsx` (grid y estado sin resultados).
5.5 `app/productos/page.test.tsx`: pasa `q`, `categorySlug` y `page` a `getProducts`; categoría desconocida se ignora; sin resultados muestra el mensaje.
5.6 Marcar Fase 10 como `[x]` en `specs/roadmap.md` tras validar.
