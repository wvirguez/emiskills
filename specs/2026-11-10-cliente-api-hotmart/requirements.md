# Requisitos — Cliente de la API de Hotmart (Fase 24)

## Alcance

### Incluye
- Módulo de solo servidor `lib/hotmart/` con un cliente tipado de la API de Hotmart Developers:
  - **Autenticación OAuth 2.0** (`client_credentials`): `POST /security/oauth/token` con cabecera `Authorization: Basic <token>`; el token se cachea en memoria hasta poco antes de expirar (`expires_in`) y se renueva solo.
  - **Listar productos:** `GET /products/api/v1/products` con paginación completa por `page_token` (`next_page_token`), filtros opcionales `status` y `format`.
  - **Ofertas de producto:** `GET /products/api/v1/products/{ucode}/offers` (paginado) para obtener precio, moneda y modo de pago.
  - Normalización de las respuestas a DTO propios (camelCase, fechas como `Date`), validadas con Zod.
- Variables de entorno `HOTMART_*` validadas en `lib/env.ts`, **separadas** de las del catálogo y del admin.
- Script manual `npm run hotmart:check` (`scripts/hotmart-check.ts`): autentica, lista productos y muestra un resumen en consola. **No escribe en la base de datos** ni imprime secretos ni tokens.
- Soporte de **sandbox** (`https://sandbox.hotmart.com`) y producción (`https://developers.hotmart.com`) mediante una variable.

### No incluye
- Guardar o sincronizar productos en la base de datos (Fase 25).
- Webhooks y verificación de firma (Fases 26–27).
- Generación de enlaces de afiliado; ni UI ni rutas públicas ni de admin.
- Endpoints de ventas, suscripciones o comisiones.

### DTO expuestos

| DTO | Campos | Origen |
|---|---|---|
| `HotmartProduct` | `id`, `ucode`, `name`, `status`, `format`, `isSubscription`, `warrantyPeriod`, `createdAt` | `items[]` de productos (`created_at` en ms → `Date`) |
| `HotmartOffer` | `code`, `name`, `description`, `isMain`, `price` (`value`, `currency`), `paymentMode`, `directOfferLink` | `items[]` de ofertas |

`status` y `format` se aceptan como string (valores conocidos documentados, sin romper si Hotmart añade nuevos).

## Decisiones
- **`fetch` nativo + Zod, sin dependencias nuevas.** Menos superficie y coherente con la pila.
- **Solo servidor** (`import "server-only"`): las credenciales nunca llegan al navegador.
- **Errores tipados** (`HotmartAuthError`, `HotmartRateLimitError` con `retryAfter`, `HotmartApiError` con `status`, `HotmartNetworkError`, `HotmartResponseError` para respuestas que no cumplen el esquema). Los mensajes nunca incluyen secretos.
- **Reintentos acotados:** máx. 3 intentos con espera exponencial ante 429, 5xx y errores de red; no se reintenta 4xx. Si hay 401 con token cacheado, se renueva el token y se reintenta una vez. Timeout por petición (10 s) con `AbortSignal`.
- **Credenciales opcionales en el arranque:** `getHotmartEnv()` es *lazy* y lanza un error claro solo cuando se usa el cliente; la web pública y el build funcionan sin ellas (igual que `parseAdminEnv`).
- **Credenciales en la petición de token:** `client_id` y `client_secret` van como query params según la documentación oficial; el cliente nunca registra la URL completa.
- **Aviso honesto sobre enlaces:** `direct_offer_link_for_creator` es el enlace del *productor*, no un enlace de afiliado. Se expone tal cual con el nombre `directOfferLink`; qué enlace se guarda para el catálogo se decide en la Fase 25 (con el acuerdo de afiliación de por medio).

## Contexto
- **Pila:** patrón de `lib/env.ts` (esquema Zod + `parseXEnv` + `getXEnv` lazy), scripts con `tsx` como `scripts/db-check.ts`, tests con `fetch` simulado (`vi.stubGlobal`/`vi.fn`), estilo de `lib/clicks.test.ts`.
- **Variables nuevas** (documentar en `.env.example` y `specs/tech-stack.md`):
  `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN`, `HOTMART_ENV` (`sandbox` | `production`, por defecto `sandbox`).
- **Seguridad:** `.env*` fuera de git; el script y los logs enmascaran secretos y tokens; sin credenciales reales en specs, tests ni commits.
- **Punto abierto:** la documentación consultada indica el host de autenticación de producción (`api-sec-vlc.hotmart.com`); para sandbox solo documenta la base `sandbox.hotmart.com`. Confirmar el host de token en sandbox con una credencial real durante la verificación manual y dejarlo configurable en una constante.
- **Tono:** interfaz sin cambios; mensajes de error del script en español, claros y accionables.
