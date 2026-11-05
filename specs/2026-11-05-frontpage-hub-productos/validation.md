# Validación — FrontPage como hub de productos digitales

La fase se puede fusionar cuando **todo** lo siguiente se cumple.

## Automático
- [ ] `npm run lint` sin errores ni warnings nuevos.
- [ ] `npx tsc --noEmit` sin errores.
- [ ] `npm run build` termina correctamente.

## Manual en `http://localhost:3000/` (`npm run dev`)
- [ ] La página carga en la raíz, sin `/demo1`.
- [ ] Hero: el mensaje de la izquierda se conserva; la imagen derecha **no** cambió (Fase 2).
- [ ] Orden de secciones: Hero → plataformas → categorías → búsqueda → destacados → cómo funciona → aviso → CTA final.
- [ ] Todo el texto es de "productos digitales"; no quedan las palabras "estudiantes", "clientes felices" ni "líderes del sector".
- [ ] No quedan cifras inventadas (1000+, 120+, valoraciones) ni logos de Apple/Microsoft.
- [ ] `grep -rniE "1000\+|120\+|estudiantes|clientes felices|Apple|Microsoft" components app data` no devuelve coincidencias indebidas.
- [ ] Los productos de ejemplo vienen de `data/sample-products.ts` y se indica que son ejemplos.
- [ ] El aviso de afiliados es visible en la landing y en el footer.
- [ ] Todos los enlaces de Navbar y Footer llevan a una sección existente (o se retiraron); ninguno apunta a una ancla inexistente.

## Responsive
- [ ] Sin scroll horizontal a 360 px, 768 px y 1280 px.
- [ ] Menú móvil funciona y los botones son tocables (≥ 44 px).
- [ ] Tarjetas y secciones se reacomodan correctamente en móvil.

## Calidad
- [ ] Sin nuevas dependencias en `package.json`.
- [ ] Sin `any` en TypeScript.
- [ ] Contraste de texto legible (AA) en secciones con fondo degradado.
- [ ] Consola del navegador sin errores.

## Cierre
- [ ] Fase 1 marcada como completada en `specs/roadmap.md`.
