# Plan — Manejo de eventos del webhook de Hotmart (Fase 27)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones.
1.2 `lib/hotmart/webhook-events.ts`: `applyProductEvent(product, { db? })` que busca por `externalId` (`String(id)`) y aplica las reglas de `requirements.md`; devuelve `"updated" | "deactivated" | "unchanged" | "ignored:<motivo>"`.
1.3 Función pura `sanitizeTitle(name)` (trim, máx. 200, vacío → `undefined`).
1.4 Tests con `lib/db` simulado: actualiza título/ucode/syncedAt; desactiva si ≠ ACTIVE; no reactiva; no toca `affiliateUrl`/descripción/categoría/`needsReview`; vínculo ausente → ignora y no escribe; producto manual (sin `externalId`) no se toca; idempotencia; error de BD se propaga.

## 2. Componentes
2.1 `productEventSchema` (Zod, `looseObject`) y `dispatchHotmartEvent(payload)` que enruta `PRODUCT_UPDATE` a `applyProductEvent` y devuelve el resultado; el resto → `"ignored:evento_no_soportado"`.
2.2 Tests del despachador: `PRODUCT_UPDATE` válido/ inválido (sin id, id no numérico); `PURCHASE_APPROVED`, `SUBSCRIPTION_CANCELLATION` y desconocido no escriben.

## 3. Página y ruta
3.1 `lib/hotmart/webhook.ts`: tras validar el cuerpo, llamar a `dispatchHotmartEvent`; `try/catch` → `500 processing_failed` (log sin detalles sensibles); log de la acción.
3.2 Revalidar `/`, `/productos` y `/admin/productos` solo si el resultado fue `updated` o `deactivated`.
3.3 Actualizar `lib/hotmart/webhook.test.ts`: 200 con acción, 500 ante fallo de BD, revalidación solo con cambios, logs sin token ni datos de comprador.

## 4. Navegación
4.1 Sin rutas ni enlaces nuevos.
4.2 Actualizar `specs/tech-stack.md` (eventos manejados y reglas) y la sección de contrato de la Fase 26.

## 5. Pruebas
5.1 `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.2 Verificación manual con `curl` contra `npm run dev` y la BD local (casos de `validation.md`).
5.3 Marcar la Fase 27 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
