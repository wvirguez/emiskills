# Validación — Categorías con scroll horizontal (Fase 16)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `ProductCardCompact.test.tsx` afirma título, categoría, plataforma, precio con moneda y `href="/productos/<slug>"`.
- `Categories.test.tsx` afirma: chip "Todos" + una por categoría; el activo tiene `aria-current="true"`; sin parámetro se llama `getProducts` sin `categorySlug`; con `categoria=curso` se llama con `categorySlug: "curso"`; slug inexistente equivale a "Todos"; estado vacío con el mensaje esperado; un error de BD no lanza.
- Prueba del helper: `buildHomeCategoryHref()` → `/#categorias`; `buildHomeCategoryHref("curso")` → `/?categoria=curso#categorias`.
- `app/page.test.tsx` sigue afirmando las anclas `productos`, `categorias`, `buscar`, `como-funciona` y la franja "Beneficios".

## Manual
Con `npm run build && npm start` (MySQL local con seed):
- Home: bajo la franja de beneficios aparece "Categorías" con chips y un carrusel horizontal de tarjetas medianas.
- Por defecto "Todos" activo y el carrusel muestra productos de varias categorías.
- Clic en una categoría: la URL pasa a `/?categoria=slug#categorias`, solo se ven productos de esa categoría, el chip queda resaltado y la vista no salta al inicio de la página.
- Clic en "Todos" restaura el listado completo.
- `/?categoria=no-existe` se comporta como "Todos" sin error.
- Móvil (~375 px): scroll con el dedo, las tarjetas se alinean (snap), el último elemento es alcanzable, sin desbordes de la página; escritorio: scroll con rueda/trackpad/teclado (Tab al carrusel + flechas).
- "Ver producto" abre el detalle; "Ver todos en el catálogo" abre `/productos` (con la categoría si hay una activa).
- "VER CATEGORÍAS" del Hero y el enlace de la Navbar siguen llevando a la sección.
- Categoría sin productos: mensaje, sin carrusel vacío. Sin errores en la consola.

## Verificación del tono
- Sin "populares", "más vendidos", ofertas ni urgencia; los textos describen el contenido real.

## Definición de "terminado"
- `ProductCardCompact` y `Categories` nuevos/actualizados, tipados, sin `any`, sin dependencias nuevas y sin JS de cliente.
- Filtro por categoría funcionando por URL, con "Todos" por defecto.
- Comprobaciones automatizadas y manuales pasan.
- Fase 16 marcada `[x]` en `specs/roadmap.md`.
