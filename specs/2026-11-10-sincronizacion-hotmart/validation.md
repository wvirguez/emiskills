# Validación — Sincronización de productos Hotmart (Fase 25)

## Automatizado
- `npm test` pasa, con aserciones específicas:
  - **Mapeo:** `ONLINE_COURSE→curso`, `EBOOK→ebook`, `TEMPLATES→plantilla`, `COMMUNITY` y `is_subscription=true`→`membresia`, otro formato→`sin-categoria`; `pickMainOffer` prefiere `isMain` y cae a la primera; slug con colisión añade `-<id>`.
  - **Crear:** producto nuevo `ACTIVE` en Hotmart se inserta con `isActive=false`, `needsReview=true`, plataforma `hotmart`, `externalId`/`externalUcode` y `affiliateUrl` = enlace de oferta.
  - **Actualizar:** un producto vinculado cambia solo `title`, `price`, `currency`, `externalUcode` y `syncedAt`; `shortDescription`, `description`, `imageUrl`, `categoryId`, `language`, `affiliateUrl`, `slug` e `isActive` quedan intactos.
  - **Desactivar:** vinculado ausente de la lista o con estado ≠ `ACTIVE` → `isActive=false`; un producto desactivado que vuelve a `ACTIVE` en Hotmart **no** se reactiva.
  - **Omitir:** sin ofertas o con moneda fuera de `CURRENCIES` → aparece en `skipped` con motivo y no se escribe nada.
  - **Aislamiento:** productos manuales (sin `externalId`) nunca se leen ni se modifican.
  - **Seguridad ante fallos:** si Hotmart falla (auth, 429 agotado, red) antes de terminar de leer la lista, no se escribe ni desactiva nada; si falla un solo producto, los demás se procesan y el error queda en `errors`.
  - **Idempotencia:** dos corridas consecutivas con los mismos datos → la segunda reporta `created=0`, `deactivated=0`.
  - **Candado:** una segunda sync concurrente lanza `SyncInProgressError`.
  - **Acción:** sin sesión → redirige a `/admin/login` y no llama al servicio; con sesión → llama a `syncHotmartProducts` y revalida `/`, `/productos`, `/admin/productos`.
  - **Admin:** `setProductActive(id, true)` falla si `needsReview`; `updateProduct` con `affiliateUrl` distinto pone `needsReview=false`, con el mismo no lo cambia.
  - **UI:** el botón muestra estado pendiente y el resumen; las insignias "Hotmart" y "Revisar enlace" aparecen según los datos; el toggle está deshabilitado con `needsReview`.
- `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores ni `any`.
- La migración se aplica con `npx prisma migrate deploy` en una BD limpia y los productos existentes quedan con `externalId = NULL`, `needsReview = false`.
- Sin dependencias nuevas en `package.json` (solo el script `hotmart:sync`).

## Manual
- Sin credenciales Hotmart: el botón y el script muestran un mensaje claro en español y no cambian la BD.
- Con credenciales sandbox: ejecutar `npm run hotmart:sync`; en `/admin/productos` aparecen los productos nuevos inactivos con "Hotmart" y "Revisar enlace"; el sitio público **no** los muestra.
- Intentar activar uno con "Revisar enlace": bloqueado con explicación. Editarlo, poner un enlace de afiliado distinto y guardar: desaparece la insignia y ya se puede activar.
- Editar descripción, imagen y categoría de uno sincronizado, volver a sincronizar: esas ediciones se conservan.
- Cambiar el nombre/precio en el sandbox (o simular) y re-sincronizar: título y precio se actualizan.
- Repetir la sync: resumen sin cambios (idempotente). Doble clic rápido en el botón: no se ejecutan dos sincronizaciones.
- Productos manuales y sus clics siguen intactos tras la sync.
- Revisar la salida de consola y la UI: no hay secretos ni tokens.
- Confirmar el punto abierto: que `GET /products` devuelve lo esperado para esta cuenta; si no, documentar el ajuste antes de cerrar la fase.

## Verificación del tono
- Textos del admin en español, objetivos; el aviso deja claro que el enlace sincronizado no es de afiliado. Ningún texto nuevo visible al visitante.

## Definición de "terminado"
- Todo lo automatizado en verde y la verificación manual hecha (o lo pendiente por falta de credenciales, documentado).
- Migración versionada incluida; sin secretos en el repositorio.
- Fase 25 marcada `[x]` en `specs/roadmap.md`, `specs/tech-stack.md` y `CHANGELOG.md` actualizados.
