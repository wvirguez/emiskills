# Changelog

## 2026-11-07

- Feat: Buscador de productos: nueva página `/productos` con búsqueda por texto y filtro por categoría, paginación y mensaje cuando no hay resultados; la portada y la sección de categorías ahora leen las categorías de la base de datos y los enlaces del menú funcionan también fuera de la portada
- Docs: `specs/tech-stack.md` actualizado: la base de datos MySQL es local (no Docker) y su dirección de acceso vive en `.env`

## 2026-11-06

- Feat: Base de datos MySQL con Prisma (conexión, variables de entorno validadas y script de verificación `db:check`) y habilidad `changelog`
- Feat: Esquema inicial de productos, categorías y plataformas, con primera migración y datos de ejemplo (seed)
- Feat: Capa de datos de productos: listado paginado, detalle por slug, categorías y plataformas
- Feat: La portada muestra los 6 productos más recientes desde la base de datos, con tarjeta de producto y mensaje cuando no hay productos; la web deja de ser una exportación estática para leer los datos en cada visita
- Feat: Página de detalle de producto (`/productos/[slug]`) con precio, plataforma, idioma, aviso de afiliado y botón "Ir a la oferta", además de página 404 y de error en español

## 2026-11-05

- Docs: Constitución del proyecto para desarrollo con IA (misión, hoja de ruta y stack tecnológico en `specs/`), más la habilidad `feature-spec`
- Feat: Primera especificación (plan, requisitos y validación) para el hub de productos de la portada
- Feat: Portada con hub de productos: sección "Cómo funciona", datos de ejemplo y rediseño de la búsqueda y los aliados
- Feat: Ajustes en el Navbar y el Footer
- Fix: Ilustración del Hero movida a la derecha (nuevo componente `HeroIllustration`)
- Fix: Auditoría del código: se eliminaron componentes sin uso (`OnlineLearning`, `PopularCourses`) y una dependencia
- Feat: Pruebas y depuración del código: configuración de Vitest con una prueba de humo del Hero

## 2026-07-29

- Primeros componentes de la portada: Hero, Navbar, Footer, búsqueda de cursos, cursos populares, aprendizaje en línea, aliados y llamado a la acción final

## 2026-07-28

- Proyecto inicial creado con Create Next App
