# Validación — MySQL local + ORM configurado (Fase 5)

Listo para fusionar cuando todo lo siguiente se cumple:

## Automático
- [ ] `npm run lint` sin errores.
- [ ] `npm run build` termina correctamente.
- [ ] `npm test` pasa (incluye test de env y test de conexión).
- [ ] Test de conexión (`SELECT 1`) pasa con MySQL local activo y se omite limpiamente sin DB.

## Verificación de conexión
- [ ] `npm run db:check` imprime OK con la DB local levantada.
- [ ] Con `DATABASE_URL` ausente o inválida, falla con un mensaje claro (Zod), sin stack confuso.

## Revisión
- [ ] `.env` no está versionado; `.env.example` sí, sin secretos reales.
- [ ] `lib/db.ts` usa singleton (sin múltiples conexiones en dev).
- [ ] No hay `any` ni modelos de Fase 6 añadidos.
- [ ] README documenta el procedimiento de MySQL local con Homebrew.
- [ ] Fase 5 marcada `[x]` en `specs/roadmap.md`.
