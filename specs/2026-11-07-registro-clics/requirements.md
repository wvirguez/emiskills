# Requisitos — Registro de clics (Fase 19)

## Alcance
**Incluye**
- Nuevo modelo Prisma `Click` + migración versionada.
- Registro de un clic en cada redirección exitosa de `/go/[slug]`.
- Función de capa de datos para registrar el clic y para obtener `{ id, affiliateUrl }` por slug.

**No incluye**
- Panel/métricas de clics (Fase 23), autenticación admin (Fase 20).
- Filtrado de bots o deduplicación, IP, cookies, hash de visitante.
- Política de retención automática (sin borrado en v1.0).
- Cambios en la UI visible.

### Modelo `Click` (tabla `clicks`)
| Campo | Tipo | Notas |
|---|---|---|
| id | Int, autoincrement | PK |
| productId | Int | FK → `products.id`; `@@index` |
| referer | String? `VarChar(500)` | Cabecera `Referer`, truncada a 500; `null` si falta |
| createdAt | DateTime `@default(now())` | `@@index` para consultas por fecha |

La relación inversa `clicks Click[]` se añade a `Product`.

## Decisiones
- **Datos mínimos** (productId, fecha, referer): bastan para las métricas de la misión (clics por producto/categoría/plataforma, vía join) sin datos personales.
- **`await` del insert antes de redirigir, sin bloquear fallos:** el registro es fiable en Node/Hostinger; si falla, se hace `console.error` (sin datos sensibles) y la redirección ocurre igual. El usuario nunca pierde la ida al producto por un fallo de métricas.
- **Solo redirecciones exitosas** (307) generan clic; 404 y errores no.
- **Sin datos personales:** no se guarda IP, user-agent ni cookies. El aviso de afiliados existente no cambia.
- Validación con Zod en el límite (`productId` entero positivo; `referer` string opcional truncado).

## Contexto
- Stack: Prisma 7 (adaptador MariaDB), cliente de `lib/db.ts`; migración con `npm run db:migrate`. Next.js 16: `params` asíncrono (ver docs en `node_modules/next/dist/docs/`).
- Seguir el patrón de `lib/products.ts` (DTO planos, Zod) y de `app/go/[slug]/route.ts`.
- Sin dependencias nuevas. Mensajes de error/logs en español, sin tono promocional.
- Tras migrar, usar el MySQL local definido en `DATABASE_URL`; no usar Docker.
