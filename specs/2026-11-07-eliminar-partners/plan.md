# Plan — Eliminar sección Partners (Fase 13)

## 1. Base de datos
1.1 Sin cambios.

## 2. Componentes
2.1 Borrar `components/Partners.tsx`.
2.2 `components/Footer.tsx`: añadir bajo la descripción de marca un párrafo breve: "Reunimos productos de Hotmart y de otros productores." (mismas clases de texto del bloque, p. ej. `text-sm text-gray-400`).
2.3 Buscar con `grep -r "Partners"` que no queden referencias en `app/`, `components/` ni `lib/`.

## 3. Página y ruta
3.1 `app/page.tsx`: eliminar `import Partners` y `<Partners />`.
3.2 Revisar fondos entre Hero y Categorías; ajustar solo si la transición se ve brusca.

## 4. Navegación
4.1 Confirmar que las anclas `#productos`, `#categorias`, `#buscar`, `#como-funciona` siguen existiendo (Navbar, Footer, Hero).

## 5. Pruebas
5.1 `app/page.test.tsx`: mockear `FeaturedProducts`/`SearchCourses`/`Categories` (async con BD) y verificar que no aparece "Plataformas de origen de los productos" y que `Hero`, `HowItWorks`, `AffiliateDisclosure` y `FinalCTA` se renderizan.
5.2 `components/Footer.test.tsx`: añadir test de la línea "Hotmart y de otros productores".
5.3 Marcar Fase 13 como `[x]` en `specs/roadmap.md` tras validar.
