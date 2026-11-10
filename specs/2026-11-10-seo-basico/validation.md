# Validación — Fase 28: SEO básico

## Automatizado
- `npm test` pasa, con afirmaciones específicas:
  - `parseSiteEnv` rechaza URLs no http(s) y quita/rechaza barra final; usa default en desarrollo.
  - `absoluteUrl("/productos")` → `<SITE_URL>/productos/`.
  - `sitemap()` incluye home, `/productos/` y solo productos activos, todas con URL absoluta.
  - `robots()` contiene `disallow` de `/admin/`, `/go/`, `/api/` y `sitemap` con `SITE_URL`.
  - `generateMetadata` de detalle: canonical correcto, `openGraph.images` = imagen del producto o por defecto; producto inexistente → `robots.index === false`.
  - Metadatos de `/productos` con filtros canonicalizan a `/productos/`.
- `npm run lint` sin errores.
- `npx tsc --noEmit` sin errores (sin `any`).

## Manual
- `npm run build && npm start` con `SITE_URL` definida: el build no falla sin BD accesible para el sitemap (o falla con mensaje claro, según decisión documentada).
- `/sitemap.xml` lista home, catálogo y productos activos; un producto desactivado no aparece.
- `/robots.txt` muestra reglas y la línea `Sitemap:`.
- Ver código fuente de `/`, `/productos/` y `/productos/<slug>/`: `<title>`, `description`, `canonical`, `og:*`, `twitter:*` correctos.
- `/opengraph-image` responde una imagen; probar un enlace con un validador de OG o inspección de cabeceras.
- `/productos/?q=x&categoria=y` conserva canonical `/productos/`.
- Producto inexistente: 404 con `noindex`.
- `/admin` y `/go/<slug>` siguen funcionando igual (proxy no afectado).

## Verificación del tono
- Títulos y descripciones comerciales pero veraces: sin falsas urgencias, sin reseñas/cifras inventadas, sin promesas de resultados ni descuentos.
- La home/descripciones generales no ocultan que somos afiliados y que la compra es en la plataforma del productor.
- Todo en español.

## Definición de “terminado”
- Todos los checks automatizados y manuales pasan.
- `SITE_URL` documentada en `.env.example` y `specs/tech-stack.md`.
- Sin dependencias nuevas.
- Fase 28 marcada `[x]` en `specs/roadmap.md` solo tras validar.
