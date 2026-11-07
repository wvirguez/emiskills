# Validación — Botón "Inicio" en la barra de navegación (Fase 14)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `components/Navbar.test.tsx` afirma que:
  - el primer enlace de la navegación es "Inicio" con `href="/"`, y el menú móvil también lo incluye;
  - con `usePathname() === "/"` "Inicio" tiene `aria-current="page"`; con `/productos` no;
  - pulsar "Inicio" en el menú móvil deja `aria-expanded="false"`;
  - los cuatro enlaces existentes siguen con sus `href` `/#...`.

## Manual
Con `npm run build && npm start`:
- Escritorio: "Inicio" aparece a la izquierda de "Productos", con el mismo estilo; en `/` se ve resaltado.
- Desde `/productos` y desde una ficha, "Inicio" lleva a la Home.
- Móvil (~375 px): el menú muestra "Inicio" primero, sin recortes, y se cierra al pulsarlo.
- La barra de escritorio no desborda ni se parte en dos líneas en ~768–1024 px.
- Teclado: foco visible en "Inicio"; lector de pantalla anuncia la página actual en `/`.

## Verificación del tono
- La etiqueta es exactamente "Inicio"; sin textos adicionales.

## Definición de "terminado"
- "Inicio" presente en escritorio y móvil, resaltado solo en `/`.
- Sin `any` ni dependencias nuevas.
- Comprobaciones automatizadas y manuales pasan.
- Fase 14 marcada `[x]` en `specs/roadmap.md`.
