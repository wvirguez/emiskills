# Plan — FrontPage como hub de productos digitales

## 1. Preparación
- [ ] Leer la guía relevante en `node_modules/next/dist/docs/` (App Router, `next/link`, `next/image`).
- [ ] Verificar que `npm run lint` y `npm run build` pasan antes de empezar (línea base).
- [ ] Definir textos en español (LATAM) para cada sección y revisar que no haya cifras ni respaldos inventados.

## 2. Datos de ejemplo
- [x] Crear `data/sample-products.ts` con tipo `Product` (id, slug, title, category, source, price, currency, description corta, imageGradient).
- [x] Incluir 6 productos de ejemplo variados (curso, ebook, plantilla, membresía) claramente ficticios.

## 3. Hero
- [x] Mantener titular, párrafo y botones de la izquierda.
- [x] Reemplazar insignias "1000+ Estudiantes" / "120+ Cursos" por mensajes veraces sin cifras.
- [x] Ajustar destinos de los botones a secciones reales (`#productos`, `#como-funciona`).

## 4. Franja de plataformas (Partners)
- [x] Eliminar logos de Apple/Microsoft y el texto "líderes del sector".
- [x] Mostrar plataformas de origen reales (Hotmart, "Otros productores") con texto honesto.

## 5. Categorías y búsqueda
- [x] Nueva sección `Categories` con tipos de producto y sus iconos (react-icons).
- [x] Adaptar `SearchCourses` → búsqueda de productos (textos y chips de categoría), solo visual.

## 6. Productos destacados
- [x] Adaptar `PopularCourses` → `FeaturedProducts` consumiendo `data/sample-products.ts`.
- [x] Quitar valoración y "estudiantes"; mostrar plataforma de origen y precio con moneda.
- [x] Indicar que son productos de ejemplo.

## 7. Cómo funciona y CTA final
- [x] Nueva sección `HowItWorks` (3 pasos).
- [x] Actualizar `FinalCTA`: quitar "1000+ Clientes Felices", texto coherente con el hub.

## 8. Aviso de afiliados, Navbar y Footer
- [ ] Componente `AffiliateDisclosure` visible en la landing.
- [ ] Navbar: etiquetas/enlaces a secciones nuevas.
- [ ] Footer: aviso de afiliados y retirar anclas sin destino.

## 9. Composición de la página
- [x] Ordenar en `app/page.tsx`: Hero → plataformas → categorías → búsqueda → destacados → cómo funciona → aviso → CTA final.
- [x] Actualizar metadatos de `app/layout.tsx` (título y descripción del hub).

## 10. Verificación y cierre
- [x] Ejecutar todo lo de `validation.md`.
- [ ] Commit(s) en la rama `fase-01-frontpage-hub-productos` y marcar Fase 1 como hecha en `specs/roadmap.md`.
