# Requisitos — Fase 30: Preparar despliegue en Hostinger

## Alcance

### Incluye
| Entregable | Detalle |
|---|---|
| `DEPLOY.md` (raíz) | Guía paso a paso en español para Hosting Node.js de Hostinger (Business/Cloud): requisitos, subir el código (Git o ZIP), comando de build/arranque, variables de entorno, MySQL remoto, migraciones, seed mínimo, dominio/SSL, actualizaciones y solución de problemas. |
| Build y arranque listos | `engines` de Node en `package.json` (versión compatible con Next 16.4: `>=20.9`, probado en 22), script `build` fiable en servidor (`prisma generate` + `next build`), script `start` que respete el puerto del panel (`next start -p ${PORT:-3000}`), script `db:deploy` (`prisma migrate deploy`). Verificar build limpio desde cero (`rm -rf .next node_modules && npm ci && npm run build`). |
| MySQL remoto | Pasos para crear base y usuario en el panel de Hostinger, formato de `DATABASE_URL` remota (host del panel, `connection_limit=3`, TLS/`allowPublicKeyRetrieval` según el caso), aplicar migraciones con `prisma migrate deploy` (nunca `migrate dev`), seed mínimo (categorías/plataformas; **no** los productos de ejemplo con `example.com`). |
| Checklist de variables | Tabla en `DEPLOY.md` y en `.env.example`: `DATABASE_URL`, `SITE_URL` (obligatoria en producción), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (con escape de `$`), `SESSION_SECRET`, `HOTMART_*` (`HOTMART_ENV=production`), `HOTMART_HOTTOK`; cómo generarlas y cuáles son opcionales. |
| Preparación del repo | Confirmar que `generated/`, `.env*`, `out/` y `.next/` tienen el tratamiento correcto en git/ZIP; documentar qué subir. |
| `specs/tech-stack.md` | Registrar la decisión de modalidad (Hosting Node.js) y resolver el punto abierto sobre soporte Node.js. |

### No incluye
- Ejecutar el despliegue, tocar la BD de producción o configurar el dominio real: es la **Fase 31**.
- Docker, CI/CD, dependencias nuevas, scripts de preflight.
- Configurar el webhook en Hotmart (se hace con la URL pública en la Fase 31; solo se documenta la URL con barra final).

## Decisiones
- **Modalidad: Hosting Node.js de Hostinger** (elegida por el usuario). Despliegue desde Git o ZIP con Node.js gestionado por el panel. VPS queda fuera.
- **Sin dependencias ni Docker** (elegido): solo documentación, scripts de `package.json` y configuración.
- **Dependencias de desarrollo en el build:** `prisma`, `tailwindcss`/`@tailwindcss/postcss`, `typescript` y `tsx` son `devDependencies` y se necesitan para `build` y `migrate deploy`/seed. La guía debe indicar instalar con devDependencies (`npm ci` sin `NODE_ENV=production` durante la instalación) o, si el panel lo impide, mover al conjunto de `dependencies` lo estrictamente necesario (decisión a tomar con evidencia; requiere aprobación al ser un cambio de dependencias).
- **Migraciones con `migrate deploy`**: aplican las ya versionadas en `prisma/migrations/` sin generar nuevas ni borrar datos.
- **Seed de producción mínimo:** el `seed.ts` actual crea productos de ejemplo; para producción solo se crean plataformas y categorías base (ver plan, grupo 2).
- **Hostinger compartido:** límites de conexiones (`connection_limit=3` ya en README) y memoria; el rate limit del login y la sesión viven en el proceso (se reinician al reiniciar la app).

## Contexto
- **Tono:** la guía es técnica y clara, sin promesas sobre planes de Hostinger que no se hayan verificado; marcar como "verificar en el panel" lo que dependa del plan contratado.
- **Next.js 16.4:** leer antes `node_modules/next/dist/docs/01-app/02-guides/self-hosting.md` y `production-checklist.md`.
- **Pila existente a respetar:** `trailingSlash: true` (el webhook de Hotmart se configura con barra final), `images.unoptimized: true`, cabeceras de seguridad en `next.config.ts` (HSTS solo si `NODE_ENV=production`, requiere HTTPS), `SITE_URL` obligatoria en producción (el build falla sin ella).
- **Seguridad:** ningún valor real en `DEPLOY.md`, `.env.example` ni commits; recomendar rotar credenciales que hayan salido de la máquina.
- **Punto abierto de `tech-stack.md`:** confirmar que el plan de Hostinger contratado soporta Node.js; la guía incluye cómo comprobarlo antes de subir.
