# Plan — Página de detalle de producto (Fase 9)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones; `getProductBySlug` ya devuelve `description`, `language` y relaciones.
1.2 Confirmar con el seed local que existen productos con slug conocido para la prueba manual.

## 2. Componentes
2.1 Extraer el degradado por defecto a un módulo compartido (p. ej. `lib/product-ui.ts`) y usarlo desde `ProductCard`.
2.2 Añadir en ese módulo `formatLanguage(code)` (es/en/pt → nombre; otro → código en mayúsculas) y `formatPrice(price, currency)` si simplifica ambos componentes.
2.3 Crear `components/ProductDetail.tsx` (Server Component): bloque visual con degradado y badge de categoría, `h1`, plataforma, idioma, precio+moneda, descripción por párrafos, botón "Ir a la oferta" → `/go/<slug>`, aviso de afiliados y enlace "← Volver al catálogo".
2.4 Mantener `ProductCard` sin cambios visibles.

## 3. Página y ruta
3.1 `app/productos/[slug]/page.tsx`: `params` como `Promise`; llamar a `getProductBySlug`; `notFound()` si es `null`; renderizar `ProductDetail`.
3.2 Asegurar lectura por petición (`await connection()` de `next/server`, dentro de `<Suspense>` si hace falta); sin `generateStaticParams`.
3.3 `generateMetadata`: título `"<título> | EmiSkills"` y descripción recortada a ~160 caracteres; producto inexistente → título genérico.
3.4 `app/productos/[slug]/not-found.tsx`: mensaje en español ("No encontramos este producto") y enlace al catálogo.
3.5 Manejo de errores de BD: dejar que `error.tsx`/el error por defecto lo gestione (no mostrar 404 falso); valorar `app/productos/[slug]/error.tsx` simple en español.

## 4. Navegación
4.1 Confirmar que los enlaces de `ProductCard` (`/productos/<slug>`) llevan a la ficha (con `trailingSlash`).
4.2 "Volver al catálogo" apunta a la landing; si `FeaturedProducts` no tiene ancla, añadir `id="productos"` a la sección sin cambiar su estilo.
4.3 No modificar `Navbar`.

## 5. Pruebas
5.1 `components/ProductDetail.test.tsx`: muestra título (h1), categoría, plataforma, idioma legible, `29.00 USD`; usa `description` cuando existe y `shortDescription` cuando es `null`; botón con `href="/go/<slug>"`; aviso de afiliados presente; no aparece `affiliate_url`/`affiliateUrl`; sin textos de urgencia.
5.2 Tests de `formatLanguage` (es, en, pt, código desconocido).
5.3 `app/productos/[slug]/page.test.tsx` (mock de `@/lib/products` y de `next/navigation`/`next/server`): slug existente renderiza la ficha; `null` invoca `notFound()`; `generateMetadata` devuelve título y descripción recortada.
5.4 Marcar Fase 9 como `[x]` en `specs/roadmap.md` tras validar.
