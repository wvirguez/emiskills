# Plan — Configurar Vitest y test de humo (Fase 4)

## 1. Preparación
- [x] Confirmar rama `fase-04-vitest-smoke`.
- [x] Leer la guía de Vitest en `node_modules/next/dist/docs/`.
- [x] Línea base: `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## 2. Dependencias y configuración
- [x] `npm i -D vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/dom @testing-library/jest-dom`.
- [x] Crear `vitest.config.mts` (plugin React, entorno `jsdom`, alias `@/*`, `setupFiles`).
- [x] Crear `vitest.setup.ts` con `@testing-library/jest-dom/vitest`.
- [x] Añadir scripts `test` (`vitest run`) y `test:watch` (`vitest`) en `package.json`.

## 3. Test de humo
- [x] Crear `components/Hero.test.tsx`: renderiza `Hero` y comprueba el `h1` con el mensaje principal.
- [x] Ejecutar `npm test` y verlo pasar; romper el texto temporalmente para confirmar que falla.

## 4. Documentación
- [x] Añadir a `README.md` una sección "Pruebas" con `npm test` y `npm run test:watch`.

## 5. Validación y cierre
- [x] Ejecutar la checklist de `validation.md`.
- [x] Marcar Fase 4 como `[x]` en `specs/roadmap.md` y actualizar `TODO.md`.
