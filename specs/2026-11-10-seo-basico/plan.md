# Plan — Fase 28: SEO básico

Cada grupo es implementable de forma independiente (en este orden recomendado).

## 1. Configuración y datos
1.1 `lib/env.ts`: `siteEnvSchema` (`SITE_URL` URL http/https, sin barra final; default `http://localhost:3000` fuera de producción) + `parseSiteEnv` y `getSiteEnv()`; tests en `lib/env.test.ts`.
1.2 `lib/site.ts`: constantes (`SITE_NAME`, descripción por defecto) y helper `absoluteUrl(path)` respetando `trailingSlash`; tests.
1.3 `lib/products.ts`: `getSitemapProducts()` → `{ slug, updatedAt }[]` activos; tests con Prisma mockeado.
1.4 `.env.example` y `specs/tech-stack.md`: documentar `SITE_URL`.

## 2. Componentes / metadatos compartidos
2.1 `lib/seo.ts`: helper `buildMetadata({ title, description, path, image? })` que devuelve `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`; tests.
2.2 `app/opengraph-image.tsx` (imagen OG por defecto de marca, `ImageResponse`, sin dependencias nuevas) — verificar en docs.

## 3. Páginas y rutas
3.1 `app/layout.tsx`: `metadataBase`, `title.template`, OG/Twitter por defecto.
3.2 `app/page.tsx`: metadatos de home (texto comercial honesto).
3.3 `app/productos/page.tsx`: metadatos + canonical `/productos/` (sin filtros).
3.4 `app/productos/[slug]/page.tsx`: ampliar `generateMetadata` (canonical, OG con imagen del producto, `noindex` si no existe).
3.5 `app/sitemap.ts` y `app/robots.ts`.

## 4. Navegación
4.1 Sin cambios de UI. Comprobar que `/sitemap.xml` y `/robots.txt` no los intercepta `proxy.ts` (matcher de `/admin`); ajustar solo si hace falta.

## 5. Pruebas
5.1 Tests de `sitemap.ts` (incluye home, /productos/, productos activos; URLs absolutas con barra final).
5.2 Tests de `robots.ts` (disallow `/admin/`, `/go/`, `/api/`; sitemap).
5.3 Tests de `generateMetadata` de detalle (producto existente, inexistente → noindex, imagen OG).
5.4 Tests de metadatos de home y `/productos`.
5.5 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`.
