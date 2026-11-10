# Requisitos — Métricas de clics en el panel (Fase 23)

## Alcance

### Incluye
- Página `/admin/metricas` (protegida por la sesión admin, dentro del grupo `(panel)`).
- Selector de rango por URL: `?rango=7d | 30d | todo` (por defecto `30d`).
- Cuatro bloques de datos, todos calculados en el servidor con Prisma:

| Bloque | Datos | Orden |
|---|---|---|
| Resumen | Total de clics del rango | — |
| Por producto | Nombre, categoría, clics | Clics desc., luego nombre |
| Por categoría | Nombre, clics, % del total | Clics desc., luego nombre |
| Por día | Fecha (`AAAA-MM-DD`), clics, barra proporcional | Fecha desc. |

- Productos sin clics en el rango aparecen con 0 en la tabla por producto (permite detectar productos sin tracción).
- Estado vacío claro cuando no hay clics en el rango.
- Tarjeta "Métricas" del dashboard pasa de "Próximamente" a enlace a `/admin/metricas`.

### No incluye
- Gráficos con librerías, exportación CSV, comparación entre periodos.
- Métricas por plataforma de origen, por `referer` ni ventas/comisiones.
- Cambios en el esquema Prisma ni migraciones (se usa la tabla `clicks` existente).
- Detección de bots ni deduplicación de clics.

## Decisiones
- **Consulta en servidor + filtro por URL** (Server Component, `searchParams` como `Promise` en esta versión de Next): sin JS de cliente, enlazable y sin dependencias nuevas.
- **Sin librerías de gráficos:** tablas y barras CSS con Tailwind, estilo del panel actual.
- **Validación del rango con Zod** (lista cerrada); un valor inválido cae al valor por defecto, no da error.
- **Agrupación por día en UTC** (`DATE(createdAt)`), documentado en la UI como "fechas en UTC". Los rangos `7d`/`30d` cuentan desde hoy 00:00 UTC menos N-1 días (incluye el día actual).
- Los días sin clics dentro de un rango acotado se rellenan con 0 para que la serie sea continua; en `todo` solo se muestran días con clics.
- Agregados con `groupBy`/`$queryRaw` parametrizado; prohibido interpolar entrada del usuario en SQL.

## Contexto
- **Pila:** `lib/clicks.ts` (capa de datos, se amplía), `lib/db.ts`, patrón de páginas de `app/admin/(panel)/categorias/page.tsx`; `verifySession()` en la página además del layout.
- **Responsive:** tablas en escritorio, tarjetas/listas apiladas en móvil, como en categorías y productos.
- **Tono:** objetivo y sin adornos; los clics son clics salientes, no ventas. Texto aclaratorio: "Un clic no equivale a una venta."
- **UI solo en español.** Fechas formateadas en `es`.
- **Dependencias:** ninguna nueva.
