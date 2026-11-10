# Requisitos — Endpoint de webhooks de Hotmart con verificación (Fase 26)

## Alcance

### Incluido
- Route Handler `POST /api/webhooks/hotmart` (`app/api/webhooks/hotmart/route.ts`).
- Verificación del `hottok` que Hotmart envía en la cabecera `X-HOTMART-HOTTOK`, con comparación en tiempo constante.
- Validación del cuerpo JSON con Zod (esquema mínimo y tolerante: `event` string obligatorio; `id`, `version`, `creation_date` y `data` opcionales).
- Respuesta rápida y registro (log) del evento aceptado: tipo, id y fecha, **sin** datos personales del comprador.
- Nueva variable `HOTMART_HOTTOK`, validada de forma lazy en `lib/env.ts` y documentada en `.env.example`.
- Pruebas Vitest del verificador y del handler con `Request` simulada, sin red.

### Excluido
- Cualquier cambio en productos o en la BD a partir de los eventos (Fase 27).
- Persistir eventos (sin tabla `WebhookEvent`, sin migración).
- Rate limiting y reintentos propios.
- Configurar el webhook en el panel de Hotmart (paso manual posterior).

### Contrato del endpoint
| Situación | Respuesta |
|---|---|
| `HOTMART_HOTTOK` no configurada | `503` `{ "error": "webhook_not_configured" }` |
| Cabecera ausente o token distinto | `401` `{ "error": "unauthorized" }` |
| Cuerpo no JSON o que no cumple el esquema | `400` `{ "error": "invalid_payload" }` |
| Válido (evento conocido o desconocido) | `200` `{ "received": true }` |

La verificación del token va **antes** de leer el cuerpo. Otros métodos (GET, etc.) devuelven `405` por defecto de Next.js.

## Decisiones
- **Solo recibir y verificar:** la Fase 27 añade el manejo; así cada fase es pequeña y verificable.
- **Hottok propio en `HOTMART_HOTTOK`:** Hotmart lo emite aparte de las credenciales de API; no se reutiliza `HOTMART_BASIC_TOKEN`. Nota: Hotmart autentica con un token fijo, no con firma HMAC.
- **`crypto.timingSafeEqual` sobre hashes SHA-256** de ambos valores, para evitar fugas por tiempo y longitudes distintas.
- **Eventos desconocidos con token válido → 200 + log**, para que Hotmart no reintente indefinidamente. El esquema de evento no restringe el valor de `event`.
- **Nunca registrar** el token, la cabecera completa ni datos del comprador.

## Contexto
- Next.js 16: leer `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` antes de codificar. `proxy.ts` solo cubre `/admin/:path*`, por lo que no interfiere.
- Patrón existente: validación lazy en `lib/env.ts` (`getHotmartEnv`); el hottok se valida por separado (`getHotmartWebhookEnv`) para que la web y el cliente de API no dependan de él.
- Lógica de verificación en `lib/hotmart/webhook.ts` (`server-only`, pura y testeable); el route handler solo orquesta.
- Los mensajes de error de la API son códigos técnicos; no hay texto visible para el usuario en esta fase.
- Tono/misión: no aplica texto público; mantener honestidad en la documentación (token fijo, no firma).

## Nota de implementación
`next.config.ts` tiene `trailingSlash: true`: `POST /api/webhooks/hotmart` responde 308. La URL a registrar en Hotmart debe ser `/api/webhooks/hotmart/` (con barra final).
