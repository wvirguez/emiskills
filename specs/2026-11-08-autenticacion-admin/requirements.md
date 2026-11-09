# Requisitos — Autenticación del admin (Fase 20)

## Alcance

### Incluye
- `/admin/login`: formulario de email y contraseña (Server Action + `useActionState`).
- `/admin`: panel mínimo protegido (saludo, enlaces placeholder a las secciones de las Fases 21-23) con botón "Cerrar sesión".
- Protección de `/admin/*` (excepto `/admin/login`): sin sesión válida se redirige a `/admin/login`. Con sesión, `/admin/login` redirige a `/admin`.
- Sesión propia: token firmado (HMAC-SHA256) en cookie `httpOnly`, `sameSite=lax`, `secure` en producción, duración 8 h.
- Límite de intentos de login por IP, en memoria.
- `noindex` en todo `/admin`.

### No incluye
- Cuentas de visitantes, registro, recuperación o cambio de contraseña.
- Tabla de usuarios o migración de Prisma.
- CRUD (Fases 21-23), registro de intentos fallidos en BD, 2FA.

### Datos
| Dato | Dónde | Notas |
|---|---|---|
| `ADMIN_EMAIL` | `.env` | Validado con Zod en `lib/env.ts` |
| `ADMIN_PASSWORD_HASH` | `.env` | Formato `scrypt$<salt hex>$<hash hex>` generado con script |
| `SESSION_SECRET` | `.env` | Mínimo 32 caracteres |
| Cookie `admin_session` | Navegador | Payload `{ sub: "admin", exp }` firmado |

## Decisiones
- **Sin dependencias nuevas:** `node:crypto` (`scrypt`, `createHmac`, `timingSafeEqual`) en lugar de `jose`/bcrypt/Auth.js. Evita pedir aprobación y cumple "sesión propia" de `tech-stack.md`.
- **Credenciales en `.env`** (opción elegida): un solo admin, sin tabla; el hash se genera con `npm run admin:hash` (script en `scripts/`).
- **Proxy solo para chequeo optimista** (cookie presente y firma/expiración válidas); la verificación real se repite en un Data Access Layer (`verifySession()`) llamado desde el layout/páginas de `/admin` y desde las Server Actions. El proxy en Next 16 es `proxy.ts` (antes middleware).
- **Límite de intentos:** 5 fallos por IP en 15 min → bloqueo temporal con mensaje genérico; mapa en memoria (se reinicia al reiniciar el servidor; aceptable en v1.0, se revisa en Fase 29).
- **Comparaciones en tiempo constante** y mismo mensaje para email o contraseña incorrectos.

## Contexto
- **Tono:** interfaz solo en español, sobrio y directo. Errores genéricos: "Credenciales incorrectas." y "Demasiados intentos. Inténtalo más tarde."
- **Stack:** Next.js 16 (leer `node_modules/next/dist/docs/01-app/02-guides/authentication.md` y `01-app/01-getting-started/16-proxy.md`), `cookies()` es asíncrono, Server Components por defecto, `"use client"` solo en el formulario de login.
- **Patrones existentes:** validación Zod como en `lib/env.ts` y `lib/search-params.ts`; pruebas Vitest junto al código (`*.test.ts`); estilo visual actual con Tailwind.
- **Secretos:** nunca en código, specs ni commits; actualizar `.env.example` con placeholders.
- **Pregunta abierta:** si Hostinger no conserva memoria entre peticiones (varios procesos), el límite en memoria será parcial; se revisa en Fases 29-30.
