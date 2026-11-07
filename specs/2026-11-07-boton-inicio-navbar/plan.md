# Plan — Botón "Inicio" en la barra de navegación (Fase 14)

## 1. Base de datos
1.1 Sin cambios.

## 2. Componentes
2.1 `components/Navbar.tsx`: añadir `{ href: "/", label: "Inicio" }` al inicio de `navLinks`.
2.2 Importar `usePathname` de `next/navigation` y calcular `isActive = (href) => href === "/" && pathname === "/"`.
2.3 En ambos mapeos (escritorio y móvil): `aria-current="page"` y clases de color violeta cuando esté activo; sin cambios para los demás.
2.4 Verificar que `max-h-96` del panel móvil aloja 5 enlaces + botón "Ver productos" (si no, subir a `max-h-[28rem]`).

## 3. Página y ruta
3.1 Sin cambios en rutas.

## 4. Navegación
4.1 Comprobar desde `/productos` y una ficha que "Inicio" lleva a `/`.
4.2 Comprobar que el menú móvil se cierra al pulsar "Inicio".

## 5. Pruebas
5.1 `components/Navbar.test.tsx` (mock de `next/navigation`):
  - "Inicio" aparece primero en la navegación de escritorio con `href="/"`;
  - tras abrir el menú móvil (botón "Toggle navigation") hay un segundo enlace "Inicio" con `href="/"`;
  - con `pathname="/"` los enlaces "Inicio" tienen `aria-current="page"`; con `pathname="/productos"` no;
  - pulsar "Inicio" en el menú móvil cierra el menú (`aria-expanded="false"`);
  - los demás enlaces (`/#productos`, `/#categorias`, `/#buscar`, `/#como-funciona`) se conservan.
5.2 Marcar Fase 14 como `[x]` en `specs/roadmap.md` tras validar.
