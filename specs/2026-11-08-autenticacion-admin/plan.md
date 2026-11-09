# Plan — Autenticación del admin (Fase 20)

## 1. Base de datos / configuración
1.1 Sin cambios en Prisma ni migraciones.
1.2 Ampliar `lib/env.ts` con `ADMIN_EMAIL` (email), `ADMIN_PASSWORD_HASH` (regex `^scrypt\$[0-9a-f]+\$[0-9a-f]+$`) y `SESSION_SECRET` (min 32). Actualizar `lib/env.test.ts`; como `DATABASE_URL` se usa en otras partes, separar el esquema admin en `getAdminEnv()` para que el catálogo público no dependa de estas variables.
1.3 Actualizar `.env.example` con placeholders y `.env` local (no versionado).
1.4 Crear `scripts/hash-password.ts` y `npm run admin:hash` (lee la contraseña por argumento/stdin y imprime el hash).

## 2. Componentes / lógica
2.1 `lib/auth/password.ts`: `hashPassword`, `verifyPassword` (scrypt + `timingSafeEqual`). Tests.
2.2 `lib/auth/session.ts` (`server-only` salvo funciones puras): `signSession`, `verifySessionToken` (HMAC, `exp`), `createSession`, `deleteSession`, `verifySession` (DAL, cacheado con `React.cache`). Tests de firma, manipulación y expiración.
2.3 `lib/auth/rate-limit.ts`: `checkLoginAttempt(ip)`, `registerFailure(ip)`, `resetAttempts(ip)` (5 fallos / 15 min). Tests con reloj simulado.
2.4 `app/admin/login/login-form.tsx` (`"use client"`, `useActionState`, errores accesibles con `aria-live`).

## 3. Página y ruta
3.1 `app/admin/login/actions.ts`: Server Action `login` (Zod → rate limit → verificar email y contraseña → `createSession` → `redirect('/admin')`); `logout` (borra cookie → `/admin/login`).
3.2 `app/admin/login/page.tsx`: página de login; redirige a `/admin` si ya hay sesión.
3.3 `app/admin/layout.tsx` con `robots: { index: false, follow: false }`; `app/admin/(panel)/layout.tsx` llama a `verifySession()` y muestra cabecera con "Cerrar sesión".
3.4 `app/admin/(panel)/page.tsx`: panel mínimo con tarjetas placeholder (Categorías, Productos, Métricas) marcadas "Próximamente".
3.5 `proxy.ts` con `matcher: ['/admin/:path*']`: chequeo optimista de cookie; redirige a `/admin/login` o `/admin`.

## 4. Navegación
4.1 Sin enlace público al admin (no se añade a la Navbar). Acceso por URL directa.

## 5. Pruebas
5.1 Tests unitarios de 2.1-2.3 y de las acciones (`login` éxito/fallo/bloqueo, `logout`) con `next/headers` mockeado.
5.2 Test del formulario con Testing Library (muestra el error devuelto).
5.3 Test de `proxy.ts` (sin cookie → redirect a login; cookie válida → continúa).
5.4 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.5 Marcar la Fase 20 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
