# Roadmap — emiskills

> **Orden:** basado en `TODO.md` (sección "Ahora" primero; luego "Próximas": continuar con las fases del roadmap) y en las características del README.

Marca cada fase como `[x]` solo tras implementarla y validarla.

Cada fase es pequeña (aprox. una sesión de trabajo), entrega algo verificable y tiene su spec en `specs/` antes de implementarse.

## Bloque 0 — Prioridad actual (TODO.md · Ahora)
- [x] **Fase 1:** Ajustar el FrontPage para que se vea como un hub profesional de productos digitales (estructura, textos, secciones, estilo).
- [x] **Fase 2:** Cambiar la imagen derecha del Hero, manteniendo el mensaje de la izquierda.

## Bloque A — Fundamentos
- [x] **Fase 3:** Limpiar y auditar el código existente (landing actual, dependencia `react-icon` duplicada, lint limpio).
- [x] **Fase 4:** Configurar Vitest y un test de humo.
- [x] **Fase 5:** MySQL local + ORM configurado (conexión y variables de entorno).
- [x] **Fase 6:** Esquema inicial: `Product`, `Category`, `Platform` + primera migración y seed.

## Bloque B — Catálogo público
- [x] **Fase 7:** Capa de datos: consultas de listado y detalle de productos (con tests).
- [x] **Fase 8:** Listado de productos en la landing con datos reales (reemplaza datos de ejemplo).
- [x] **Fase 9:** Página de detalle de producto (información clara y honesta).
- [x] **Fase 10:** Buscador: texto + filtro por categoría.
- [x] **Fase 11:** Filtros por precio, idioma y plataforma.
- [x] **Fase 12:** CTAs del Hero: cambiar "Obten una Propuesta" por "COMPRAR AHORA" y "Intentalo Ahora!" por "VER CATEGORÍAS", actualizando también sus enlaces (propuesta inicial: `/productos` y `/#categorias`; confirmar en la entrevista de la fase). Actualizar `Hero.test.tsx`.
- [x] **Fase 13:** Eliminar la sección "Plataformas de origen de los productos" de la landing (`Partners`) y su uso en `app/page.tsx`; retirar el componente y los tests/imports que queden sin uso.
- [ ] **Fase 14:** Botón "Inicio" en la barra de navegación (escritorio y menú móvil) que lleva a la Home Page (`/`).
- [ ] **Fase 15:** Franja horizontal de 4 beneficios con íconos en la landing: "Alta Calidad" (Productos Premium y útiles), "Acceso Instantáneo" (Descarga inmediata después de comprar), "Pago Seguro" (Pagos seguros y encriptados) y "Gran Apoyo" (Estamos aquí para ayudarte en cualquier momento). Revisar con la misión que los textos no prometan algo que los productores no garanticen (la venta ocurre en la plataforma del productor).
- [ ] **Fase 16:** Sección "Categorías" con scroll horizontal de tarjetas medianas de productos: al hacer clic en una categoría, el scroll muestra solo los productos de esa categoría (por defecto, todos). Reutiliza `getProducts` con `categorySlug`; definir en la entrevista si el cambio es por cliente o por URL.
- [ ] **Fase 17:** Pulido responsive/móvil y aviso de divulgación de afiliados.

## Bloque C — Enlaces de afiliado y clics
- [ ] **Fase 18:** Ruta `/go/[slug]` que redirige al enlace de afiliado parametrizado.
- [ ] **Fase 19:** Registro de clics (tabla `Click`) en cada redirección.

## Bloque D — Panel de administración
- [ ] **Fase 20:** Autenticación del admin y protección de rutas `/admin`.
- [ ] **Fase 21:** CRUD de categorías.
- [ ] **Fase 22:** CRUD de productos manuales (otros productores).
- [ ] **Fase 23:** Métricas de clics en el panel (por producto/categoría).

## Bloque E — Integración Hotmart
- [ ] **Fase 24:** Cliente de la API de Hotmart (autenticación y lectura de productos).
- [ ] **Fase 25:** Sincronización de productos Hotmart a la base de datos.
- [ ] **Fase 26:** Endpoint de webhooks con verificación de firma.
- [ ] **Fase 27:** Manejo de eventos del webhook (actualizar/desactivar productos).

## Bloque F — Lanzamiento
- [ ] **Fase 28:** SEO básico (metadatos, sitemap, Open Graph).
- [ ] **Fase 29:** Revisión de rendimiento, accesibilidad y seguridad.
- [ ] **Fase 30:** Preparar despliegue en Hostinger (build, variables, MySQL remoto).
- [ ] **Fase 31:** Despliegue y verificación en producción.
