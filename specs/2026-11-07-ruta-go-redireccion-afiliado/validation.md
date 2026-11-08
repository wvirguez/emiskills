# Validación — Ruta `/go/[slug]` (Fase 18)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `route.test.ts` afirma:
  - slug válido y activo → estado **307** y `Location` igual a `affiliateUrl`;
  - cabecera `X-Robots-Tag` con `noindex`;
  - slug inexistente, producto inactivo y `affiliateUrl` con protocolo no http(s) o malformada → estado **404**, sin `Location`.
- `products.test.ts` cubre `getAffiliateUrlBySlug` (activo, inactivo, inexistente, slug inválido).
- `ProductDetail.test.tsx` afirma `href="/go/<slug>"` y `rel` que contiene `sponsored`.
- `affiliateUrl` no aparece en `ProductDTO` (verificable con `tsc`).

## Manual
Con `npm run build && npm start` y datos de `npm run db:seed`:
- `curl -I http://localhost:3000/go/<slug-existente>` → `307` y `Location` hacia la URL del productor.
- `curl -I http://localhost:3000/go/no-existe` → `404`.
- Desactivar un producto (`isActive = false`) y repetir → `404`; reactivarlo.
- En el navegador: el botón "Ir a la oferta" del detalle abre la plataforma del productor en pestaña nueva; el botón Atrás no queda atrapado en una redirección.
- Los tarjetas del catálogo siguen llevando al detalle, no al productor. Sin errores en consola.

## Verificación del tono
- Los textos visibles (CTA, 404) son sobrios y en español, sin urgencia; el aviso de afiliado sigue visible junto al CTA.

## Definición de "terminado"
- `/go/[slug]` redirige con 307 a productos activos y devuelve 404 en el resto.
- `affiliateUrl` solo se lee en servidor y se valida (http/https).
- Sin `any`, sin dependencias nuevas, sin cambios de esquema.
- Pruebas y comprobaciones manuales pasan.
- Fase 18 marcada `[x]` en `specs/roadmap.md`.
