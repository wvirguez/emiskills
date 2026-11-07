# Validación — Buscador: texto + filtro por categoría (Fase 10)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores y `/productos` figura como dinámica (`ƒ`).
- `lib/products.test.ts` afirma que:
  - Con `q`, `findMany` y `count` reciben el mismo `where` con `isActive: true` y `OR` sobre `title` y `shortDescription` (`contains`).
  - Con `categorySlug`, el `where` incluye `category: { slug }`.
  - Sin filtros el `where` sigue siendo `{ isActive: true }`.
  - `totalPages` se calcula sobre el total filtrado.
- `lib/search-params.test.ts` afirma: `q` se recorta y limita a 100; vacío → sin filtro; arrays → primer valor; `page` inválido → 1; `categoria` con formato inválido → ignorada.
- `components/SearchCourses.test.tsx` afirma: `form` con `method="get"` y `action="/productos"`, input `name="q"` con etiqueta accesible, chips con `href="/productos?categoria=<slug>"`, y degradación a solo "Todos" si falla `getCategories`.
- `Pagination`: enlaces conservan `q` y `categoria`; no se renderiza con una sola página.
- `SearchResults`/página: lista de tarjetas con resultados; sin resultados muestra "No encontramos productos…" y el enlace "Ver todos los productos"; categoría desconocida no filtra.

## Manual
Con MySQL local sembrado (6 productos, 4 categorías), `npm run build && npm start`:
- Landing: buscar "java" → `/productos/?q=java` con 1 resultado; la query string se conserva tras la redirección de `trailingSlash`.
- Búsqueda sin distinguir mayúsculas/acentos razonables ("JAVA" encuentra "Java"); `q` con `%` o `_` no actúa como comodín.
- Chip "Cursos"/"Ebooks"/… desde la landing y desde `/productos`: filtra y resalta el chip activo; "Todos" quita el filtro.
- Combinar texto + categoría; cambiar de categoría conserva el texto.
- `?categoria=inexistente` → muestra todos sin error; `?page=999` → mensaje de sin resultados; `?page=abc` → página 1.
- Texto sin coincidencias → mensaje honesto y enlace "Ver todos".
- Sección Categorías de la landing: cada enlace lleva a `/productos?categoria=<slug>` con resultados reales.
- Navbar desde `/productos` y desde la ficha: los enlaces llevan a las secciones de la landing.
- Desactivar un producto en Studio → desaparece de los resultados.
- BD detenida: se muestra el error en español, no "sin resultados".
- Móvil (~375 px): input y botón no desbordan, chips en varias líneas, paginación usable con el pulgar.
- Teclado: Enter en el input envía la búsqueda; el foco es visible.

## Verificación del tono
- Textos en español, objetivos; sin urgencia, "tendencias", "más buscado" ni sugerencias inventadas.
- El mensaje de sin resultados es neutro.

## Definición de "terminado"
- `/productos` implementado con búsqueda por texto y categoría, paginación y estado vacío; landing y Navbar apuntan a ella.
- Sin `any`, sin dependencias nuevas y sin `"use client"` en el buscador.
- Todas las comprobaciones automatizadas y manuales pasan.
- Fase 10 marcada `[x]` en `specs/roadmap.md`.
