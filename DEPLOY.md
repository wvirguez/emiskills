# Despliegue en Hostinger (Hosting Node.js)

Guía para dejar **emiskills** listo en un plan de Hostinger con soporte Node.js. Es la preparación de la Fase 30; el despliegue real y su verificación son la Fase 31.

> Todo lo que dependa de tu plan o del panel de Hostinger está marcado con **(verificar en el panel)**: los nombres de menús pueden cambiar.

## 1. Antes de empezar

| Requisito | Detalle |
|---|---|
| Plan | Debe incluir **aplicaciones Node.js** (SSR). Un hosting solo estático/PHP no sirve: **(verificar en el panel)**. |
| Node.js | El panel de Hostinger ofrece 24.x, 22.x, 20.x y 18.x. **Se usa 22.x** (versión con la que se desarrolla y prueba el proyecto). **Hostinger toma la versión del campo `engines.node` de `package.json`** (hoy `22.x`) y no del selector del panel; si dejas un rango como `>=20.19`, elige la 20. 24.x es compatible según los `engines` de las dependencias, pero no está probado aquí; 20.x solo sirve si resuelve a `>= 20.19`. **No uses 18.x**: Next.js 16 exige `>= 20.9` y Prisma 7 exige `^20.19 \|\| ^22.12 \|\| >=24`. |
| MySQL | Base de datos MySQL del propio plan (se crea en el panel). |
| Dominio + HTTPS | Necesarios: las cabeceras activan HSTS en producción y `SITE_URL` debe ser `https://…`. |
| Cuenta Hotmart | Credenciales de API de **producción** y hottok del webhook. |

## 2. Qué subir (y qué no)

Sube: `app/`, `components/`, `lib/`, `prisma/`, `public/`, `data/`, `scripts/`, `proxy.ts`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `prisma.config.ts`, `package.json` y `package-lock.json`.

No subas: `.env*` (los secretos se configuran en el panel), `node_modules/`, `.next/`, `out/`, `generated/` (se regenera al instalar) ni `*.tsbuildinfo`.

Vías: **Git** (recomendada, el panel clona el repositorio) o **ZIP** del proyecto sin lo anterior.

## 3. Variables de entorno

Se configuran en el panel de la aplicación Node.js. Plantilla local: `.env.example` (sin valores reales).

| Variable | Obligatoria | Cómo obtenerla |
|---|---|---|
| `DATABASE_URL` | Sí | Ver sección 4. Debe empezar por `mysql://`. |
| `SITE_URL` | **Sí en producción** (sin ella el build falla) | URL pública con `https://` y sin barra final, p. ej. `https://tudominio.com`. |
| `ADMIN_EMAIL` | Para usar `/admin` | Tu email de administrador. |
| `ADMIN_PASSWORD_HASH` | Para usar `/admin` | `npm run admin:hash -- 'tu-contraseña'` (en local). Formato `scrypt$salt$hash`. **Si el panel o un `.env` expande `$`, escápalo como `\$`** y no uses comillas. |
| `SESSION_SECRET` | Para usar `/admin` | `openssl rand -hex 32` (mínimo 32 caracteres). Distinto del de desarrollo. |
| `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN` | Para sincronizar productos | Hotmart → Herramientas → Credenciales de API. |
| `HOTMART_ENV` | Opcional | `production` en producción (por defecto `sandbox`). |
| `HOTMART_HOTTOK` | Para el webhook | Token que Hotmart envía en el webhook. Sin él, el endpoint responde 503. |

No pongas `NODE_ENV` a mano: `next build` y `next start` lo gestionan.

## 4. Base de datos MySQL remota

1. En el panel: **Bases de datos → MySQL**: crea la base y un usuario con contraseña fuerte, y asigna el usuario a la base **(verificar en el panel)**.
2. Anota host, puerto, usuario, contraseña y nombre de la base. El host puede ser `localhost` si la app corre en el mismo servidor, o el host remoto que indique el panel (en ese caso habilita el acceso remoto/IP **(verificar en el panel)**).
3. Compón la URL (codifica en URL los caracteres especiales de la contraseña, p. ej. `@` → `%40`):

```
mysql://USUARIO:CONTRASENA@HOST:3306/NOMBRE_BD?connection_limit=3&allowPublicKeyRetrieval=true
```

   `connection_limit=3` respeta los límites del hosting compartido. Quita `allowPublicKeyRetrieval=true` si tu servidor usa TLS o `mysql_native_password`.

4. Aplica las migraciones y el seed mínimo **desde un terminal con `DATABASE_URL` de producción** (SSH del plan si está disponible, o desde tu máquina si el acceso remoto está habilitado):

```bash
npm run db:deploy      # prisma migrate deploy: aplica las migraciones versionadas
npm run db:seed:prod   # plataformas (hotmart, manual) y categorías base; NO crea productos de ejemplo
```

   Ambos comandos son idempotentes. **No uses `npm run db:migrate` (es `migrate dev`) ni `npm run db:seed` en producción**: el seed de desarrollo inserta productos de ejemplo con enlaces ficticios.

## 5. Crear la aplicación Node.js en el panel

**(verificar en el panel)** los nombres exactos. Valores recomendados:

| Campo | Valor |
|---|---|
| Versión de Node | 22.x (se fija en `engines.node` de `package.json`; no 18.x) |
| Origen | Repositorio Git (rama `main`) o ZIP |
| Directorio raíz | Raíz del proyecto (donde está `package.json`) |
| Build command | `npm ci --include=dev && npm run build` (instala devDependencies pase lo que pase y compila) |
| Inicio | `npm start` (usa la variable `PORT` que asigna el panel; si no existe, 3000) |

**Por qué `--include=dev`:** `prisma`, `tailwindcss`/`@tailwindcss/postcss`, `typescript` y `tsx` están en `devDependencies` y hacen falta para el build y las migraciones. No hace falta averiguar si el panel instala devDependencies por defecto: con `npm ci --include=dev` en el *Build command* se instalan siempre, aunque el panel use `NODE_ENV=production`. Si tu panel solo tiene un campo de instalación y otro de build, pon `npm ci --include=dev` en el primero y `npm run build` en el segundo. La instalación ejecuta `prisma generate` (script `postinstall`).

**Nota sobre el bundler:** `npm run build` ejecuta `next build --webpack`. En el primer despliegue real, Turbopack (el bundler por defecto de Next 16) falló en Hostinger al procesar `app/globals.css` (el proceso hijo de PostCSS terminaba antes de conectarse). Webpack procesa el CSS dentro del mismo proceso y compila igual. En local, `npm run dev` sigue usando Turbopack.

**Cómo saber si funcionó:** en el log del primer despliegue (Git) debe aparecer `✓ Compiled successfully`. Si falla con `Cannot find module 'tailwindcss'` o `prisma: not found`, las devDependencies no se instalaron: revisa que el Build command sea exactamente el de la tabla.

**Despliegue con Git:** conecta el repositorio y la rama `main` desde el panel (Hostinger pide autorizar GitHub o una clave de despliegue) **(verificar en el panel)**. Cada `git push` a esa rama puede redesplegar; confirma si el redespliegue es automático o manual en tu plan. Recuerda que `.env` no está en el repositorio: las variables se escriben en el panel.

Después del primer build, el panel arranca la app; configura el dominio y activa el SSL **(verificar en el panel)**.

## 6. Webhook de Hotmart

Con la web ya publicada, en Hotmart configura la URL **con barra final** (el proyecto usa `trailingSlash`):

```
https://tudominio.com/api/webhooks/hotmart/
```

y el mismo hottok que `HOTMART_HOTTOK`. Se hace en la Fase 31.

## 7. Actualizar la aplicación

1. Sube el código nuevo (push a Git o nuevo ZIP).
2. Si hay migraciones nuevas: `npm run db:deploy` con `DATABASE_URL` de producción.
3. Vuelve a ejecutar el build y reinicia la app desde el panel.

**Rollback:** vuelve al commit/ZIP anterior y repite el build. Las migraciones no se revierten solas: haz copia de la BD antes de migrar (exportación desde el panel).

## 8. Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| El build falla con `SITE_URL es obligatoria` | Falta `SITE_URL` en las variables del panel. |
| `pool failed to retrieve a connection` (45028) | Credenciales, host, puerto o acceso remoto incorrectos; el error real se ve con el cliente `mysql`. |
| `RSA public key is not available client side` | Falta `allowPublicKeyRetrieval=true` en `DATABASE_URL`. |
| `ADMIN_PASSWORD_HASH debe tener formato scrypt$…` | El `$` se expandió: escápalo (`\$`) y no uses comillas. |
| `/admin` redirige siempre al login | `SESSION_SECRET` ausente o cambiada, o el sitio no usa HTTPS (la cookie es `secure` en producción). |
| Webhook responde 503 / 401 | Falta `HOTMART_HOTTOK` / token distinto. |
| `FATAL: An unexpected Turbopack error` … `node process exited before we could connect to it` (en `globals.css`) | Turbopack no puede lanzar su proceso de PostCSS en el servidor. El script `build` usa `next build --webpack` para evitarlo; no lo cambies a `next build` a secas. |
| `prisma: not found` / `Cannot find module 'tailwindcss'` | La instalación omitió devDependencies: usa `npm ci --include=dev` (sección 5). |
| La app se reinicia y se pierde el bloqueo del login | El rate limit está en memoria; es esperado. |

## 9. Checklist previo a la Fase 31

- [x] El plan soporta Node.js (Hostinger ofrece 24.x, 22.x, 20.x y 18.x): usar 22.x.
- [ ] Dominio con HTTPS activo y `SITE_URL` configurada.
- [ ] BD creada, `db:deploy` y `db:seed:prod` ejecutados sin errores.
- [ ] Variables de admin configuradas y acceso a `/admin/login/` comprobado.
- [ ] Variables de Hotmart de producción (`HOTMART_ENV=production`) y hottok.
- [ ] Productos Hotmart sincronizados desde `/admin/productos` (entran inactivos; revisar y activar).
- [ ] Webhook configurado con barra final.
- [ ] `/robots.txt` y `/sitemap.xml` muestran el dominio real.
- [ ] Credenciales de desarrollo rotadas si salieron de tu máquina.
