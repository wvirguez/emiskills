# Validación — Eliminar sección Partners (Fase 13)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `grep -r "Partners" app components lib` no devuelve resultados.
- `app/page.test.tsx` afirma que la landing no contiene "Plataformas de origen de los productos" ni "Otros productores" como sección propia, y que las demás secciones se renderizan.
- `components/Footer.test.tsx` afirma que el Footer muestra "Hotmart y de otros productores" y conserva los cuatro enlaces `/#...`.

## Manual
Con `npm run build && npm start`:
- Home: tras el Hero aparece directamente Categorías; no queda hueco ni franja violeta suelta.
- La transición de fondo Hero → Categorías se ve limpia en escritorio y móvil.
- Navbar y Footer: los enlaces a `#productos`, `#categorias`, `#buscar` y `#como-funciona` siguen llevando a su sección.
- Footer (en landing y en `/productos`): se ve la línea sobre Hotmart y otros productores, sin desbordes a ~375 px.
- Sin errores en la consola del navegador.

## Verificación del tono
- La frase del Footer es objetiva; no promete exclusividad ni calidad garantizada.

## Definición de "terminado"
- `Partners.tsx` eliminado y sin referencias; landing sin esa sección.
- Footer informa el origen de los productos.
- Sin `any`, sin dependencias nuevas.
- Comprobaciones automatizadas y manuales pasan.
- Fase 13 marcada `[x]` en `specs/roadmap.md`.
