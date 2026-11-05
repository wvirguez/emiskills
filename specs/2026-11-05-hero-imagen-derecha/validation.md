# Validación — Hero: nueva imagen derecha (Fase 2)

La fase se puede fusionar cuando **todo** lo siguiente se cumple.

## Automático
- [x] `npm run lint` sin errores ni warnings nuevos.
- [x] `npm run build` termina correctamente.

## Manual en `http://localhost:3000/` (`npm run dev`)
- [x] El avatar placeholder ya no aparece; se ve la ilustración de productos digitales.
- [x] El texto, título y botones de la izquierda están idénticos a antes.
- [x] Los badges flotantes siguen visibles y no tapan elementos clave de la ilustración.
- [x] Sin cifras, logos de marcas ni reseñas inventadas en la imagen.

## Responsive
- [x] Sin scroll horizontal a 360 px, 768 px y 1280 px.
- [x] La ilustración escala correctamente en móvil y escritorio.

## Calidad
- [x] Sin nuevas dependencias en `package.json`.
- [x] Sin `any` en TypeScript.
- [x] Ilustración con `aria-hidden="true"`.
- [x] Consola del navegador sin errores.
- [x] Fase 2 marcada `[x]` en `specs/roadmap.md`.
