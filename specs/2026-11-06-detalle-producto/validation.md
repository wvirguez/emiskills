# Validación — Página de detalle de producto (Fase 9)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `components/ProductDetail.test.tsx` afirma que:
  - El `h1` es el título; se muestran categoría, plataforma, idioma legible y `29.00 USD`.
  - Con `description` se muestra la descripción completa; con `null` se muestra `shortDescription`.
  - El botón "Ir a la oferta" tiene `href="/go/<slug>"`.
  - Aparece el aviso de afiliados y el enlace "Volver al catálogo".
  - No se renderiza `affiliateUrl` ni textos de urgencia/escasez/reseñas.
- `formatLanguage`: `es`, `en`, `pt` → nombres; código desconocido → mayúsculas.
- `app/productos/[slug]/page.test.tsx` afirma que:
  - Un slug existente renderiza la ficha.
  - `getProductBySlug` → `null` provoca `notFound()`.
  - `generateMetadata` devuelve `"<título> | EmiSkills"` y descripción ≤ ~160 caracteres.
- `ProductCard` mantiene sus tests en verde tras extraer el degradado.

## Manual
- Con MySQL sembrado, `npm run dev`: desde la landing, "Ver producto" abre la ficha con datos correctos de ese producto.
- Slug inexistente (`/productos/no-existe`) → 404 en español con enlace al catálogo.
- Desactivar un producto en `npm run db:studio` → su URL da 404 sin reconstruir; reactivar después.
- Producto con `description` y otro con `description = null` (ajustar en Studio): ambos se ven bien; saltos de párrafo respetados.
- Título de pestaña y meta description corresponden al producto (inspeccionar `<head>`).
- "Ir a la oferta" lleva a `/go/<slug>` (404 hasta la Fase 13; esperado).
- Móvil (~375 px): una columna, sin desbordes, botón accesible con el pulgar; `lg`: layout de escritorio correcto.
- Con `trailingSlash`, `/productos/<slug>` y `/productos/<slug>/` cargan la ficha.
- BD detenida: se muestra el error en español, no un 404 falso.

## Verificación del tono
- Textos en español, objetivos; sin ofertas, escasez, "más vendido" ni reseñas.
- Precio con su moneda real, sin conversión.
- Divulgación de afiliados visible junto al botón, sin afirmar acuerdos no verificados.

## Definición de "terminado"
- Ruta `/productos/[slug]`, `ProductDetail` y `not-found.tsx` implementados, sin `any` ni dependencias nuevas.
- `affiliateUrl` nunca llega al cliente.
- Todas las comprobaciones automatizadas y manuales pasan.
- Fase 9 marcada `[x]` en `specs/roadmap.md`.
