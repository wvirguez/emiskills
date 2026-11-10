# Validación — Manejo de eventos del webhook de Hotmart (Fase 27)

## Automatizado
- `npm test` pasa, incluyendo:
  - `PRODUCT_UPDATE` ACTIVE de producto vinculado: actualiza solo `title`, `externalUcode` y `syncedAt`.
  - `PRODUCT_UPDATE` con estado ≠ `ACTIVE`: `isActive=false`; nunca reactiva.
  - No se modifican `affiliateUrl`, `description`, `categoryId`, `needsReview`, `price` ni `currency`.
  - Producto sin vínculo / manual / sin `data.product.id`: no hay escrituras y responde 200.
  - `PURCHASE_APPROVED`, `PURCHASE_REFUNDED`, `SUBSCRIPTION_CANCELLATION` y eventos desconocidos: 200 sin escrituras.
  - Error de BD: respuesta 500 `processing_failed`, sin filtrar el mensaje original.
  - Misma petición dos veces: mismo resultado, sin duplicados.
  - Revalidación solo cuando hubo `updated`/`deactivated`.
  - Los logs no contienen el token ni datos del comprador.
  - Los casos 503/401/400 de la Fase 26 siguen pasando.
- `npm run lint` sin errores ni advertencias nuevas.
- `npx tsc --noEmit` sin errores y sin `any`.
- `npm run build` compila.

## Manual
Con `npm run dev`, `HOTMART_HOTTOK=test-token`, BD local con un producto sincronizado (`externalId` conocido) y otro manual:
- `PRODUCT_UPDATE` con `status: "ACTIVE"` y nuevo `name` → 200; el título cambia en `/admin/productos`; el resto del producto queda igual.
- `PRODUCT_UPDATE` con `status: "INACTIVE"` sobre un producto activo → 200; desaparece de `/productos/` y queda inactivo en el panel; repetir el evento no cambia nada.
- Evento de un `id` inexistente y de un producto manual → 200, sin cambios en la BD.
- `PURCHASE_APPROVED` → 200, sin cambios en la BD.
- Con la BD detenida o `DATABASE_URL` inválida → 500 (restaurar después).
- Sin token o con token malo → 401 (regresión de la Fase 26).
- Los clics históricos del producto desactivado siguen en `/admin/metricas`.
- Usar la URL con barra final (`/api/webhooks/hotmart/`).
- Contrastar la forma del payload con la documentación/sandbox de Hotmart y ajustar el esquema si difiere.

## Tono
Sin texto visible al visitante. Revisar que la documentación no prometa actualizaciones de precio ni creación automática de productos por webhook.

## Definición de "terminado"
- Checks automatizados y manuales pasan.
- Sin migraciones ni dependencias nuevas; ningún producto se borra, reactiva o crea desde el webhook.
- `specs/tech-stack.md` y `CHANGELOG.md` actualizados; Fase 27 marcada `[x]` en `specs/roadmap.md`.
- Punto abierto del payload de `PRODUCT_UPDATE` resuelto o documentado.
