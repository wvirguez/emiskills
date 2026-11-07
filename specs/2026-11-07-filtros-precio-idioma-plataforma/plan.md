# Plan — Filtros por precio, idioma y plataforma (Fase 11)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones.
1.2 Ampliar `GetProductsParams` en `lib/products.ts` con `minPrice?: number`, `maxPrice?: number`, `currency?: string`, `language?: string`, `platformSlug?: string`.
1.3 Extender el `where` de `getProducts`: `price: { gte, lte }` (solo las claves presentes), `currency`, `language`, `platform: { slug }`; combinado con `isActive`, categoría y `OR` de texto; el mismo `where` en `findMany` y `count`.
1.4 Añadir `getFilterOptions()`: `groupBy` de `currency` (orden por `_count` desc) y de `language` sobre productos activos → `{ currencies: string[]; languages: string[] }`.
1.5 Ampliar `lib/search-params.ts`: `SearchFilters` con `precioMin`, `precioMax`, `moneda`, `idioma`, `plataforma`; esquemas Zod tolerantes (`.catch(undefined)`); descartar `precioMax < precioMin`; extender `buildProductsHref` para conservar todos los filtros.

## 2. Componentes
2.1 Reutilizar `formatLanguage(code)` (ya existente).
2.2 Crear `components/ProductFilters.tsx` (Server Component): `<form method="get" action="/productos/">` con campos ocultos para `q` y `categoria`, inputs de precio, selects de moneda/idioma/plataforma, aviso de moneda, botón "Aplicar filtros" y enlace "Limpiar filtros" (conserva `q` y `categoria`).
2.3 Envolver el formulario en interruptor CSS: plegado en móvil (abierto si hay filtros activos), siempre visible desde `md`; sin JS de cliente.
2.4 Actualizar `CategoryChips`, `Pagination` y `SearchForm` para propagar los filtros nuevos (`precioMin`, `precioMax`, `moneda`, `idioma`, `plataforma`).

## 3. Página y ruta
3.1 `app/productos/page.tsx`: tras `parseSearchParams`, cargar `getCategories()`, `getPlatforms()` y `getFilterOptions()` en paralelo; validar categoría, plataforma, idioma y moneda contra esas listas; resolver la moneda por defecto cuando hay rango sin `moneda`.
3.2 Pasar los filtros a `getProducts` y a los componentes de la página.
3.3 Mostrar un resumen de filtros activos junto al contador (texto neutro, p. ej. "Mostrando 5 productos en USD, entre 10 y 50").
3.4 Mantener `error.tsx` y el estado vacío existente.

## 4. Navegación
4.1 Sin cambios en Navbar. Verificar que los enlaces desde la landing (`/productos?categoria=<slug>`) siguen funcionando.
4.2 "Limpiar filtros" lleva a `/productos` conservando solo `q` y `categoria`.

## 5. Pruebas
5.1 `lib/products.test.ts`: cada filtro nuevo genera su cláusula; `gte`/`lte` solo con los valores presentes; todos se combinan con `isActive`, categoría y `q`; `count` usa el mismo `where`; `getFilterOptions` devuelve monedas ordenadas por cantidad e idiomas.
5.2 `lib/search-params.test.ts`: precios inválidos/negativos/NaN → `undefined`; `precioMax < precioMin` → `precioMax` ignorado; `moneda`, `idioma`, `plataforma` con formato inválido → `undefined`; arrays → primer valor; `buildProductsHref` conserva todos los filtros y omite vacíos.
5.3 `lib/product-ui.test.ts`: `formatLanguage` ya está cubierto.
5.4 `components/ProductFilters.test.tsx`: form GET a `/productos/`, campos con etiqueta accesible, valores preseleccionados, ocultos para `q`/`categoria`, enlace "Limpiar filtros", interruptor marcado si hay filtros activos.
5.5 Actualizar `CategoryChips.test.tsx`, `Pagination.test.tsx` y `SearchForm`/`SearchCourses.test.tsx` para verificar que conservan los filtros nuevos.
5.6 `app/productos/page.test.tsx`: los filtros llegan a `getProducts`; valores desconocidos se ignoran; moneda por defecto cuando hay rango sin `moneda`.
5.7 Marcar Fase 11 como `[x]` en `specs/roadmap.md` tras validar.
