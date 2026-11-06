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
- [ ] **Fase 8:** Listado de productos en la landing con datos reales (reemplaza datos de ejemplo).
- [ ] **Fase 9:** Página de detalle de producto (información clara y honesta).
- [ ] **Fase 10:** Buscador: texto + filtro por categoría.
- [ ] **Fase 11:** Filtros por precio, idioma y plataforma.
- [ ] **Fase 12:** Pulido responsive/móvil y aviso de divulgación de afiliados.

## Bloque C — Enlaces de afiliado y clics
- [ ] **Fase 13:** Ruta `/go/[slug]` que redirige al enlace de afiliado parametrizado.
- [ ] **Fase 14:** Registro de clics (tabla `Click`) en cada redirección.

## Bloque D — Panel de administración
- [ ] **Fase 15:** Autenticación del admin y protección de rutas `/admin`.
- [ ] **Fase 16:** CRUD de categorías.
- [ ] **Fase 17:** CRUD de productos manuales (otros productores).
- [ ] **Fase 18:** Métricas de clics en el panel (por producto/categoría).

## Bloque E — Integración Hotmart
- [ ] **Fase 19:** Cliente de la API de Hotmart (autenticación y lectura de productos).
- [ ] **Fase 20:** Sincronización de productos Hotmart a la base de datos.
- [ ] **Fase 21:** Endpoint de webhooks con verificación de firma.
- [ ] **Fase 22:** Manejo de eventos del webhook (actualizar/desactivar productos).

## Bloque F — Lanzamiento
- [ ] **Fase 23:** SEO básico (metadatos, sitemap, Open Graph).
- [ ] **Fase 24:** Revisión de rendimiento, accesibilidad y seguridad.
- [ ] **Fase 25:** Preparar despliegue en Hostinger (build, variables, MySQL remoto).
- [ ] **Fase 26:** Despliegue y verificación en producción.
