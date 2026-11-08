# Plan — Ruta `/go/[slug]` (Fase 18)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones (`Product.affiliateUrl` e `isActive` ya existen).
1.2 Añadir `getAffiliateUrlBySlug(slug: string): Promise<string | null>` en `lib/products.ts`: valida `slug` con Zod, `db.product.findFirst({ where: { slug, isActive: true }, select: { affiliateUrl: true } })`.
1.3 Tests en `lib/products.test.ts`: producto activo → URL; inactivo/inexistente → `null`; slug inválido (vacío, >150) → `null` sin consultar la BD.

## 2. Componentes
2.1 Revisar `ProductDetail`: CTA con `href="/go/${slug}"`, `target="_blank"` y `rel="sponsored nofollow noopener noreferrer"`.
2.2 Confirmar que `ProductCard` y `ProductCardCompact` no enlazan a la URL externa (siguen yendo a `/productos/[slug]`). Ajustar sus tests si cambia algo.

## 3. Página y ruta
3.1 Crear `app/go/[slug]/route.ts` con `GET(request, { params })` (params asíncrono según docs de Next 16).
3.2 Obtener la URL con `getAffiliateUrlBySlug`; validar con Zod/`URL` que el protocolo sea `http:`/`https:`.
3.3 Éxito → redirección 307 con `X-Robots-Tag: noindex, nofollow` y `Cache-Control: no-store`.
3.4 Fallo → respuesta 404 (texto breve en español, `noindex`).
3.5 Capturar errores de BD: registrar y devolver 500/404 genérico sin filtrar detalles.

## 4. Navegación
4.1 Ningún cambio en Navbar/Footer.
4.2 Verificar que todos los CTAs de compra del sitio pasan por `/go/[slug]`.

## 5. Pruebas
5.1 `app/go/[slug]/route.test.ts`: 307 + `Location` correcto; cabeceras `noindex`; 404 para slug inexistente, producto inactivo y URL `javascript:`/malformada; `getAffiliateUrlBySlug` simulada con `vi.mock`.
5.2 Prueba de `ProductDetail` que afirme `href="/go/<slug>"` y `rel` con `sponsored`.
5.3 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.4 Marcar la Fase 18 como `[x]` en `specs/roadmap.md`.
