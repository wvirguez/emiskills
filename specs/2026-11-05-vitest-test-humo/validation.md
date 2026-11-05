# Validación — Configurar Vitest y test de humo (Fase 4)

Todo debe cumplirse antes de fusionar.

## Checklist
- [ ] `npm test` termina con 1+ tests pasando y 0 fallos.
- [ ] `npm run test:watch` inicia Vitest en modo observación.
- [ ] El test de humo falla si se cambia el texto del `h1` de `Hero` (se probó y se revirtió).
- [ ] `npm run lint` termina con 0 errores y 0 warnings.
- [ ] `npx tsc --noEmit` termina sin errores.
- [ ] `npm run build` termina correctamente.
- [ ] No hay `any` en los archivos nuevos.
- [ ] El diff no altera componentes, textos ni estilos visibles.
- [ ] `README.md` documenta cómo ejecutar los tests.
- [ ] Fase 4 marcada `[x]` en `specs/roadmap.md` y `TODO.md` actualizado.
