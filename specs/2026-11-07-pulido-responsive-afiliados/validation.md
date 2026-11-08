# Validación — Pulido responsive/móvil y aviso de afiliados (Fase 17)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `AffiliateNotice.test.tsx` afirma el texto "Aviso de afiliado", la mención de comisión "sin costo extra" y el enlace con `href="/#aviso-afiliados"`.
- Las pruebas de landing, `/productos` y detalle afirman que el aviso corto está presente.
- `AffiliateDisclosure` expone `id="aviso-afiliados"`.

## Manual
Con `npm run build && npm start`, en 375, 768 y 1024 px (DevTools):
- **Sin desbordes horizontales** en landing, `/productos`, detalle, Navbar y Footer (`document.documentElement.scrollWidth <= innerWidth`).
- Botones, chips, enlaces de paginación y del menú móvil con objetivo táctil ≥ 44 px.
- Texto del contenido principal ≥ 14 px; el aviso corto legible.
- Carrusel de categorías y franja de beneficios se ven bien (2×2 en móvil; scroll horizontal solo dentro del carrusel).
- Buscador y filtros usables en móvil (campos y botones sin recortes).
- El aviso corto es visible en landing, `/productos` y detalle; "Más información" lleva al aviso completo de la landing.
- El Footer y el aviso completo no se contradicen. Sin errores en consola.
- Se anotan los hallazgos de la auditoría y su corrección (lista en el PR o en la sesión).

## Verificación del tono
- El aviso dice con claridad que somos afiliados y que podemos recibir comisión sin costo extra; sin promesas ni urgencia.
- La afirmación "no influyen en el orden" sigue siendo cierta (orden por fecha de creación).

## Definición de "terminado"
- `AffiliateNotice` creado y presente en landing, catálogo y detalle; aviso completo anclado.
- Auditoría responsive realizada y correcciones aplicadas, sin rediseños.
- Sin `any`, sin dependencias nuevas, sin rutas nuevas.
- Comprobaciones automatizadas y manuales pasan.
- Fase 17 marcada `[x]` en `specs/roadmap.md`.
