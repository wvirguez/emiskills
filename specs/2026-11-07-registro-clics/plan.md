# Plan — Registro de clics (Fase 19)

## 1. Base de datos
1.1 Añadir `model Click` a `prisma/schema.prisma` (`@@map("clicks")`, índices en `productId` y `createdAt`) y `clicks Click[]` en `Product`.
1.2 Crear la migración con `npm run db:migrate` (nombre `add_clicks`) y regenerar el cliente.
1.3 Reemplazar/ampliar `getAffiliateUrlBySlug` por `getAffiliateTargetBySlug(slug): Promise<{ id: number; affiliateUrl: string } | null>` (mismas reglas: Zod en slug, solo activos). Mantener `getAffiliateUrlBySlug` si algo más lo usa.
1.4 Crear `lib/clicks.ts` con `recordClick({ productId, referer }): Promise<void>`: valida con Zod, trunca `referer` a 500, `db.click.create`.
1.5 Tests: `lib/clicks.test.ts` (crea con datos válidos, trunca referer, `null` sin referer, rechaza productId inválido) y casos nuevos en `lib/products.test.ts`.

## 2. Componentes
2.1 Sin cambios de UI.

## 3. Página y ruta
3.1 En `app/go/[slug]/route.ts` usar `getAffiliateTargetBySlug`.
3.2 Tras validar el protocolo y antes de redirigir: `try { await recordClick({ productId, referer: request.headers.get("referer") }) } catch { console.error("[go] No se pudo registrar el clic", { slug }) }`.
3.3 Renombrar `_request` a `request`. Mantener 307 y cabeceras actuales.

## 4. Navegación
4.1 Sin cambios.

## 5. Pruebas
5.1 Ampliar `app/go/[slug]/route.test.ts` (mock de `lib/clicks`): éxito → `recordClick` llamado con `productId` y referer; 404/URL inválida → no se llama; fallo de `recordClick` → igual 307.
5.2 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.3 Marcar la Fase 19 como `[x]` en `specs/roadmap.md`.
