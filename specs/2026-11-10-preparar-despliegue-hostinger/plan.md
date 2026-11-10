# Plan — Fase 30: Preparar despliegue en Hostinger

Cada grupo es independiente. No se despliega ni se toca producción (Fase 31).

## 1. Base de datos y migraciones
1.1 Añadir script `db:deploy` = `prisma migrate deploy` en `package.json`.
1.2 Comprobar que las 3 migraciones aplican desde cero sobre una BD vacía local de prueba (esquema temporal; no usar Docker ni tocar `emiskills`).
1.3 Definir el seed de producción mínimo: plataformas (`hotmart`, `manual`) y categorías base, sin productos de ejemplo. Opciones: `prisma/seed.production.ts` + script `db:seed:prod`, o bandera en `seed.ts`; con test (idempotente, solo `upsert`).
1.4 Documentar formato de `DATABASE_URL` remota y creación de BD/usuario en Hostinger.

## 2. Componentes (build y arranque)
2.1 `package.json`: `engines.node`, `build` = `prisma generate && next build` (si procede), `start` con `-p ${PORT:-3000}`; verificar compatibilidad con el arranque del panel.
2.2 Resolver dónde viven las dependencias necesarias en el servidor (ver decisión sobre devDependencies); si implica mover paquetes, pedir aprobación.
2.3 Verificar build limpio desde cero y arranque con `NODE_ENV=production` y variables mínimas.
2.4 Revisar `.gitignore`/ZIP: qué subir (código, `package-lock.json`, `prisma/`, `public/`, `generated/` si procede) y qué no (`.env*`, `node_modules`, `.next`, `out`).

## 3. Página y ruta (documentación)
3.1 Crear `DEPLOY.md`: requisitos y verificación del plan Node.js; subida (Git/ZIP); app Node.js en el panel (versión, comando de build, de inicio, raíz de la app); variables; MySQL; migraciones y seed; dominio y SSL; actualización; rollback; problemas frecuentes (Prisma `45028`, `$` en hash, `SITE_URL` ausente, puerto).
3.2 Tabla de variables (obligatoria/opcional, cómo generarla, ejemplo ficticio) y alinearla con `.env.example`.
3.3 Sección "Checklist previo a la Fase 31" (HTTPS activo, `SITE_URL`, webhook con barra final, `HOTMART_ENV=production`, admin creado, productos Hotmart sincronizados).

## 4. Navegación (referencias cruzadas)
4.1 Enlazar `DEPLOY.md` desde `README.md`.
4.2 Actualizar `specs/tech-stack.md` (modalidad elegida, punto abierto resuelto, scripts nuevos).

## 5. Pruebas
5.1 Test del seed de producción (solo plataformas/categorías, idempotente).
5.2 Test (o comprobación en CI local) de que `package.json` define `engines`, `db:deploy` y `start` con puerto.
5.3 `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` limpio.
