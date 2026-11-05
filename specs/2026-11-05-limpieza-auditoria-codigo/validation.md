# Validación — Limpieza y auditoría del código (Fase 3)

Todo debe cumplirse antes de fusionar.

## Checklist
- [x] `npm run lint` termina con 0 errores y 0 warnings.
- [x] `npx tsc --noEmit` termina sin errores.
- [x] `npm run build` termina correctamente.
- [x] `react-icon` ya no aparece en `package.json` ni en `package-lock.json`; `react-icons` sigue instalada.
- [x] No hay `any` en `app/`, `components/` ni `data/`.
- [x] La lista de componentes sin uso está documentada y ninguno fue borrado.
- [x] El diff no altera textos ni estilos visibles (solo imports, dependencias y ajustes de accesibilidad).
- [x] Fase 3 marcada `[x]` en `specs/roadmap.md` y `TODO.md` actualizado.
