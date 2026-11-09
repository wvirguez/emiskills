# Validación — Autenticación del admin (Fase 20)

## Automatizado
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` correcto.
- Afirmaciones específicas:
  - `verifyPassword` acepta la contraseña correcta, rechaza una incorrecta y un hash mal formado sin lanzar.
  - `verifySessionToken` rechaza tokens manipulados, firmados con otro secreto y expirados; acepta uno válido.
  - El rate limit bloquea al 6.º intento fallido dentro de 15 min, se libera pasado ese tiempo y se reinicia tras un login correcto.
  - `login` devuelve "Credenciales incorrectas." tanto para email incorrecto como para contraseña incorrecta, y "Demasiados intentos. Inténtalo más tarde." al estar bloqueado; en éxito crea la cookie y redirige a `/admin`.
  - `logout` elimina la cookie y redirige a `/admin/login`.
  - `proxy.ts` redirige `/admin` sin cookie válida a `/admin/login` y no intercepta rutas públicas.
  - `lib/env.ts` rechaza `SESSION_SECRET` corto, `ADMIN_EMAIL` inválido y hash con formato incorrecto.
- No se añaden dependencias a `package.json`.

## Manual
- `npm run admin:hash` genera un hash; configurarlo en `.env` junto con `ADMIN_EMAIL` y `SESSION_SECRET`.
- Navegador: `/admin` sin sesión → redirige a `/admin/login`.
- Login con credenciales correctas → `/admin` con panel y "Cerrar sesión".
- Credenciales incorrectas → mensaje genérico, sin revelar qué campo falló.
- 5 fallos seguidos → mensaje de bloqueo; el 6.º intento correcto también se bloquea hasta que expire la ventana.
- Cookie `admin_session` en DevTools: `HttpOnly`, `SameSite=Lax`, expira en ~8 h; `Secure` en `npm run build && npm start` bajo HTTPS/producción.
- Alterar el valor de la cookie → siguiente petición a `/admin` redirige a login.
- "Cerrar sesión" → cookie borrada; atrás en el navegador no muestra el panel.
- Con sesión activa, `/admin/login` redirige a `/admin`.
- `/admin` incluye `<meta name="robots" content="noindex, nofollow">`; el sitio público no cambia ni enlaza al admin.
- Vista móvil del login y del panel: sin desbordes.

## Tono
- Textos en español, sobrios; errores genéricos sin pistas para un atacante; sin urgencias ni mensajes engañosos.

## Definición de "terminado"
- Solo el admin con credenciales válidas accede a `/admin/*`; la verificación ocurre tanto en el proxy (optimista) como en el servidor (DAL y Server Actions).
- Sin secretos en el repositorio; `.env.example` actualizado.
- Todos los comandos automatizados pasan, la verificación manual está hecha y la Fase 20 está marcada `[x]` en el roadmap.
