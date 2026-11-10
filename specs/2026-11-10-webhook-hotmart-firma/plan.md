# Plan — Endpoint de webhooks de Hotmart con verificación (Fase 26)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones (los eventos no se persisten en esta fase).
1.2 `lib/env.ts`: añadir `HOTMART_HOTTOK` (string no vacío) con `parseHotmartWebhookEnv` y `getHotmartWebhookEnv` (lazy; errores sin valores).
1.3 `.env.example`: documentar `HOTMART_HOTTOK`.
1.4 Tests en `lib/env.test.ts`: válida, ausente, vacía; el mensaje no contiene el valor.

## 2. Componentes
2.1 `lib/hotmart/webhook.ts` (`server-only`):
  - `verifyHottok(received: string | null, expected: string): boolean` (SHA-256 + `timingSafeEqual`).
  - `webhookPayloadSchema` (Zod, tolerante) y tipo `HotmartWebhookPayload`.
  - `handleHotmartWebhook(request: Request): Promise<Response>` con el contrato de `requirements.md`.
2.2 Exportar desde `lib/hotmart/index.ts` si procede.
2.3 Tests en `lib/hotmart/webhook.test.ts`: token correcto/incorrecto/ausente/longitud distinta; 503 sin env; 401 sin leer el cuerpo; 400 JSON inválido y esquema inválido; 200 evento conocido y desconocido; el log no incluye token ni datos del comprador.

## 3. Página y ruta
3.1 `app/api/webhooks/hotmart/route.ts`: `export async function POST(request: Request) { return handleHotmartWebhook(request); }`.
3.2 Test del route (importa `POST`, `Request` simulada).
3.3 Confirmar que `proxy.ts` no intercepta `/api/webhooks/*`.

## 4. Navegación
4.1 Sin enlaces ni rutas visibles.
4.2 Actualizar `specs/tech-stack.md` (variable `HOTMART_HOTTOK`, endpoint y verificación) y `README`/`.env.example` si corresponde.

## 5. Pruebas
5.1 `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.2 Prueba manual con `curl` contra `npm run dev` (casos de la tabla de `validation.md`).
5.3 Marcar la Fase 26 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
