# Plan — Sincronización de productos Hotmart (Fase 25)

## 1. Base de datos
1.1 `prisma/schema.prisma`: añadir a `Product` `externalId` (único), `externalUcode`, `needsReview` (default `false`), `syncedAt`.
1.2 `npm run db:migrate` (nombre `add_hotmart_sync_fields`); verificar la migración generada y `npm run db:generate`.
1.3 `lib/hotmart/sync-mapping.ts` (puro, con tests): `pickMainOffer(offers)`, `mapFormatToCategorySlug(format, isSubscription)`, `buildSlug(name, externalId, exists)`, `isSupportedCurrency`.
1.4 `lib/hotmart/sync.ts` (`server-only`): `syncHotmartProducts({ client?, db? })` con las reglas de `requirements.md`:
  - lee **toda** la lista antes de escribir; si falla, lanza sin modificar la BD;
  - upsert de plataforma `hotmart` y de la categoría `sin-categoria`;
  - crear / actualizar / desactivar / omitir por producto en `try/catch`;
  - candado en memoria (`SyncInProgressError`);
  - devuelve el resumen tipado `SyncResult`.
1.5 Tests con `lib/db` y el cliente simulados: crea inactivo con `needsReview`; no pisa descripción/imagen/categoría/`affiliateUrl`/`isActive`; desactiva ausentes y no‑ACTIVE; no reactiva; omite sin oferta o con moneda no soportada; colisión de slug; no toca productos manuales; lista incompleta → no desactiva nada; idempotencia; candado.

## 2. Componentes
2.1 `app/admin/(panel)/productos/sync-hotmart-button.tsx` (`"use client"`, `useActionState`): botón con estado `pending`, resumen (creados, actualizados, desactivados, omitidos con motivo, errores) en `role="status"`/`role="alert"`, aviso "El enlace sincronizado es el del productor: añade tu enlace de afiliado antes de activar".
2.2 Insignias "Hotmart" y "Revisar enlace" en la lista de productos (tabla y tarjetas móviles).
2.3 `toggle-active-button.tsx`: deshabilitado con texto explicativo si `needsReview`.
2.4 Tests de Testing Library para 2.1–2.3.

## 3. Página y ruta
3.1 `app/admin/(panel)/productos/sync-action.ts` (`"use server"`): `syncHotmartAction()` → `verifySession()` primero (sin sesión → `redirect('/admin/login')`) → `syncHotmartProducts()` → `revalidatePath('/')`, `/productos`, `/admin/productos` → devuelve el resumen; errores de Hotmart/entorno mapeados a mensajes en español.
3.2 `lib/admin-products.ts`: exponer `needsReview` y `externalId` en lista/detalle; `setProductActive` rechaza activar si `needsReview`; `updateProduct` pone `needsReview=false` si el `affiliateUrl` cambia respecto al guardado.
3.3 `app/admin/(panel)/productos/page.tsx`: incluir el botón y las insignias; `[id]/page.tsx`: aviso si `needsReview`.
3.4 `scripts/hotmart-sync.ts` + `"hotmart:sync": "tsx --conditions=react-server scripts/hotmart-sync.ts"`: ejecuta la sync, imprime el resumen, sale con código ≠ 0 ante error.
3.5 Tests: acción (sin sesión no toca nada, éxito revalida, errores), `setProductActive`/`updateProduct`, formateo del resumen del script.

## 4. Navegación
4.1 Sin rutas nuevas; el botón vive en `/admin/productos`.
4.2 Documentar en `specs/tech-stack.md` el flujo de sincronización y `npm run hotmart:sync`.

## 5. Pruebas
5.1 `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.2 Verificación manual contra sandbox (y revisar el punto abierto del endpoint de productos).
5.3 Marcar la Fase 25 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
