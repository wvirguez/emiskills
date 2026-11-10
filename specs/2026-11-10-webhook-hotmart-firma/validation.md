# Validación — Endpoint de webhooks de Hotmart (Fase 26)

## Automatizado
- `npm test` pasa, incluyendo:
  - `verifyHottok`: true con token igual; false con token distinto, nulo, vacío o de distinta longitud (sin lanzar).
  - Handler: 503 sin `HOTMART_HOTTOK`; 401 con cabecera ausente o incorrecta y sin consumir el cuerpo; 400 con JSON malformado y con `event` ausente; 200 `{ received: true }` con evento conocido (`PURCHASE_APPROVED`) y desconocido.
  - Los logs no contienen el token ni email/nombre del comprador.
  - `lib/env.test.ts`: validación de `HOTMART_HOTTOK`.
- `npm run lint` sin errores ni advertencias nuevas.
- `npx tsc --noEmit` sin errores y sin `any`.
- `npm run build` compila y lista la ruta `/api/webhooks/hotmart`.

## Manual
Con `npm run dev` y `HOTMART_HOTTOK=test-token` en `.env`:
- `curl -i -X POST localhost:3000/api/webhooks/hotmart -H 'content-type: application/json' -d '{"event":"PURCHASE_APPROVED"}'` → `401`.
- Igual con `-H 'X-HOTMART-HOTTOK: mal'` → `401`.
- Con el token correcto y cuerpo válido → `200 {"received":true}`; aparece una línea de log con el tipo de evento.
- Con el token correcto y `-d 'no es json'` → `400`.
- Evento desconocido (`{"event":"ALGO_NUEVO"}`) → `200`.
- Sin `HOTMART_HOTTOK` en el entorno → `503`.
- `GET /api/webhooks/hotmart` → `405`.
- Confirmar que la base de datos no cambia tras ninguna petición.
- `/admin` sigue protegido y la web pública funciona sin `HOTMART_HOTTOK`.

## Tono
No hay texto visible para el usuario. Revisar que la documentación afirme solo lo cierto: Hotmart usa un token fijo (hottok), no una firma criptográfica.

## Definición de "terminado"
- Todos los checks automatizados y manuales pasan.
- No se añadieron dependencias ni migraciones.
- `HOTMART_HOTTOK` documentada en `.env.example` y `specs/tech-stack.md`; sin secretos en el repo.
- Fase 26 marcada `[x]` en `specs/roadmap.md` y `CHANGELOG.md` actualizado.
