# Tech Stack — emiskills

## Existente (package.json)
| Área | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) — **tiene cambios incompatibles; leer `node_modules/next/dist/docs/` antes de codificar** |
| UI | React 19.2, Tailwind CSS 4, react-icons |
| Lenguaje | TypeScript 5 |
| Calidad | ESLint 9 + eslint-config-next |

## Decisiones para cubrir las brechas
| Área | Decisión | Notas |
|---|---|---|
| Base de datos | **MySQL 8.4 instalado localmente** en esta máquina (no Docker) | La dirección de acceso (`DATABASE_URL`: host, puerto, usuario, contraseña y base `emiskills`) vive solo en `.env` (fuera de git; plantilla en `.env.example`). Hostinger ofrece MySQL nativo para producción. |
| Acceso a datos | **Prisma 7** con provider `mysql` y adaptador MariaDB (`@prisma/adapter-mariadb`) | Migraciones versionadas en `prisma/migrations/`; cliente en `lib/db.ts`; variables validadas en `lib/env.ts`. |
| Autenticación admin | Sesión propia para un único rol admin (propuesto: **Auth.js** con credenciales, o JWT en cookie httpOnly) | Sin cuentas de visitantes. |
| Validación | **Zod** en límites (formularios, webhooks, API) | |
| Integración | API de **Hotmart Developers** + webhooks | Cliente en `lib/hotmart/` (`fetch` + Zod, solo servidor). Variables `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN` y `HOTMART_ENV` (`sandbox` por defecto o `production`), opcionales para la web y validadas de forma lazy en `lib/env.ts`. Prueba manual: `npm run hotmart:check`. Sincronización a la BD: `lib/hotmart/sync.ts`, botón en `/admin/productos` o `npm run hotmart:sync` (los productos nuevos entran inactivos con `needsReview`; nunca se borran, solo se desactivan). Webhook: `POST /api/webhooks/hotmart/` (`lib/hotmart/webhook.ts`) verifica el `hottok` (cabecera `X-HOTMART-HOTTOK`, token fijo, no HMAC) contra `HOTMART_HOTTOK`, con comparación en tiempo constante; 503 sin variable, 401 token inválido, 400 cuerpo inválido, 200 válido (500 `processing_failed` si falla la BD). Eventos (`lib/hotmart/webhook-events.ts`): solo `PRODUCT_UPDATE` modifica productos vinculados (título, `externalUcode`, `syncedAt`; desactiva si el estado ≠ `ACTIVE`; nunca reactiva, crea ni borra; no toca precio); el resto se ignora con log. Como `trailingSlash: true`, configurar en Hotmart la URL **con barra final**. |
| Pruebas | **Vitest** (unitarias) + Testing Library; Playwright opcional para flujos clave | |
| Desarrollo | 100 % local primero, con el MySQL local instalado en la máquina; **no usar el contenedor Docker** para pruebas ni verificaciones | Si el puerto del `.env` no coincide con el del servidor local, corregir el `.env`; no apuntar a otra instancia. |
| Despliegue | **Hostinger** (hosting con Node.js) tras terminar el desarrollo local | Variables de entorno en el panel; `next build` + `next start`. |

## Base de datos local
- **Fuente de verdad de la conexión:** `DATABASE_URL` en `.env`. Las pruebas manuales, `npm run db:check`, `npm run db:migrate`, `npm run db:seed` y `npm run build && npm start` usan esa variable. No se escriben credenciales en specs, código ni commits.
- **Autenticación MySQL 8.4:** el usuario de la app debe usar `caching_sha2_password` (el motor de migraciones de Prisma no soporta `sha256_password`; `mysql_native_password` viene desactivado en 8.4).
- **Conexión sin TLS:** la URL lleva `allowPublicKeyRetrieval=true`; sin esa opción el adaptador falla con `RSA public key is not available client side`.
- **Verificación rápida:** `npm run db:check` debe responder "Conexión a MySQL OK"; después aplicar `npx prisma migrate deploy` y `npm run db:seed` (idempotente, usa `upsert`).
- **Diagnóstico:** Prisma muestra `pool failed to retrieve a connection` (código 45028) para cualquier fallo de conexión; el motivo real (credenciales, plugin de autenticación, puerto) se ve conectando con el cliente `mysql` o el conector `mariadb` directamente.

## Riesgos / puntos abiertos
- Confirmar que el plan de Hostinger contratado soporta aplicaciones Node.js (Next.js SSR). Si no, considerar VPS.
- Confirmar versión de MySQL de Hostinger y compatibilidad con el ORM elegido.
- Los acuerdos de afiliación de Hotmart y de otros productores deben revisarse (uso de marca, enlaces).

## Convenciones
- TypeScript estricto, sin `any`.
- Secretos solo en variables de entorno; `.env*` fuera de git.
- Cada feature con su spec en `specs/` antes de implementarse.
- Código nuevo con pruebas.
