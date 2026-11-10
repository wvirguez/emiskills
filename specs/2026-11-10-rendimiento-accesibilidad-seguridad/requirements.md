# Requisitos — Fase 29: Revisión de rendimiento, accesibilidad y seguridad

## Alcance

### Incluye
Revisión de la web pública y del panel admin en tres áreas, con **informe de hallazgos + corrección de los de bajo riesgo** en esta misma fase.

| Área | Qué se revisa |
|---|---|
| Rendimiento | Lighthouse móvil en `/`, `/productos/` y `/productos/<slug>/`: LCP/CLS/TBT, peso de JS y de imágenes, fuentes (`next/font`), componentes `"use client"` innecesarios (hoy 11), estrategia de caché/`connection()`, imágenes (`images.unoptimized`), `alt`/dimensiones para evitar CLS. |
| Accesibilidad | Contraste (WCAG AA), foco visible y orden de tabulación, navegación por teclado (menú móvil, filtros, chips de categoría, scroll horizontal), etiquetas de formularios, `alt`, landmarks (`header/nav/main/footer`), jerarquía de encabezados, `aria-*` correctos, `lang="es"`, mensajes de error asociados a campos. |
| Seguridad | Cabeceras HTTP (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`, HSTS en producción) vía `next.config.ts`; revisar CSP según `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`; cookie de sesión (httpOnly, secure, sameSite), rate limit del login, validación Zod en límites (formularios, `/go/[slug]`, webhook), redirecciones abiertas, enlaces externos (`rel="noopener noreferrer"`), fuga de secretos, `npm audit`. |
| Informe | `specs/2026-11-10-rendimiento-accesibilidad-seguridad/informe.md` con: hallazgo, severidad, estado (corregido / pospuesto), evidencia. |

### No incluye
- Cambios de diseño visual salvo lo estrictamente necesario (contraste/foco).
- Dependencias nuevas (axe, Playwright, etc.).
- Hallazgos grandes o riesgosos: se documentan y pasan al roadmap como fases nuevas, no se corrigen aquí.
- Configuración de infraestructura de Hostinger (Fase 30) y verificación en producción (Fase 31).

## Decisiones
- **Medición: Lighthouse móvil + checklist manual** (elegido). Sin dependencias nuevas. Metas: Accesibilidad ≥ 90, SEO ≥ 90, Buenas prácticas ≥ 90, Rendimiento ≥ 80 en móvil sobre `next build && next start`. Si una meta no se alcanza, se documenta la causa y se decide si es hallazgo pospuesto.
- **Entrega: informe + correcciones de bajo riesgo.** Bajo riesgo = cambio local, sin migraciones ni cambios de comportamiento de negocio, cubierto con tests.
- **Cabeceras de seguridad en `next.config.ts` (`headers()`)** en lugar de middleware; `proxy.ts` solo protege `/admin`.
- **CSP:** se evalúa; si requiere nonces y vuelve dinámicas todas las páginas, se documenta como hallazgo pospuesto en lugar de forzarla.

## Contexto
- **Restricciones (elegidas):** mantener el estilo visual actual; sin dependencias nuevas; hallazgos grandes → roadmap.
- **Next.js 16:** leer antes de codificar `02-guides/content-security-policy.md`, `production-checklist.md` y `data-security.md` en `node_modules/next/dist/docs/01-app/`.
- Existente a respetar: cookie de sesión `admin_session` (`lib/auth/session.ts`), rate limit (`lib/auth/rate-limit.ts`), `trailingSlash: true`, `images.unoptimized: true` (decidido por despliegue en Hostinger; solo se reabre si hay evidencia).
- **Tono:** si se tocan textos visibles, mantener honestidad (sin falsas urgencias ni reseñas inventadas); interfaz solo en español.
- Pruebas: Vitest + Testing Library; todo cambio de código lleva test.
- Aviso conocido (no es de esta fase pero entra en "seguridad"): `.env.example` versionado contiene valores que parecen credenciales reales; sustituir por placeholders y recomendar rotarlas.
