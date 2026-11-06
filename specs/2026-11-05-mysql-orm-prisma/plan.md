# Plan — MySQL local + ORM configurado (Fase 5)

## 1. Entorno MySQL local
- Instalar MySQL con Homebrew, iniciar el servicio.
- Crear base de datos `emiskills` y usuario de desarrollo.

## 2. Instalación de Prisma
- Revisar docs actuales de Prisma y de Next.js 16 en `node_modules/next/dist/docs/`.
- Instalar `prisma` (dev) y `@prisma/client`; inicializar con provider `mysql`.
- Confirmar que `.env` está en `.gitignore`.

## 3. Variables de entorno
- Crear `.env.example` con `DATABASE_URL`.
- Crear `lib/env.ts` con esquema Zod (instalar `zod`) y mensajes claros.

## 4. Cliente y singleton
- `lib/db.ts`: instancia única de `PrismaClient` (reutilizada en dev/HMR).

## 5. Scripts npm
- Scripts de DB (p. ej. `db:generate`, `db:migrate`, `db:studio`, `db:check`).
- `scripts/db-check.ts`: verifica conexión y muestra OK/error claro.

## 6. Pruebas
- Test Vitest de integración: `SELECT 1` contra la DB local; se omite si no hay `DATABASE_URL`/DB.
- Test unitario de `lib/env.ts` (válido/ inválido).

## 7. Documentación
- Sección en `README.md`: instalar MySQL, crear DB, copiar `.env.example`, ejecutar `db:check`.
- Marcar Fase 5 como `[x]` en `specs/roadmap.md` tras validar.
