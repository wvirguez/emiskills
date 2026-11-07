# Requisitos — Filtros por precio, idioma y plataforma (Fase 11)

## Alcance

### Incluye
- Nuevos filtros en `/productos`, combinables con el texto (`q`) y la categoría ya existentes:

| Filtro | Param. URL | Control | Validación (Zod) |
|---|---|---|---|
| Precio mínimo | `precioMin` | `input type="number"` | número ≥ 0, máx. 2 decimales; inválido → ignorado |
| Precio máximo | `precioMax` | `input type="number"` | número ≥ 0; inválido → ignorado; si `max < min` se ignora `max` |
| Moneda | `moneda` | `select` | código `^[A-Z]{3}$`; debe existir entre los productos activos |
| Idioma | `idioma` | `select` | código `^[a-z]{2}$`; debe existir entre los productos activos |
| Plataforma | `plataforma` | `select` | slug `^[a-z0-9-]{1,50}$`; debe existir en `getPlatforms()` |

- Capa de datos: ampliar `GetProductsParams` con `minPrice`, `maxPrice`, `currency`, `language`, `platformSlug`; mismo `where` en `findMany` y `count`.
- Nueva consulta `getFilterOptions()` con monedas e idiomas presentes en productos activos (monedas ordenadas por cantidad de productos, descendente).
- Formulario GET de filtros (Server Component) con botón "Aplicar filtros" y enlace "Limpiar filtros".
- Los filtros se conservan al cambiar de página, de categoría y al buscar texto (`buildProductsHref`, `CategoryChips`, `Pagination`, `SearchForm`).
- Contador de resultados y estado sin resultados ya existentes (`SearchResults`).

### No incluye
- Conversión entre monedas.
- Ordenamiento (por precio, fecha, etc.).
- Filtros aplicados automáticamente al cambiar un control (requeriría componente cliente).
- Filtros en la landing (solo en `/productos`; el buscador de la landing sigue enviando `q`).
- Cambios de esquema o migraciones.

## Decisiones
- **Rango de precio + selector de moneda, sin conversión.** Cada producto tiene su moneda de origen y la misión prohíbe conversiones engañosas. El rango se aplica solo sobre productos de la moneda elegida.
- **Moneda por defecto:** si hay `precioMin`/`precioMax` pero no `moneda`, se usa la moneda con más productos activos (primera de `getFilterOptions().currencies`) y el selector la muestra seleccionada, de modo que el usuario siempre ve a qué moneda se aplica el rango. Si solo hay `moneda` sin precios, filtra por moneda.
- **Estado en la URL** (`searchParams`) con formulario `method="get"`: enlaces compartibles, sin JS de cliente.
- **Valores desconocidos se descartan** (idioma, moneda o plataforma inexistentes) y se muestra el catálogo sin ese filtro, igual que con categorías desconocidas en la Fase 10.
- **Idiomas:** se muestran con nombre en español ("Español", "Inglés", "Portugués"…) mediante `formatLanguage` de `lib/product-ui.ts`; códigos sin nombre conocido se muestran en mayúsculas.
- **Panel plegable en móvil:** interruptor CSS (checkbox `peer` + etiqueta "Filtros", visible solo en móvil) en lugar de interruptor CSS, porque interruptor CSS no puede forzarse abierto en escritorio de forma fiable; sin JS adicional. Se abre por defecto en móvil si hay algún filtro activo.

## Contexto
- **Tono:** textos en español, neutros y objetivos. Etiquetas: "Precio mínimo", "Precio máximo", "Moneda", "Idioma", "Plataforma", "Aplicar filtros", "Limpiar filtros". Nada de "ofertas", "más vendidos" ni urgencia. Aviso breve junto al precio: "El rango se aplica en la moneda seleccionada; no convertimos monedas."
- **Stack:** Next.js 16 App Router (leer `node_modules/next/dist/docs/` antes de tocar `searchParams`/`connection`), Server Components por defecto, Zod en `lib/search-params.ts`, Prisma vía `lib/db.ts`, Vitest + Testing Library. Sin dependencias nuevas.
- **Patrones existentes:** `parseSearchParams`/`buildProductsHref` (`lib/search-params.ts`), `getProducts`/`escapeLike` (`lib/products.ts`), `SearchForm`, `CategoryChips`, `Pagination`, `SearchResults`, `app/productos/page.tsx`.
- **Estilo:** mantener el estilo visual actual (violeta/fucsia, `rounded-full`, sombras suaves); móvil primero (~375 px sin desbordes).
- **Preguntas abiertas:** ninguna; los precios `0` se tratan como valores normales (si hay productos gratuitos, `precioMin=0` los incluye).
