# Plan — Fase 29: Revisión de rendimiento, accesibilidad y seguridad

Cada grupo es independiente; el informe (grupo 5) se va completando a medida que se avanza.

## 1. Seguridad
1.1 Leer guías de Next 16 (CSP, production-checklist, data-security).
1.2 Auditar: cookie de sesión, rate limit del login, validación Zod en `/go/[slug]`, webhook, Server Actions del admin (comprobación de sesión en cada acción), redirecciones (`redirect` del login), `rel` de enlaces externos.
1.3 `next.config.ts`: `headers()` con `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` (o `frame-ancestors`), `Permissions-Policy` mínima y HSTS solo en producción; evaluar CSP (ver decisiones).
1.4 Sanear `.env.example` (placeholders) y ejecutar `npm audit`; documentar resultados.
1.5 Test de cabeceras (leer `nextConfig.headers()`), tests de los endurecimientos aplicados.

## 2. Rendimiento
2.1 `next build`: revisar tamaño por ruta y JS del primer load.
2.2 Lighthouse móvil en `/`, `/productos/`, `/productos/<slug>/` (registrar puntuaciones y LCP/CLS/TBT).
2.3 Revisar los 11 componentes `"use client"`: mover lógica a servidor donde sea posible.
2.4 Imágenes: `alt`, `width/height` o contenedor con aspect-ratio, `loading="lazy"` fuera del primer viewport, prioridad en la imagen del Hero.
2.5 Fuentes: confirmar `display: swap` y subsets mínimos (Tangerine solo donde se usa).
2.6 Corregir hallazgos de bajo riesgo con tests.

## 3. Accesibilidad
3.1 Lighthouse/DevTools a11y en las mismas páginas + admin login.
3.2 Teclado: navbar y menú móvil (estado `aria-expanded`), chips de categoría, filtros, paginación, carrusel horizontal (accesible por foco).
3.3 Contraste AA en textos sobre fondos violeta/gradientes; foco visible (`focus-visible`).
3.4 Formularios (búsqueda, filtros, login, CRUD admin): `label`, `aria-describedby`/`role="alert"` en errores.
3.5 Landmarks, jerarquía h1→h2→h3, `alt` útil o vacío decorativo, enlaces con texto descriptivo.
3.6 Corregir hallazgos de bajo riesgo con tests (Testing Library: roles, nombres accesibles).

## 4. Navegación
4.1 Verificar enlace "saltar al contenido" (añadirlo si falta, sin cambiar el diseño visible salvo en foco) y que `/robots.txt`, `/sitemap.xml` y rutas públicas no se vean afectadas por las cabeceras.

## 5. Informe y cierre
5.1 Redactar `informe.md` (hallazgo, severidad, estado, evidencia, puntuaciones Lighthouse antes/después).
5.2 Hallazgos pospuestos → proponer nuevas fases en `specs/roadmap.md` (con aprobación del usuario).
5.3 Actualizar `specs/tech-stack.md` con las cabeceras/decisiones de seguridad adoptadas.
5.4 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
