# Validación — Cliente de la API de Hotmart (Fase 24)

## Automatizado
- `npm test` pasa, con aserciones específicas:
  - `parseHotmartEnv`: error si falta `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET` o `HOTMART_BASIC_TOKEN`; `HOTMART_ENV` por defecto `sandbox`; valor distinto de `sandbox|production` → error; el mensaje de error no contiene los valores de las variables.
  - Token: la petición usa `POST`, `grant_type=client_credentials` y cabecera `Authorization: Basic …`; dos llamadas seguidas hacen **una** sola petición de token; tras expirar (con margen de 60 s) se pide otro.
  - 401 con token cacheado → se renueva el token y se reintenta una sola vez; segundo 401 → `HotmartAuthError`.
  - 429 y 5xx se reintentan hasta 3 veces (respetando `Retry-After`) y luego lanzan `HotmartRateLimitError`/`HotmartApiError`; 400/403/404 no se reintentan.
  - Timeout y fallo de red → `HotmartNetworkError`.
  - Respuesta que no cumple el esquema → `HotmartResponseError`.
  - `listProducts` recorre 3 páginas siguiendo `next_page_token` hasta que es `null` y devuelve todos los productos; respeta el tope de páginas.
  - `listProductOffers(ucode)` llama a `/products/api/v1/products/{ucode}/offers` y mapea precio, moneda y `directOfferLink`.
  - Base URL: `sandbox` → `https://sandbox.hotmart.com`, `production` → `https://developers.hotmart.com`.
  - `created_at` (ms) se convierte a `Date` correcta; `status`/`format` desconocidos no rompen.
  - Ningún error ni mensaje contiene `client_secret`, el Basic token ni el access token.
- `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores ni `any`; el build funciona **sin** variables `HOTMART_*`.
- `git diff` sin dependencias nuevas en `package.json` (salvo el script `hotmart:check`).

## Manual
- Sin variables `HOTMART_*`: `npm run hotmart:check` falla con un mensaje claro en español que indica cuáles faltan; `npm run dev` y la web pública funcionan igual.
- Con credenciales **sandbox** válidas: `npm run hotmart:check` muestra autenticación correcta, el número de productos, los primeros 5 y las ofertas del primero; sale con código 0.
- Con un `HOTMART_BASIC_TOKEN` incorrecto: mensaje de error de autenticación sin imprimir el token.
- Confirmar el host de token para sandbox (punto abierto) y dejar la constante ajustada.
- Revisar la salida y el historial de la terminal: no aparece ningún secreto ni token.
- Confirmar que la tabla `products` no cambió tras ejecutar el script.

## Verificación del tono
- No hay texto visible al visitante. Los mensajes del script y los errores están en español, son objetivos y accionables, sin jerga innecesaria.

## Definición de "terminado"
- Todo lo automatizado en verde y la verificación manual con sandbox hecha (o documentado qué quedó pendiente por falta de credenciales).
- Sin dependencias nuevas, sin migraciones, sin secretos en el repositorio.
- Fase 24 marcada `[x]` en `specs/roadmap.md`, `.env.example` y `specs/tech-stack.md` actualizados y `CHANGELOG.md` al día.
