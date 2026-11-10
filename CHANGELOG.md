# Changelog

## 2026-11-10

- Feat: Métricas de clics en el panel (Fase 23) — página `/admin/metricas` con total de clics, clics por producto (incluye productos con 0), por categoría (con % del total) y por día en UTC (7/30 días rellenados con 0), rango elegido por URL (`?rango=7d|30d|todo`, por defecto 30 días); consultas en servidor sin dependencias nuevas ni migraciones; tarjeta "Métricas" del panel activa; tests de capa de datos, componentes y página
- Feat: Cliente de la API de Hotmart (Fase 24) — módulo `lib/hotmart/` solo servidor con autenticación OAuth (token en caché y renovación automática), lectura paginada de productos y ofertas, errores tipados, reintentos acotados y timeout; variables `HOTMART_*` opcionales validadas en `lib/env.ts` con modo sandbox por defecto; script `npm run hotmart:check` para probar la conexión sin escribir en la base de datos; tests con respuestas simuladas
- Feat: Sincronización de productos Hotmart a la base de datos (Fase 25) — nuevas columnas en `products` (`externalId`, `externalUcode`, `needsReview`, `syncedAt`) con migración; servicio `lib/hotmart/sync.ts` que crea productos nuevos inactivos y marcados "Revisar enlace", actualiza solo título, precio y moneda de los ya vinculados, desactiva los que Hotmart ya no entrega como activos y nunca borra ni toca productos manuales; botón "Sincronizar con Hotmart" en `/admin/productos` y script `npm run hotmart:sync`; insignias "Hotmart" y "Revisar enlace" en el listado, aviso en la edición y bloqueo de activación hasta guardar el enlace de afiliado propio; tests de mapeo, sincronización, acciones y componentes

## 2026-11-09

- Feat: CRUD de categorías en panel de administración (Fase 21) — listado con conteo de productos, creación, edición y eliminación con validación de slug único y bloqueo si hay productos asociados; Server Actions (`createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction`) con verificación de sesión, validación Zod, `revalidatePath` y `redirect` con parámetros de resultado; páginas `/admin/categorias`, `/admin/categorias/nueva`, `/admin/categorias/[id]` con formularios, estado vacío, mensajes de éxito/error y navegación (enlaces Panel/Volver); tarjeta "Categorías" en panel principal como enlace activo; tests unitarios (lib/categories, actions) y de componentes (CategoryForm, DeleteCategoryButton, páginas)
- Feat: CRUD de productos manuales en el panel de administración (Fase 22) — listado con categoría, plataforma, precio, estado y clics; creación, edición, activar/desactivar y eliminación (bloqueada si el producto tiene clics registrados); slug generado del título e inmutable, validación Zod (precio, monedas, idiomas, degradados predefinidos, URLs solo `https`), verificación de sesión en cada acción y refresco de las páginas públicas; páginas `/admin/productos`, `/admin/productos/nuevo` y `/admin/productos/[id]`; tarjeta "Productos" del panel activa; tests de capa de datos, acciones, esquema, formulario, botones y páginas

## 2026-11-08

- Feat: Autenticación de administrador (Fase 20) — `/admin/login` con Server Action + `useActionState`, rate limit (5 intentos / 15 min), sesión HMAC-SHA256 en cookie `httpOnly`/`sameSite=lax` (8h), proxy optimista (`proxy.ts`), panel `/admin` con `noindex, nofollow` y placeholder para Categorías/Productos/Métricas
- Feat: Hash de contraseña scrypt (`scripts/hash-password.ts`, `npm run admin:hash`) y variables `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` validadas en `lib/env.ts` (separadas del catálogo público)
- Test: Unitarios para password, session, rate-limit, login action, login form, proxy

## 2026-11-07

- Feat: Buscador de productos: nueva página `/productos` con búsqueda por texto y filtro por categoría, paginación y mensaje cuando no hay resultados; la portada y la sección de categorías ahora leen las categorías de la base de datos y los enlaces del menú funcionan también fuera de la portada
- Docs: `specs/tech-stack.md` actualizado: la base de datos MySQL es local (no Docker) y su dirección de acceso vive en `.env`
- Docs: Se incorporaron nuevas fases al roadmap (CTAs del Hero, eliminación de aliados, botón Inicio, franja de beneficios, categorías con scroll y pulido responsive)
- Feat: Filtros de productos por precio, idioma y plataforma en `/productos`, combinables con la búsqueda por texto y categoría
- Feat: Botones del Hero actualizados: "COMPRAR AHORA" (lleva a `/productos`) y "VER CATEGORÍAS" (lleva a la sección de categorías)
- Feat: Se eliminó de la portada la sección "Plataformas de origen de los productos"; el Footer ahora indica que el catálogo reúne productos de Hotmart y de otros productores
- Feat: Botón "Inicio" en la barra de navegación (escritorio y menú móvil) que lleva a la portada
- Feat: Franja de 4 beneficios con íconos (Alta Calidad, Acceso Instantáneo, Pago Seguro y Gran Apoyo) justo debajo del Hero en la portada
- Docs: Nueva habilidad `spec-implemeter` para implementar un plan de especificación grupo por grupo y entregar una revisión con los errores críticos
- Feat: La sección "Categorías" de la portada ahora muestra un carrusel horizontal de tarjetas de producto con botones de desplazamiento; al elegir una categoría (o "Todos") se filtran los productos mediante `?categoria=` en la URL
- Feat: Pulido responsive para móvil en toda la web y nuevo aviso corto de afiliado (con enlace al aviso completo) en la portada, el catálogo y el detalle de producto
- Feat: Nueva ruta `/go/[slug]` que redirige al enlace de afiliado del producto activo (redirección temporal, sin indexación y con validación de la URL); si el producto no existe o está inactivo responde 404, y el botón "Ir a la oferta" ahora pasa por esa ruta
- Feat: Registro de clics: cada redirección exitosa de `/go/[slug]` guarda en la nueva tabla `clicks` el producto, la página de origen y la fecha (sin IP ni datos personales); si el registro falla, la redirección continúa igual

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
