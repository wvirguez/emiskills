# Requisitos — Botón "Inicio" en la barra de navegación (Fase 14)

## Alcance

### Incluye
- Nuevo enlace **Inicio** (`href="/"`) como **primer elemento** de `navLinks` en `components/Navbar.tsx`, visible en la navegación de escritorio y en el panel del menú móvil, con el mismo estilo que los demás enlaces.
- Estado activo: cuando la ruta actual es exactamente `/`, "Inicio" se muestra en violeta (`text-violet-600`) y lleva `aria-current="page"`. En otras rutas no se resalta. Los demás enlaces no cambian.
- El menú móvil se cierra al pulsar "Inicio" (igual que el resto de enlaces).
- Revisar que el panel móvil (`max-h-96`) no recorte el nuevo ítem.
- Crear `components/Navbar.test.tsx` (hoy no existe).

### No incluye
- Ícono de casa ni cambios al logo (que sigue llevando a `/`).
- Estado activo para los demás enlaces.
- Reordenar o renombrar otros enlaces, ni cambios en los botones "Ver productos".

## Decisiones
- **Primer enlace de la lista, mismo estilo** (decisión del usuario): se añade a `navLinks`, así que escritorio y móvil quedan sincronizados con un solo cambio.
- **Resaltar solo "Inicio" en `/`** (decisión del usuario): `Navbar` ya es componente cliente (`"use client"`), por lo que se usa `usePathname` de `next/navigation`. No se añaden dependencias.
- **Comparación exacta** (`pathname === "/"`): en `/productos` o fichas "Inicio" no se resalta, aunque el hash (`/#productos`) no forme parte de `pathname`.

## Contexto
- **Tono:** etiqueta breve y neutra, en español: "Inicio".
- **Stack:** Next.js 16 App Router; leer `node_modules/next/dist/docs/` sobre `usePathname` antes de implementarlo. Sin dependencias nuevas.
- **Patrones:** `navLinks` y `isOpen` de `Navbar.tsx`; Testing Library con `vi.mock("next/navigation")` para controlar `usePathname`.
- **Móvil:** área táctil cómoda (`py-2.5`), menú se cierra tras la navegación.
