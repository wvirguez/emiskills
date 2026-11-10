# Informe — Fase 29: rendimiento, accesibilidad y seguridad

Medición: Lighthouse móvil (CLI vía `npx`, sin añadirlo al proyecto) sobre `next build && next start`, páginas `/`, `/productos/` y `/productos/desarrollo-java-fullstack/`.

## Puntuaciones (Rendimiento / Accesibilidad / Buenas prácticas / SEO)
| Página | Antes | Después |
|---|---|---|
| `/` | 82 / 95 / 100 / 100 | 92 / 100 / 100 / 100 |
| `/productos/` | 92 / 94 / 100 / 92 | 95 / 100 / 100 / 92* |
| `/productos/<slug>/` | 94 / 94 / 96 / 82 | 94 / 100 / 100 / 82* |

LCP 3.1–3.4 s antes y 2.9–3.2 s después (CLS 0, TBT 60–170 ms). Las diferencias de rendimiento entre corridas son ruido de medición; no se hicieron cambios de rendimiento. (*) El SEO de 92 y 82 se midió antes de cambiar el texto del enlace (H-9) y no se volvió a medir; en el detalle, además, pesa H-11. Las demás metas (A11y/BP ≥ 90, Rend. ≥ 80) se cumplen; SEO ≥ 90 se cumple en `/` y `/productos/`, y en el detalle falta por H-11.

## Hallazgos
| ID | Área | Severidad | Hallazgo | Estado |
|---|---|---|---|---|
| H-1 | Seguridad | **Alta** | `Link` a `/go/<slug>` hacía *prefetch*: cada vista de un detalle generaba una petición a la ruta de redirección y **registraba un clic falso** (y un error CORS en consola). | Corregido: `prefetch={false}` en `ProductDetail`. |
| H-2 | Seguridad | Baja | Faltaban cabeceras de seguridad. | Corregido: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, HSTS solo en producción (`next.config.ts`, con test). |
| H-3 | Seguridad | **Crítica** | `npm audit --omit=dev`: Next.js 16.2.12 tiene avisos críticos (RCE en `next/og` `ImageResponse`, que usa `app/opengraph-image.tsx`; RCE/SSRF en optimización de imágenes —no usada, `images.unoptimized`—; DoS con Server Actions; envenenamiento de caché SSG/ISR). Dependencias `sharp` y `postcss` también marcadas. Corrección: `next@16.4.6`. | **Corregido (aprobado por el usuario):** `next` y `eslint-config-next` fijados a 16.4.6; `npm audit --omit=dev` → 0 vulnerabilidades (también `sharp` y `postcss`). Tests, lint, tsc y build pasan. |
| H-4 | Seguridad | Info | Sesión (`httpOnly`, `sameSite=lax`, `secure` en prod), rate limit del login, `verifySession` en todas las Server Actions del admin, hottok en tiempo constante, `/go/` solo redirige a http(s) guardado en BD, enlace externo con `rel="sponsored nofollow noopener noreferrer"`. | Sin hallazgos. |
| H-5 | Seguridad | Baja | Login: el email se compara sin tiempo constante y se responde antes de calcular scrypt si el email no coincide (permite inferir el email admin por tiempo). Rate limit en memoria (se reinicia con el proceso). | Pospuesto (riesgo bajo; un solo admin). |
| H-6 | Seguridad | Media | Sin CSP: requiere nonces por petición vía `proxy.ts` y render dinámico. | Pospuesto, documentado. |
| H-7 | Accesibilidad | Media | Contraste insuficiente (3.66:1) del texto `gray-500` sobre fondo oscuro en el footer. | Corregido: `gray-400`. |
| H-8 | Accesibilidad | Media | Orden de encabezados inválido (h3 sin h2 previo en Benefits, Footer y resultados del catálogo). | Corregido: Benefits/Footer → h2; `h2` oculto «Resultados» en `SearchResults`. |
| H-9 | Accesibilidad | Baja | Enlace «Más información» sin texto descriptivo. | Corregido: «Más información sobre afiliados». |
| H-10 | Accesibilidad | Baja | Sin enlace «Saltar al contenido». | Corregido: visible solo con foco; `main#contenido`. |
| H-11 | SEO/Rendimiento | Baja | En el detalle (render dinámico) Next emite `<meta name="description">` en el `<body>` (metadatos en streaming), por lo que Lighthouse lo marca ausente. Los rastreadores conocidos reciben metadatos bloqueantes en `<head>`. | Pospuesto: verificar con Search Console tras el despliegue. |
| H-12 | Rendimiento | Info | LCP ≈ 3 s en móvil simulado; sin pérdidas de CLS. `images.unoptimized` se mantiene por el despliegue en Hostinger. | Sin cambios. |
| H-13 | Higiene | Info | `.env.example` (ignorado por git, nunca commiteado) contenía valores reales copiados de `.env`. | Corregido: reemplazado por placeholders. (Corrección a la nota previa: no estaba versionado.) Se recomienda igualmente rotar credenciales si el archivo se compartió fuera de la máquina. |
| H-14 | Higiene | Info | Test de integración `prisma/seed.test.ts` fallaba con datos extra en la BD local y reescribía productos del seed. | Corregido antes de esta fase. |

## Fases propuestas (pendientes de aprobación)
- CSP con nonces + endurecimiento de login (H-5, H-6).
