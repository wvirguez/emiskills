# Validación — CTAs del Hero (Fase 12)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `components/Hero.test.tsx` afirma que:
  - existe un enlace con nombre "COMPRAR AHORA" y `href="/productos"`;
  - existe un enlace con nombre "VER CATEGORÍAS" y `href="/#categorias"`;
  - no aparecen "Obten una Propuesta" ni "Intentalo Ahora!";
  - el h1 conserva el mensaje original.
- `components/Footer.test.tsx` afirma que los enlaces Productos, Categorías, Buscar y Cómo funciona tienen `href` que empieza por `/#`.
- `components/FinalCTA.test.tsx` afirma que "Ver productos" apunta a `/productos`.

## Manual
Con `npm run build && npm start`:
- Home: "COMPRAR AHORA" lleva a `/productos` con el catálogo completo.
- Home: "VER CATEGORÍAS" baja a la sección Categorías (`/#categorias`).
- Desde `/productos` y una ficha de producto, los enlaces del Footer regresan a la landing y a la sección correcta.
- "Ver productos" del bloque final lleva a `/productos`.
- Navbar (escritorio y menú móvil) sigue funcionando igual.
- Móvil (~375 px): botones apilados, texto sin desbordar, área táctil cómoda.
- Teclado: foco visible en ambos botones.

## Verificación del tono
- Los textos son exactamente "COMPRAR AHORA" y "VER CATEGORÍAS".
- No se añadieron frases de urgencia, descuentos ni promesas; el aviso de afiliados sigue visible en la página.

## Definición de "terminado"
- Hero con los nuevos textos y enlaces; Footer y FinalCTA coherentes.
- Sin `any`, sin dependencias nuevas y sin `"use client"`.
- Comprobaciones automatizadas y manuales pasan.
- Fase 12 marcada `[x]` en `specs/roadmap.md`.
