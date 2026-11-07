# Validación — Filtros por precio, idioma y plataforma (Fase 11)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores y `/productos` sigue dinámica (`ƒ`).
- `lib/products.test.ts` afirma que:
  - `minPrice`/`maxPrice` generan `price: { gte }`, `{ lte }` o ambos, según los valores presentes.
  - `currency`, `language` y `platformSlug` generan `currency`, `language` y `platform: { slug }` en el `where`.
  - Todos los filtros se combinan con `isActive: true`, `category` y el `OR` de `q`; `findMany` y `count` reciben el mismo `where`.
  - Sin filtros el `where` sigue siendo `{ isActive: true }`.
  - `getFilterOptions` devuelve monedas por cantidad descendente e idiomas distintos de productos activos.
- `lib/search-params.test.ts` afirma: precios negativos, no numéricos o con más de 2 decimales → ignorados; `precioMax < precioMin` → `precioMax` ignorado; `moneda`/`idioma`/`plataforma` con formato inválido → ignorados; arrays → primer valor; `buildProductsHref` conserva todos los filtros.
- `components/ProductFilters.test.tsx` afirma: `form` con `method="get"` y `action="/productos/"`; inputs y selects con etiqueta accesible y valores preseleccionados; campos ocultos `q`/`categoria`; enlace "Limpiar filtros"; interruptor "Mostrar filtros" marcado cuando hay filtros activos.
- `Pagination`, `CategoryChips` y `SearchForm` conservan los filtros nuevos en sus enlaces/campos.
- `app/productos/page.test.tsx` afirma: filtros pasados a `getProducts`; idioma/moneda/plataforma desconocidos ignorados; moneda por defecto aplicada cuando hay rango sin `moneda`.

## Manual
Con MySQL local sembrado, `npm run build && npm start`:
- `/productos`: aparecen precio mínimo/máximo, moneda, idioma y plataforma con las opciones reales de la BD.
- Rango de precio sin elegir moneda → el selector muestra la moneda por defecto y los resultados corresponden solo a esa moneda.
- Cada filtro por separado y combinados (texto + categoría + precio + idioma + plataforma) devuelven los productos esperados.
- `precioMin=50&precioMax=10` → se ignora el máximo sin error; `precioMin=abc` → ignorado.
- `?idioma=zz`, `?plataforma=inexistente`, `?moneda=XXX` → catálogo sin ese filtro, sin error.
- Paginar, cambiar de categoría o buscar texto conserva los filtros; "Limpiar filtros" los quita y conserva `q` y categoría.
- Sin coincidencias → mensaje neutro y enlace "Ver todos los productos".
- Producto desactivado en Studio → no aparece, y su moneda/idioma exclusivos desaparecen de las opciones.
- Móvil (~375 px): panel plegado por defecto (abierto si hay filtros activos), sin desbordes, controles usables con el pulgar; en escritorio visible sin plegar.
- Teclado: Enter envía el formulario; foco visible; etiquetas legibles por lector de pantalla.
- BD detenida: error en español, no "sin resultados".

## Verificación del tono
- Textos en español, neutros; sin urgencia, "ofertas", "más vendidos" ni recomendaciones inventadas.
- El aviso "no convertimos monedas" es visible junto al filtro de precio.

## Definición de "terminado"
- Filtros de precio (con moneda), idioma y plataforma funcionando en `/productos`, combinables con texto y categoría, y conservados en paginación y enlaces.
- Sin `any`, sin dependencias nuevas y sin `"use client"` en los filtros.
- Todas las comprobaciones automatizadas y manuales pasan.
- Fase 11 marcada `[x]` en `specs/roadmap.md`.
