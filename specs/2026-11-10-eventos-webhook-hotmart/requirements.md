# Requisitos — Manejo de eventos del webhook de Hotmart (Fase 27)

## Alcance

### Incluido
- Despachador de eventos en `lib/hotmart/webhook-events.ts` (`server-only`), invocado por `handleHotmartWebhook` (Fase 26) **después** de verificar el hottok y validar el cuerpo.
- **Solo eventos de producto modifican la BD.** Cualquier otro evento (compras, reembolsos, suscripciones, desconocidos) se acepta y se ignora con log.
- Esquema Zod del payload de producto (`data.product`: `id`, `ucode?`, `name?`, `status?`), tolerante a campos extra.
- Sin migración, sin tabla nueva, sin dependencias nuevas.

### Eventos y acciones
| Evento | Acción |
|---|---|
| `PRODUCT_UPDATE` con producto vinculado (`externalId` = `data.product.id`) y estado `ACTIVE` | Actualiza solo `title` (si viene `name`), `externalUcode` (si viene `ucode`) y `syncedAt` |
| `PRODUCT_UPDATE` con producto vinculado y estado ≠ `ACTIVE` | Desactiva (`isActive=false`, `syncedAt`); si además viene `name`, lo actualiza |
| Producto sin vínculo en BD (incluye manuales) | Ignora con log; **no crea** productos (eso es la sincronización manual) |
| `data.product.id` ausente o inválido | Ignora con log (200) |
| Resto de eventos (`PURCHASE_*`, `SUBSCRIPTION_*`, desconocidos) | Ignora con log (200) |

`price` y `currency` **no** se tocan desde el webhook: el evento de producto no trae ofertas y la fuente es la sincronización (Fase 25).

### Contrato de respuesta (añade a la Fase 26)
| Situación | Respuesta |
|---|---|
| Evento procesado o ignorado | `200 { "received": true }` |
| Fallo de la BD al procesar | `500 { "error": "processing_failed" }` (Hotmart reintenta) |

Los 503/401/400 de la Fase 26 no cambian.

## Decisiones
- **Solo eventos de producto:** un reembolso o una compra no implican que el producto deje de venderse; desactivar por ellos sería incorrecto.
- **Reglas de la sincronización (Fase 25), sin tabla nueva:** nunca reactiva, nunca borra, nunca toca `description`, imagen, categoría, idioma, `affiliateUrl`, `needsReview` ni `isActive` (salvo la desactivación), y nunca toca productos manuales. Es idempotente por naturaleza: repetir el mismo evento no cambia nada más que `syncedAt`.
- **Sin deduplicación ni orden por fecha:** descartado por alcance; los reintentos son inocuos por idempotencia. Riesgo asumido: un evento viejo reentregado tarde podría revertir un título; la sincronización manual lo corrige.
- **Producto desconocido → ignorar:** los productos entran al catálogo de forma controlada (inactivos + "Revisar enlace"), no por una petición externa.
- **500 solo ante error de BD:** para que Hotmart reintente; el cuerpo del error no filtra detalles.
- **Título saneado:** `trim`, máximo 200 caracteres (columna `VarChar(200)`); si queda vacío, no se actualiza.

## Contexto
- Reutilizar `lib/db.ts`; extraer o compartir con `lib/hotmart/sync.ts` la lógica de actualización si evita duplicación, sin cambiar el comportamiento de la sync.
- Tras cambios reales, `revalidatePath('/')`, `/productos` y `/admin/productos` (el webhook corre en un Route Handler; revisar `node_modules/next/dist/docs/01-app/` sobre `revalidatePath` en Route Handlers).
- Logs: solo tipo de evento, id del evento, id de producto y acción (`updated`, `deactivated`, `ignored:<motivo>`); sin datos del comprador ni el token.
- **Punto abierto:** la forma exacta del payload de `PRODUCT_UPDATE` debe confirmarse con un evento real o la documentación de Hotmart (sandbox); el esquema es tolerante y falla cerrado (ignora) si no coincide. Ajustar en la verificación manual.
- Sin texto visible al visitante; tono de logs y documentación sobrio y objetivo.
