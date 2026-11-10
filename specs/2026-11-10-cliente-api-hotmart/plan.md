# Plan — Cliente de la API de Hotmart (Fase 24)

## 1. Base de datos / configuración
1.1 Sin cambios en Prisma ni migraciones.
1.2 `lib/env.ts`: `hotmartEnvSchema` (`HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN` no vacíos; `HOTMART_ENV` enum `sandbox|production`, por defecto `sandbox`), `parseHotmartEnv(source)` y `getHotmartEnv()` lazy. Mensajes en español sin mostrar valores.
1.3 Tests en `lib/env.test.ts`: válido, falta cada variable, `HOTMART_ENV` inválido, valor por defecto.
1.4 `.env.example`: bloque "Hotmart (opcional, solo para sincronización)" con placeholders.

## 2. Componentes (módulo del cliente)
2.1 `lib/hotmart/errors.ts`: clases de error tipadas (ver requirements).
2.2 `lib/hotmart/schemas.ts`: esquemas Zod de token, producto, oferta y `page_info`; funciones de normalización a `HotmartProduct` / `HotmartOffer`.
2.3 `lib/hotmart/http.ts`: `hotmartFetch` con timeout, reintentos exponenciales acotados (429/5xx/red), respeto de `Retry-After`, sin registrar URLs con secretos.
2.4 `lib/hotmart/auth.ts`: `getAccessToken()` con caché en memoria (renovación con margen de 60 s), `clearTokenCache()` para tests y para 401.
2.5 `lib/hotmart/client.ts`: `listProducts({ status?, format? })` y `listProductOffers(ucode)` con paginación completa (tope de seguridad de páginas) y `getBaseUrl(env)`.
2.6 `lib/hotmart/index.ts`: reexporta API pública y tipos.
2.7 Tests con `fetch` simulado: token y caché, renovación al expirar, 401 → renueva y reintenta una vez, 429/5xx con reintento y límite, 4xx sin reintento, timeout, respuesta inválida → `HotmartResponseError`, paginación de 3 páginas, URL de sandbox vs. producción, normalización (ms → `Date`), que ningún error incluya secretos.

## 3. Página y ruta
3.1 No hay página ni ruta pública/admin en esta fase.
3.2 `scripts/hotmart-check.ts` + `"hotmart:check": "tsx scripts/hotmart-check.ts"` en `package.json`: carga `.env`, valida con `getHotmartEnv()`, autentica, lista productos (conteo, y los primeros 5 con id, nombre, estado, formato) y las ofertas del primero; salida en español; códigos de salida distintos de 0 ante error; no escribe en la BD ni imprime secretos.
3.3 Test del formateo del resumen del script (función pura exportada), sin red.

## 4. Navegación
4.1 Sin cambios de navegación.
4.2 Documentación: variables y modo sandbox en `specs/tech-stack.md` (sección Integración) y mención de `npm run hotmart:check`.

## 5. Pruebas
5.1 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit` y `npm run build` (el build debe pasar sin variables `HOTMART_*`).
5.2 Verificación manual con credenciales sandbox: `npm run hotmart:check`.
5.3 Marcar la Fase 24 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
