# Requisitos — Buscador: texto + filtro por categoría (Fase 10)

## Alcance

### Incluye
- Nueva ruta `app/productos/page.tsx` (Server Component) que lista resultados según la query string `?q=<texto>&categoria=<slug>&page=<n>`.
- Ampliar la capa de datos (`lib/products.ts`): `getProducts` acepta `q` y `categorySlug` como filtros opcionales (el conteo y `totalPages` respetan los filtros).
- Esquema Zod de los parámetros de búsqueda (`lib/search-params.ts`): `q` (trim, máx. 100 caracteres, vacío → sin filtro), `categoria` (slug, formato `[a-z0-9-]{1,50}`, se descarta si no existe en la BD), `page` (entero ≥ 1, por defecto 1). Parámetros inválidos se normalizan sin lanzar.
- `SearchCourses` (landing) pasa a ser un `<form method="get" action="/productos">` con input `q` y botón "Buscar"; los chips de categoría se generan con `getCategories()` y enlazan a `/productos?categoria=<slug>`; chip "Todos" → `/productos`.
- Sección `Categories` de la landing lee `getCategories()` y enlaza a `/productos?categoria=<slug>` (hoy usa slugs estáticos en plural que no existen en la BD).
- La página `/productos` muestra: formulario (con `q` y categoría actual conservados), chips de categoría con el activo resaltado (`aria-current`), contador de resultados, grid de `ProductCard`, paginación (anterior/siguiente conservando filtros) y estado sin resultados.
- Enlaces del `Navbar` hacia anclas de la landing con prefijo `/` (`/#productos`, `/#categorias`, `/#buscar`, `/#como-funciona`) para que funcionen desde `/productos` y desde la ficha.
- Metadatos de `/productos` (título "Catálogo de productos | EmiSkills").
- Tests de capa de datos, esquema de parámetros, componentes y página.

### No incluye
- Filtros por precio, idioma y plataforma (Fase 11).
- Ordenamiento seleccionable, búsqueda por descripción larga, relevancia o sugerencias/autocompletado.
- Búsqueda en cliente con debounce (no se usa `"use client"` en el buscador).
- Cambios de esquema o migraciones (`LIKE` sobre columnas existentes; índices full-text quedan fuera).
- Pulido responsive global y divulgación de afiliados (Fase 12), aunque el diseño sigue móvil primero.

### Parámetros de la URL
| Parámetro | Tipo | Notas |
|---|---|---|
| `q` | texto | Busca (sin distinguir mayúsculas, según la collation de MySQL) en `title` y `shortDescription` con `contains`. Se escapan los comodines por Prisma. |
| `categoria` | slug | Slug de `Category` (`curso`, `ebook`, `plantilla`, `membresia`). Si no existe → sin filtro de categoría. |
| `page` | entero | Tamaño de página 12 (`DEFAULT_PAGE_SIZE`). Fuera de rango → lista vacía con el mensaje de sin resultados. |

## Decisiones
- **Página `/productos` con resultados:** separa descubrimiento (landing) de listado; la landing mantiene su vitrina de 6 destacados.
- **GET + URL compartible, sin JS:** funciona sin hidratación, es ligero en móvil, permite compartir/volver atrás y evita estado en cliente. Los chips son enlaces, no botones.
- **Texto en título y descripción corta:** son los campos que el visitante ve en la tarjeta; `description` larga queda fuera para evitar coincidencias que no se ven en el resultado.
- **Categoría validada contra la BD:** la lista de categorías sale de `getCategories()`; un slug desconocido se ignora, no genera error.
- **Chips y sección Categorías desde la BD:** elimina los slugs estáticos desalineados (`cursos` vs `curso`) y evita enlaces rotos.
- **Datos por petición:** la página lee `searchParams` (que ya es dinámica); no hay `generateStaticParams`. Antes de codificar, leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` (en esta versión `searchParams` es una `Promise`).
- **Errores de BD:** `try/catch` solo donde se pueda degradar (chips vacíos); si falla la consulta de resultados, dejar que actúe `error.tsx` en español (no mostrar "sin resultados" falso).

## Contexto
- **Tono:** honesto y objetivo. Sin resultados: "No encontramos productos que coincidan con tu búsqueda." + enlace "Ver todos los productos". Sin sugerencias inventadas, sin "tendencias" ni urgencia.
- **Estilo:** conservar el diseño actual del buscador (input redondeado con ring violeta, botón degradado violeta→fucsia, chips). Chip activo con mayor contraste.
- **Accesibilidad:** `label` accesible (visualmente oculto) para el input, `role="search"` en el formulario, `aria-current="page"` en el chip activo, paginación con `nav aria-label="Paginación"`.
- **Stack:** Server Components, sin dependencias nuevas, TypeScript estricto sin `any`, Zod en el límite (query string), interfaz solo en español.
- **Patrones existentes:** `lib/products.ts` (DTO, Zod `.catch`), `ProductCard`, tests con mock de `@/lib/db` (ver `lib/products.test.ts`) y de `@/lib/products` (ver `components/FeaturedProducts.test.tsx`). Evitar `beforeEach(() => mock.reset())` sin llaves (Vitest lo ejecuta como limpieza).
- **`trailingSlash: true`:** el formulario `action="/productos"` pasa por la redirección con barra final; verificar que la query string se conserva (Next la mantiene en el 308) o usar `action="/productos/"`.
