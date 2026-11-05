# Plan — Limpieza y auditoría del código (Fase 3)

## 1. Preparación
- [x] Confirmar rama `fase-03-limpieza-auditoria`.
- [x] Registrar línea base: `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## 2. Dependencias
- [x] `npm uninstall react-icon` y confirmar que `package-lock.json` queda coherente.
- [x] Revisar que no haya otras dependencias sin uso.

## 3. Lint
- [x] Quitar el import `Link` sin usar en `components/SearchCourses.tsx`.
- [x] `npm run lint` con 0 errores y 0 warnings.

## 4. Auditoría de código
- [x] Listar componentes no importados desde `app/page.tsx` (`PopularCourses`, `OnlineLearning`, …) y anotarlos en `requirements.md` como hallazgo; **no borrarlos**.
- [x] Buscar `any`, imágenes sin `alt` y elementos interactivos sin etiqueta accesible.
- [x] Revisar metadatos en `app/layout.tsx` (título, descripción, `lang="es"`).

## 5. Validación y cierre
- [x] Ejecutar la checklist de `validation.md`.
- [x] Marcar Fase 3 como `[x]` en `specs/roadmap.md` y actualizar `TODO.md`.
