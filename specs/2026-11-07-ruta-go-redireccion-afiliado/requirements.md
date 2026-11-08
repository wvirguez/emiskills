# Requisitos — Ruta `/go/[slug]` de redirección de afiliado (Fase 18)

## Alcance
**Incluye**
- Route Handler `GET /go/[slug]` (`app/go/[slug]/route.ts`) que busca el producto **activo** por `slug` y responde con redirección **307** a su `affiliateUrl`.
- Función de datos `getAffiliateUrlBySlug(slug)` en `lib/products.ts` (server-only): devuelve `string | null`. `affiliateUrl` **no** se añade a `ProductDTO` (no viaja a componentes ni al cliente).
- Validación con Zod: `slug` (1–150 caracteres) y `affiliateUrl` con protocolo `http:` o `https:` únicamente.
- Cabecera `X-Robots-Tag: noindex, nofollow` en la respuesta de redirección.
- Slug inexistente, producto inactivo o URL inválida → **404** genérico, sin revelar el motivo.
- Los CTAs "comprar" apuntan a `/go/[slug]` con `rel="sponsored nofollow"`. `ProductDetail` ya lo hace; se revisa que `ProductCard`/`ProductCardCompact` no enlacen directamente a la URL del productor y que el CTA de detalle abra con `target="_blank"` y `rel="sponsored nofollow noopener noreferrer"`.

**No incluye**
- Registro de clics (tabla `Click`): Fase 19.
- Parámetros de afiliado/UTM añadidos a la URL: se redirige a `affiliateUrl` tal cual está en la base de datos.
- Página intermedia de redirección.
- Panel admin ni edición de enlaces (Fases 20–22).

## Datos
| Campo | Origen | Regla |
|---|---|---|
| `slug` | segmento de ruta | string 1–150, Zod |
| `affiliateUrl` | `Product.affiliateUrl` (VarChar 500) | `new URL()` válido y protocolo http/https |
| `isActive` | `Product.isActive` | solo `true` redirige |

## Decisiones
- **Route Handler GET con redirección directa** (elegido): sin pasos intermedios, rápido en móvil.
- **307 temporal**: los navegadores no cachean la redirección, así la Fase 19 podrá contar cada clic y un cambio de enlace surte efecto de inmediato.
- **404 genérico**: no se redirige a `/productos`, para no ocultar enlaces rotos.
- **Validar la URL** antes de redirigir: evita `javascript:` u otros protocolos si un dato de la base fuera erróneo.
- **`noindex`**: `/go/*` no debe indexarse (coherente con los enlaces `sponsored`). Se recomienda también `Disallow: /go/` en `robots` en la Fase 28.

## Contexto
- Next.js 16: antes de codificar, leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` (firma de `params` asíncrono, `NextResponse.redirect`/`Response.redirect`, comportamiento de caché de GET).
- El handler es dinámico (lee de la base de datos): no debe quedar cacheado estáticamente.
- Cliente de BD: singleton `lib/db.ts`. Sin dependencias nuevas.
- Interfaz solo en español; el 404 usa mensajes sobrios, sin urgencia. Respeta el principio 4 de `mission.md` (enlaces de afiliado transparentes: el aviso de afiliado sigue visible junto al CTA).
