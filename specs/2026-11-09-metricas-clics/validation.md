# Validación — Métricas de clics en el panel (Fase 23)

## Automatizado
- `npm test` pasa, con aserciones específicas:
  - `parseRange` devuelve `30d` ante `undefined`, `""`, `"xyz"` y arreglos; acepta `7d`, `30d`, `todo`.
  - `getRangeStart("7d", now)` = 00:00 UTC de hace 6 días; `todo` → `null`.
  - Consultas filtran por `createdAt >= inicio` solo cuando hay rango; ninguna entrada del usuario se interpola en SQL.
  - Por producto/categoría: orden clics desc. y desempate por nombre; entradas con 0 presentes.
  - Por día: relleno de ceros en `7d`/`30d` (7 y 30 filas), solo días con clics en `todo`.
  - Selector: `aria-current="page"` en el rango activo.
  - Página: sin clics → mensaje de estado vacío; datos → total, filas y porcentajes correctos.
  - Tarjeta "Métricas" del dashboard es un enlace a `/admin/metricas`.
- `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores ni `any`.

## Manual
- Sin sesión, `/admin/metricas` redirige a `/admin/login`.
- Generar clics visitando `/go/<slug>` de varios productos; comprobar que los totales por producto, categoría y día coinciden con la base de datos.
- Cambiar entre 7 días / 30 días / Todo: la URL cambia (`?rango=`), los totales se actualizan y el activo se resalta.
- `?rango=basura` muestra 30 días sin error.
- Base sin clics: se ve el estado vacío, sin tablas rotas ni NaN en porcentajes.
- Móvil (≈375 px): sin scroll horizontal de página; tablas legibles como tarjetas.
- Un clic registrado cerca de medianoche UTC aparece en el día UTC correcto.

## Verificación del tono
- Texto objetivo, en español, sin lenguaje triunfalista; aclara que un clic no es una venta y que las fechas son UTC.

## Definición de "terminado"
- Todo lo automatizado en verde, la verificación manual hecha, sin dependencias nuevas ni migraciones.
- Fase 23 marcada `[x]` en `specs/roadmap.md` y `CHANGELOG.md` actualizado.
