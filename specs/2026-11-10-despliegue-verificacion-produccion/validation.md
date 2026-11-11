# Validación — Fase 31: Despliegue y verificación en producción

## Automatizado
- En `main` antes de desplegar: `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores; `npm audit --omit=dev` sin vulnerabilidades altas/críticas.
- Comprobaciones con curl sobre `https://<dominio>` (cada una con resultado esperado):
  - `/`, `/productos/`, `/robots.txt`, `/sitemap.xml` → 200; los dos últimos contienen el dominio real, no `localhost`.
  - `/opengraph-image/` → 200 `image/png`.
  - Cabeceras en `/`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` y `Strict-Transport-Security`.
  - `/admin/` sin cookie → redirección al login.
  - `POST /api/webhooks/hotmart/` sin hottok → 401 (503 si falta `HOTMART_HOTTOK`), nunca 500.
  - `/go/<slug-activo>/` → 307 al enlace de afiliado con `X-Robots-Tag: noindex, nofollow`; `/go/<inexistente>/` → 404.
- BD: 3 migraciones aplicadas; el seed de producción no creó productos.
- Lighthouse móvil sobre producción: Accesibilidad y Buenas prácticas ≥ 90, SEO ≥ 90 en home y catálogo, Rendimiento ≥ 80 (registrar causa si no se cumple).

## Manual
- Recorrido en el navegador (móvil y escritorio): home, categorías, buscador y filtros, detalle, botón «Ir a la oferta» (abre el sitio del productor), pie y aviso de afiliados.
- Admin: login correcto, login incorrecto con mensaje genérico, cierre de sesión; CRUD de categoría/producto manual de prueba (y su borrado); métricas muestran el clic de prueba.
- Hotmart: sincronización trae productos (inactivos), se activan desde el admin y aparecen en el catálogo; webhook de prueba responde 200.
- Reinicio de la app desde el panel: el sitio vuelve a responder y las variables se conservan.
- Comprobar que el certificado es válido y que `http://` redirige a `https://`.
- Revisión de acuerdos de afiliación y uso de marca de Hotmart y productores listados (puntos abiertos de `tech-stack.md`).

## Verificación del tono
- Los textos visibles no cambian; verificar en producción que la divulgación de afiliados aparece (home, catálogo, detalle) y que no hay falsas urgencias ni reseñas inventadas.
- Los productos de ejemplo (`example.com`) no existen en producción.

## Definición de “terminado”
- Sitio accesible por HTTPS en el dominio propio con todas las comprobaciones anteriores superadas (o excepciones justificadas en el informe).
- Admin operativo con credenciales y `SESSION_SECRET` de producción; Hotmart sincronizando y webhook recibiendo eventos.
- `informe.md` completo, sin secretos; checklist de `DEPLOY.md` §9 marcado; puntos abiertos de `tech-stack.md` cerrados.
- Credenciales de desarrollo rotadas si salieron de la máquina.
- Fase 31 marcada `[x]` en `specs/roadmap.md` solo tras validar en producción.
