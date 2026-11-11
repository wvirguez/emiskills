# Requisitos — Fase 31: Despliegue y verificación en producción

## Alcance

### Incluye
Esta fase es un **runbook operativo**: el usuario opera el panel de Hostinger y el agente guía cada paso y verifica sobre la URL pública (curl, Lighthouse). El procedimiento base vive en `DEPLOY.md` (Fase 30); aquí se ejecuta y se registra el resultado.

| Bloque | Qué se hace |
|---|---|
| Despliegue con Git | Conectar el repositorio `wvirguez/emiskills` (rama `main`) a una Web App Node.js 22.x; Build command `npm ci --include=dev && npm run build`; inicio `npm start`; variables de entorno en el panel. |
| Base de datos | Crear BD y usuario MySQL en Hostinger, `DATABASE_URL` de producción, `npm run db:deploy` y `npm run db:seed:prod`. |
| Dominio y HTTPS | Dominio propio apuntando a la app con SSL activo; `SITE_URL=https://<dominio>` sin barra final. |
| Admin | Crear `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (generado en local, con `$` escapado) y `SESSION_SECRET` nuevo y distinto al de desarrollo; comprobar login. |
| Hotmart en producción | Credenciales de API de producción, `HOTMART_ENV=production`; sincronizar productos desde `/admin/productos` (entran inactivos, revisar y activar); configurar el webhook con `https://<dominio>/api/webhooks/hotmart/` (barra final) y `HOTMART_HOTTOK`; probar un evento. |
| Verificación funcional | Recorrido en producción: home, `/productos/`, filtros, detalle, `/go/<slug>/` (redirección y clic registrado), `/admin`, `/robots.txt`, `/sitemap.xml`, imagen OG, cabeceras de seguridad (incl. HSTS). |
| Informe | `informe.md` con fecha, versiones, resultados de cada comprobación, Lighthouse móvil sobre producción y pendientes. |

### No incluye
- Cambios de código salvo correcciones imprescindibles para que el despliegue funcione (cada una con test y registrada en el informe).
- VPS, Docker, CI/CD, dependencias nuevas.
- Pendientes ya documentados en la Fase 29 (CSP con nonces, endurecimiento del login, meta description en `<body>` del detalle): solo se **verifican** en producción (p. ej. con Search Console) y se registran.
- Cargar el catálogo definitivo/contenido editorial: tarea de operación posterior.

## Decisiones
- **Modalidad (elegida): el usuario opera el panel, el agente guía y verifica.** El agente no tiene acceso al panel ni a producción; cualquier comando contra producción (migraciones, seed) lo ejecuta el usuario y comparte la salida (sin secretos).
- **Dominio propio con HTTPS (elegido):** `SITE_URL` = ese dominio; HSTS y cookie `secure` quedan activos de forma natural.
- **Alcance elegido:** despliegue con Git + verificación funcional + Hotmart en producción + informe.
- **Productos en producción:** solo los sincronizados desde Hotmart y los creados desde el admin; el seed de producción no crea productos de ejemplo.
- **Orden:** primero la web sin Hotmart (BD, admin, verificación); después Hotmart (sync y webhook), para aislar fallos.

## Contexto
- **Secretos:** nunca se pegan en el chat, specs, informe ni commits; en el informe solo "configurada: sí/no". Se rotan las credenciales de desarrollo si salieron de la máquina.
- **Tono (visible al visitante):** la web ya cumple la misión: honesta, con divulgación de afiliados. No cambiar textos; solo verificar que la divulgación y los avisos aparecen en producción.
- **Pila:** Next.js 16.4.6, Node 22.x, Prisma 7 + MySQL, `trailingSlash: true` (webhook con barra final), `SITE_URL` obligatoria en producción (sin ella el build falla), cabeceras en `next.config.ts`.
- **Puntos abiertos de tech-stack a cerrar aquí:** soporte de MySQL y versión en el plan, compatibilidad con Prisma, límites de conexiones (`connection_limit=3`) y revisión de acuerdos de afiliación/uso de marca (Hotmart y otros productores).
- **Referencias:** `DEPLOY.md` (secciones 3–9), informe de la Fase 29 (hallazgos pospuestos).
