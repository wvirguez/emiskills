# Plan — Fase 31: Despliegue y verificación en producción

Runbook en orden. **[U]** = lo hace el usuario en Hostinger/Hotmart; **[A]** = el agente guía o verifica.

## 1. Base de datos
1.1 [U] Crear BD y usuario MySQL en el panel; anotar host, puerto, usuario y nombre (la contraseña no se comparte).
1.2 [A] Componer la plantilla de `DATABASE_URL` (con `connection_limit=3`, codificando caracteres especiales) y confirmar versión de MySQL/compatibilidad con Prisma 7.
1.3 [U] Ejecutar `npm run db:deploy` y `npm run db:seed:prod` contra producción (SSH, o desde local si el acceso remoto está habilitado) y compartir la salida.
1.4 [A] Validar: 3 migraciones aplicadas; 2 plataformas, 4 categorías, 0 productos.

## 2. Componentes (aplicación y variables)
2.1 [U] Crear la Web App Node.js 22.x desde Git (`wvirguez/emiskills`, rama `main`), Build command `npm ci --include=dev && npm run build`, inicio `npm start`.
2.2 [U] Configurar variables en el panel: `DATABASE_URL`, `SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (escape `\$`), `SESSION_SECRET` (nuevo, `openssl rand -hex 32`). Hotmart se añade en el bloque 4.
2.3 [A] Revisar el log de build compartido por el usuario (`✓ Compiled successfully`; diagnosticar con la tabla de problemas de `DEPLOY.md`).

## 3. Página y ruta (dominio, HTTPS y verificación)
3.1 [U] Conectar el dominio y activar SSL; confirmar que `https://<dominio>` carga.
3.2 [A] Verificar con curl: `/`, `/productos/`, `/robots.txt` y `/sitemap.xml` usan el dominio real; `/opengraph-image/` responde `image/png`; cabeceras (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`); `/admin/` sin sesión redirige al login; `/api/webhooks/hotmart/` sin token responde 401/503, no 500.
3.3 [U][A] Login en `/admin/login/` (cookie `admin_session` con `Secure` y `HttpOnly`); crear una categoría y un producto manual de prueba, comprobar que aparecen en el catálogo y borrarlos.
3.4 [A] `/go/<slug>/`: redirige (307) al enlace de afiliado, registra un clic y la ruta lleva `X-Robots-Tag: noindex`; ver el clic en `/admin/metricas/`.
3.5 [A] Lighthouse móvil sobre producción (home, catálogo, detalle) y comparar con las metas de la Fase 29.

## 4. Navegación (Hotmart en producción)
4.1 [U] Añadir en el panel `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN`, `HOTMART_ENV=production`, `HOTMART_HOTTOK`; reiniciar la app.
4.2 [U] Sincronizar desde `/admin/productos` (botón Hotmart); revisar los productos nuevos (entran inactivos con `needsReview`), completar datos y activar los que correspondan.
4.3 [U] En Hotmart configurar el webhook `https://<dominio>/api/webhooks/hotmart/` (barra final) con el mismo hottok.
4.4 [A] Probar con `curl` un POST sin token (401) y, con la prueba de envío de Hotmart, confirmar 200 y el log; verificar que un evento `PRODUCT_UPDATE` solo modifica productos vinculados.
4.5 [U][A] Confirmar visible en el catálogo público solo lo activado y con divulgación de afiliados presente.

## 5. Pruebas e informe
5.1 [A] Antes de empezar: `npm test`, `npm run lint`, `npx tsc --noEmit` y `npm run build` en `main` pasan.
5.2 [A] Redactar `informe.md`: fecha, versiones (Node, Next, MySQL), checklist con resultado, Lighthouse, incidencias y correcciones, pendientes (CSP, login, meta description del detalle en Search Console, rotación de credenciales).
5.3 [A] Marcar el checklist de la sección 9 de `DEPLOY.md`, cerrar los puntos abiertos de `tech-stack.md` y, tras validar, marcar la Fase 31 `[x]` en `specs/roadmap.md`.
5.4 Si algo falla: rollback según `DEPLOY.md` §7 y registrar la causa en el informe.
