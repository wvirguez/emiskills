# Plan — Métricas de clics en el panel (Fase 23)

## 1. Base de datos / capa de datos
1.1 Sin cambios en Prisma ni migraciones.
1.2 `lib/click-metrics.ts` (`server-only`):
  - `rangeSchema` (Zod: `"7d" | "30d" | "todo"`, por defecto `"30d"`) y `parseRange(value)` tolerante a valores inválidos/arreglos.
  - `getRangeStart(range, now)` → `Date | null` (UTC, incluye el día actual).
  - `getClickTotals(range)` → total.
  - `getClicksByProduct(range)` → `{ id, name, categoryName, clicks }[]` incluyendo productos con 0.
  - `getClicksByCategory(range)` → `{ id, name, clicks }[]` con 0 incluidos.
  - `getClicksByDay(range)` → `{ date, clicks }[]` (agrupado por día UTC; relleno de ceros en rangos acotados).
1.3 Tests con `lib/db` mockeado, estilo de `lib/clicks.test.ts`: rango por defecto, inválido, límites de fechas, orden, ceros, relleno de días.

## 2. Componentes
2.1 `range-selector.tsx` (Server Component): enlaces "7 días / 30 días / Todo" con `aria-current` en el activo.
2.2 `metrics-tables.tsx` (Server Component): tabla por producto, por categoría y lista por día con barra CSS proporcional (`role="img"`/`aria-label` o texto del número visible).
2.3 Tests de Testing Library: selector marca el activo, estado vacío, filas y porcentajes, barra proporcional.

## 3. Página y ruta
3.1 `app/admin/(panel)/metricas/page.tsx`: `await verifySession()`, `searchParams` (Promise) → `parseRange` → consultas en paralelo (`Promise.all`) → resumen + selector + tablas; nota "Un clic no equivale a una venta" y "fechas en UTC".
3.2 Layout responsive (tablas en `md+`, tarjetas apiladas en móvil).
3.3 Test de la página: render con datos, estado vacío, rango inválido → 30d, sin sesión no consulta datos.

## 4. Navegación
4.1 Tarjeta "Métricas" de `app/admin/(panel)/page.tsx`: de "Próximamente" a enlace a `/admin/metricas`; actualizar su test.
4.2 Enlace "← Volver al panel" en la página de métricas. Sin enlace público.

## 5. Pruebas
5.1 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.2 Verificación manual con datos reales (`/go/[slug]` genera clics).
5.3 Marcar la Fase 23 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
