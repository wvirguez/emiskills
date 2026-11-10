# Validación — Fase 30: Preparar despliegue en Hostinger

## Automatizado
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan.
- Afirmaciones específicas:
  - El seed de producción crea solo las plataformas y categorías base, ningún producto, y ejecutarlo dos veces no cambia los conteos.
  - `package.json` define `engines.node`, `db:deploy` (`prisma migrate deploy`) y `start` que usa `PORT`.
  - `DEPLOY.md` y `.env.example` listan las mismas variables (comprobación manual o test sencillo que lea ambos archivos).
- `npm ci && npm run build` desde cero (sin `.next` ni `node_modules`) termina sin errores con las variables mínimas; sin `SITE_URL` en producción falla con mensaje claro.
- `npm audit --omit=dev`: 0 vulnerabilidades altas/críticas.

## Manual
- `NODE_ENV=production PORT=3999 npm start` con `.env` de prueba: la home, `/productos/`, `/robots.txt`, `/sitemap.xml` y `/admin/login/` responden.
- Migraciones: `npm run db:deploy` sobre una BD vacía temporal aplica las 3 migraciones; sobre una ya migrada no hace nada.
- Seguir `DEPLOY.md` "en seco" paso a paso: cada comando existe, cada variable está explicada y no falta ningún paso.
- Revisar que no hay secretos reales en `DEPLOY.md`, `.env.example` ni en el diff.
- Confirmar en el panel de Hostinger (o dejar como pendiente explícito para la Fase 31) que el plan soporta Node.js y la versión requerida.

## Verificación del tono
- La guía es técnica, clara y en español; no afirma capacidades del plan de Hostinger sin verificar (marca "verificar en el panel").
- Sin textos de cara al visitante modificados; si alguno cambia, mantiene honestidad y la divulgación de afiliados.

## Definición de “terminado”
- Todos los checks automatizados y manuales pasan.
- `DEPLOY.md` completo y enlazado desde `README.md`; `tech-stack.md` actualizado.
- Seed de producción disponible y probado; sin productos de ejemplo en producción.
- Sin dependencias nuevas (o cambio de ubicación aprobado explícitamente).
- No se tocó ninguna BD ni servidor de producción.
- Fase 30 marcada `[x]` en `specs/roadmap.md` solo tras validar.
