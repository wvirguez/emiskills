# Requisitos — Categorías con scroll horizontal (Fase 16)

## Alcance

### Incluye
- Rediseñar `components/Categories.tsx` (mantiene `id="categorias"`, encabezado "Categorías" y su carga tolerante a errores de BD):
  - Fila de chips: **Todos** + una por categoría de la BD. El chip activo se resalta (`aria-current="true"`).
  - Debajo, un carrusel de scroll horizontal con tarjetas medianas de producto de la categoría activa (por defecto, todos).
- Nuevo componente `components/ProductCardCompact.tsx`: tarjeta mediana (ancho fijo ~16–18 rem, `snap-start`, `shrink-0`) con degradado de color, nombre de categoría, título, plataforma, precio + moneda y enlace "Ver producto" a `/productos/[slug]`. La `ProductCard` actual no se modifica.
- Selección **por URL**: `/?categoria=<slug>#categorias`. La portada (`app/page.tsx`) lee `searchParams` y se lo pasa a `Categories`.
- Datos: `getProducts({ categorySlug, pageSize: CAROUSEL_COUNT })` con `CAROUSEL_COUNT = 12` (reutiliza la capa de datos; sin consultas nuevas).
- Enlace final del carrusel "Ver todos en el catálogo" → `/productos` o `/productos?categoria=<slug>` (usa `buildProductsHref`).
- Pruebas de `ProductCardCompact`, `Categories` y `app/page.test.tsx`.

### No incluye
- JS de cliente, flechas/botones de desplazamiento, autoplay ni animaciones.
- Cambios en `ProductCard`, `FeaturedProducts`, la página `/productos` ni el esquema de BD.
- Filtros de precio/idioma/plataforma en la portada.

### Datos de la tarjeta compacta
| Campo | Origen |
|---|---|
| Categoría | `product.category.name` |
| Título | `product.title` (máx. 2 líneas) |
| Plataforma | `product.platform.name` |
| Precio / moneda | `product.price.toFixed(2)` + `product.currency` |
| Fondo | `product.imageGradient ?? DEFAULT_GRADIENT` (`lib/product-ui`) |

## Decisiones
- **Cambio por URL, no por cliente** (decisión del usuario): Server Component, sin JS de cliente, ligero en móvil, enlazable y compartible. Un slug inválido o inexistente se trata como "Todos".
- **Chips con "Todos" + carrusel de tarjetas medianas** (decisión del usuario).
- **Tarjeta nueva y propia** (decisión del usuario): la `ProductCard` actual (imagen `h-48`) es demasiado grande para un carrusel.
- **Sin salto de página al cambiar de categoría:** los chips son `<Link href="/?categoria=slug#categorias" scroll={false}>`; el ancla mantiene la vista en la sección. Verificar en el navegador (ver `validation.md`); si `scroll={false}` con ancla se comporta mal, quitarlo y dejar solo el ancla.
- **Los chips actuales de Categories (que llevaban a `/productos?categoria=...`) se reemplazan**; el acceso al catálogo filtrado queda en el enlace "Ver todos…" del carrusel.
- **Categoría sin productos:** mensaje "Aún no hay productos en esta categoría." sin carrusel vacío.
- **Dinámico:** `/` ya es dinámica (`FeaturedProducts` usa `connection()`); `Categories` también llama a `await connection()` o queda dentro de `Suspense` con fallback ligero, como `FeaturedProducts`.

## Contexto
- **Tono:** objetivo; sin "populares", "más vendidos", "oferta" ni urgencia. Subtítulo sugerido: "Explora productos por categoría". Mostrar el orden real (más recientes), sin implicar ranking.
- **Stack:** Next.js 16 App Router (en `page.tsx`, `searchParams` es `Promise`; leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` y `02-components/link.md`), React 19, Tailwind 4, TypeScript estricto sin `any`, sin dependencias nuevas.
- **Patrones:** `CategoryChips.tsx` (chips), `FeaturedProducts.tsx` (carga con try/catch + `connection()`), `lib/search-params.ts` (`categoriaSchema`: regex `^[a-z0-9-]{1,50}$`, `buildProductsHref`).
- **Móvil primero:** `overflow-x-auto snap-x snap-mandatory`, `-mx-4 px-4` para sangrar al borde, `scroll-px-4`, barra de scroll visible o discreta; tarjetas con `w-64` o similar; ≤12 tarjetas para no recargar la red.
- **Accesibilidad:** carrusel como `<ul role="list">` dentro de una región con `aria-label`; chips con `aria-current`; contenedor con `tabIndex={0}` para desplazarlo con teclado; íconos `aria-hidden`.
- **Anclas existentes:** Hero ("VER CATEGORÍAS") y Navbar/Footer enlazan a `/#categorias`; deben seguir funcionando.
- **Interfaz solo en español.**
