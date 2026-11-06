# Validación — Esquema inicial: Product, Category, Platform (Fase 6)

## Automatizada
- `npm test` pasa, incluyendo:
  - Tras el seed hay exactamente 2 plataformas, 4 categorías y 6 productos.
  - Cada producto tiene `category` y `platform` no nulas y `price` con 2 decimales.
  - Ejecutar el seed dos veces mantiene los mismos conteos.
  - Insertar un `Product` con `slug` repetido falla.
- `npx tsc --noEmit` sin errores (sin `any`).
- `npm run lint` limpio.
- `npm run db:migrate` aplica la migración sobre una base vacía sin errores y `npx prisma migrate status` indica que está al día.

## Manual
- `npm run db:seed` imprime un resumen sin errores; repetirlo no duplica filas.
- En `npm run db:studio` (o el cliente MySQL) se ven las tres tablas, sus claves foráneas e índices.
- Los precios aparecen con la moneda de origen y sin conversiones.
- Casos límite: ejecutar el seed sin `DATABASE_URL` muestra un mensaje claro (vía `lib/env.ts`); eliminar un producto no borra su categoría ni su plataforma.
- La landing (`npm run dev`) sigue viéndose igual: aún usa los datos de ejemplo.

## Verificación del tono
- Las descripciones sembradas son objetivas, sin falsas urgencias ni reseñas.
- El README aclara que las URLs de afiliado del seed son ficticias.

## Definición de "terminado"
- Migración inicial versionada en `prisma/migrations/` y aplicada en local.
- Seed idempotente funcionando con `npm run db:seed`.
- Todas las pruebas automatizadas pasan.
- README actualizado y Fase 6 marcada `[x]` en `specs/roadmap.md`.
