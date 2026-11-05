# Requisitos — Limpieza y auditoría del código (Fase 3)

## Alcance
- Dependencias: eliminar `react-icon` (duplicada; el código usa `react-icons`) y revisar el resto.
- Lint: dejar `npm run lint` sin errores ni warnings (hoy: `Link` sin usar en `components/SearchCourses.tsx`).
- Código muerto: identificar componentes no usados en `app/page.tsx`. Hallazgo inicial: `PopularCourses.tsx` y `OnlineLearning.tsx` no se importan en ningún sitio.
- Tipos y accesibilidad básica: `npx tsc --noEmit` limpio, sin `any`, revisar `alt`/`aria` y metadatos de `app/layout.tsx`.

## Hallazgos — Componentes no utilizados (eliminados)

| Componente | Ruta | Motivo |
|------------|------|--------|
| `PopularCourses` | `components/PopularCourses.tsx` | Reemplazado por `FeaturedProducts` en `app/page.tsx`; no se importa en ningún archivo. **Eliminado**. |
| `OnlineLearning` | `components/OnlineLearning.tsx` | No se importa en ningún archivo de la app. **Eliminado**. |

## Decisiones
- Componentes sin uso: **solo reportar**, no borrar. Se documenta la lista en esta carpeta y el usuario decide después.
- Sin cambios de comportamiento ni de estilo visible (misión: mantener el estilo actual).
- Leer `node_modules/next/dist/docs/` antes de tocar código de Next.js (AGENTS.md).

## Fuera de alcance
- Vitest (Fase 4), base de datos (Fases 5–6), nuevas funcionalidades.
- Verificación visual responsive formal (no exigida para esta fase).

## Contexto
- Rama: `fase-03-limpieza-auditoria`.
- Referencias: `specs/mission.md`, `specs/tech-stack.md` (TypeScript estricto, sin `any`).
