# Requisitos — MySQL local + ORM configurado (Fase 5)

## Alcance
- Instalar y configurar **Prisma** (provider `mysql`) con cliente tipado.
- MySQL **nativo vía Homebrew** para desarrollo local (sin Docker Compose).
- `.env.example` documentado y validación de variables con **Zod** (`DATABASE_URL`).
- Singleton del cliente Prisma (`lib/db.ts`) seguro frente a HMR en desarrollo.
- Scripts npm de base de datos y script de verificación de conexión.
- Sección en `README.md` para levantar la base de datos local.

## Fuera de alcance
- Modelos `Product`, `Category`, `Platform`, migración inicial y seed (Fase 6).
- Capa de consultas (Fase 7) y despliegue/MySQL remoto en Hostinger (Fases 25-26).

## Decisiones
- **ORM:** Prisma (según `specs/tech-stack.md`); validar compatibilidad con Next 16.2 y la versión de MySQL instalada.
- **MySQL:** instalación nativa con Homebrew; se documenta en el README, sin `docker-compose.yml`.
- **Validación:** `lib/env.ts` con Zod; falla con mensaje claro si falta o es inválida `DATABASE_URL`.
- **Secretos:** `.env` fuera de git; solo `.env.example` versionado.
- **Rama:** `fase-5-mysql-orm`.
- TypeScript estricto, sin `any`.

## Contexto
- Next.js 16.2 con cambios incompatibles: leer `node_modules/next/dist/docs/` antes de codificar.
- Consultar la documentación vigente de Prisma (ctx7) para versión, generador y configuración.
- Posible punto abierto: versión de MySQL de Hostinger vs. local (ver `specs/tech-stack.md`).
