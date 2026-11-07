# Plan — CTAs del Hero (Fase 12)

## 1. Base de datos
1.1 Sin cambios (no hay esquema, migraciones ni consultas).

## 2. Componentes
2.1 `components/Hero.tsx`: botón primario → texto `COMPRAR AHORA`, `href="/productos"`.
2.2 `components/Hero.tsx`: botón secundario → texto `VER CATEGORÍAS`, `href="/#categorias"`.
2.3 `components/Footer.tsx`: prefijar con `/` las cuatro anclas (`/#productos`, `/#categorias`, `/#buscar`, `/#como-funciona`).
2.4 `components/FinalCTA.tsx`: `href="#productos"` → `href="/productos"`.
2.5 Si los botones desbordan a 375 px, permitir salto de línea (`text-center`) sin cambiar el estilo; de lo contrario, no tocar clases.

## 3. Página y ruta
3.1 Sin cambios. Confirmar que `id="categorias"` existe en `components/Categories.tsx` (ya existe) y que `/productos` responde.

## 4. Navegación
4.1 Verificar que `Navbar` (escritorio y móvil) ya usa `/#productos`, `/#categorias`, `/#buscar`, `/#como-funciona` y `/productos`; sin cambios.
4.2 Desde `/productos`, los enlaces del Footer deben llevar a las secciones de la landing.

## 5. Pruebas
5.1 `components/Hero.test.tsx`: mantener el test del h1 y añadir:
  - enlace "COMPRAR AHORA" con `href="/productos"`;
  - enlace "VER CATEGORÍAS" con `href="/#categorias"`;
  - los textos antiguos ("Obten una Propuesta", "Intentalo Ahora!") ya no existen.
5.2 Añadir `components/Footer.test.tsx`: los cuatro enlaces de "Explorar" empiezan por `/#`.
5.3 `components/FinalCTA`: test mínimo con `href="/productos"` en "Ver productos" (crear `FinalCTA.test.tsx`).
5.4 Marcar Fase 12 como `[x]` en `specs/roadmap.md` tras validar.
