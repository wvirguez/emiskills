# Plan — Esquema inicial: Product, Category, Platform (Fase 6)

## 1. Base de datos
1.1. Revisar docs actuales de Prisma 7 (modelos, `Decimal` en MySQL, seed con `prisma.config.ts`).
1.2. Definir `Platform` y `Category` en `prisma/schema.prisma`.
1.3. Definir `Product` con relaciones, `@db.Decimal(10, 2)`, `@db.VarChar` donde aplique e índices.
1.4. Ejecutar `npm run db:migrate -- --name esquema_inicial` y revisar el SQL generado.
1.5. Regenerar el cliente (`npm run db:generate`).

## 2. Seed
2.1. Crear `prisma/seed.ts` usando el cliente de `lib/db.ts` (o su propia instancia con el adaptador MariaDB).
2.2. Cargar plataformas (`hotmart`, `manual`) y categorías (`curso`, `ebook`, `plantilla`, `membresia`) con `upsert`.
2.3. Mapear los 6 productos de `data/sample-products.ts` (categoría, plataforma normalizada, precio, moneda, gradiente, URL ficticia) con `upsert` por `slug`.
2.4. Registrar el comando en `prisma.config.ts` y añadir el script `db:seed`.

## 3. Componentes
- Ninguno. La landing sigue usando `data/sample-products.ts` hasta la Fase 8.

## 4. Página y ruta
- Ninguna.

## 5. Navegación
- Ninguna.

## 6. Pruebas
6.1. Test de integración (se omite si no hay `DATABASE_URL`/DB): tras el seed existen 2 plataformas, 4 categorías y 6 productos con sus relaciones.
6.2. Test de idempotencia: ejecutar el seed dos veces no cambia los conteos.
6.3. Test de restricciones: `slug` duplicado en `Product` lanza error de unicidad.

## 7. Documentación
7.1. Actualizar `README.md`: migrar y sembrar (`db:migrate`, `db:seed`).
7.2. Marcar la Fase 6 como `[x]` en `specs/roadmap.md` tras validar.
