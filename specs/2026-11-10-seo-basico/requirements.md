# Requisitos — Fase 28: SEO básico

## Alcance

### Incluye
| Pieza | Detalle |
|---|---|
| `SITE_URL` | Variable de entorno validada con Zod en `lib/env.ts` (getter lazy `getSiteEnv()`); URL absoluta `http(s)://`, sin barra final. Opcional con valor por defecto `http://localhost:3000` en desarrollo; obligatoria en producción. |
| `metadataBase` y plantilla de título | En `app/layout.tsx`: `metadataBase`, `title.template` (`%s | EmiSkills`), `openGraph` y `twitter` por defecto (`siteName`, `locale: es_LA`, `type: website`), imagen OG por defecto. |
| Metadatos por página | Home (`/`), `/productos` y `/productos/[slug]` con `title`, `description`, `alternates.canonical`, `openGraph` y `twitter`. |
| Detalle de producto | OG `type: website` con imagen = `imageUrl` del producto si existe; si no, la imagen OG por defecto. Producto inexistente/inactivo: `robots: noindex`. |
| `app/sitemap.ts` | Home, `/productos/` y cada producto activo (`/productos/<slug>/`), con `lastModified` cuando haya dato. Respeta `trailingSlash: true`. |
| `app/robots.ts` | `allow: /`; `disallow: /admin/, /go/, /api/`; línea `Sitemap:` con `SITE_URL`. |
| Imagen OG por defecto | `app/opengraph-image.tsx` (o archivo estático) para la marca; sin dependencias nuevas. |
| Páginas con filtros | `/productos?...` canonicaliza a `/productos/` para no indexar combinaciones de filtros. |
| `.env.example` y `tech-stack.md` | Documentar `SITE_URL`. |

### No incluye
- Datos estructurados JSON-LD (`Product`), hreflang, manifest/PWA, analítica.
- Optimización de imágenes (`images.unoptimized` se mantiene; revisión en Fase 29).
- Metadatos de `/admin` (ya protegido; solo se bloquea en robots).

## Decisiones
- **Base URL por env `SITE_URL`:** evita hardcodear dominio y no vuelve dinámicas las páginas (a diferencia de leer headers). Validada en `lib/env.ts` según convención del proyecto.
- **Alcance elegido por el usuario:** metadatos por página + sitemap + robots + Open Graph/Twitter.
- **`/go/` bloqueado en robots:** son redirecciones de afiliado; no deben indexarse ni rastrearse.
- **Sitemap dinámico desde la BD:** reutiliza capa de datos (`lib/products.ts`); nueva consulta ligera `getSitemapProducts()` (slug + `updatedAt`) solo de productos activos, sin paginar a 12.
- **Canónicas sin filtros:** evita contenido duplicado.

## Contexto
- **Tono (elegido: orientado a conversión):** textos más comerciales y atractivos, pero siempre veraces: sin falsas urgencias (“última oportunidad”), sin reseñas ni cifras inventadas, sin prometer resultados ni descuentos. Mencionar la divulgación de afiliados donde encaje en descripciones generales (p. ej. home) y que la compra ocurre en la plataforma del productor. Ver `specs/mission.md`.
- Idioma: español (`locale: es_LA`).
- **Next.js 16:** leer antes de codificar `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/` (`sitemap.md`, `robots.md`, `opengraph-image.md`) y `generateMetadata`.
- Patrón existente: `generateMetadata` ya existe en `app/productos/[slug]/page.tsx` (usa `connection()` y `truncate`); `/productos` exporta `metadata` estática.
- Páginas que acceden a la BD usan `await connection()`; el sitemap debe tolerar la BD no disponible en build (`export const dynamic = "force-dynamic"` o equivalente verificado en docs).
- Dependencias nuevas: ninguna.
