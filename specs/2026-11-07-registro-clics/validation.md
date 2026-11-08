# Validación — Registro de clics (Fase 19)

## Automatizado
- `npm test` pasa, con afirmaciones específicas:
  - `recordClick` llama a `db.click.create` con `productId` y `referer`; trunca a 500; guarda `null` sin referer; rechaza `productId` inválido.
  - `getAffiliateTargetBySlug` devuelve `{ id, affiliateUrl }` para activos y `null` para inactivos, inexistentes y slug inválido (sin consultar la BD).
  - La ruta `/go/[slug]` registra el clic solo en redirecciones 307 y sigue redirigiendo si `recordClick` lanza.
  - 404 (slug inexistente, inactivo, URL inválida) no registra clic.
- `npm run lint` y `npx tsc --noEmit` sin errores; `npm run build` correcto.
- `npx prisma migrate deploy` aplica la migración sin errores en el MySQL local.

## Manual
- Con `npm run dev`, abrir `/productos/<slug>` y pulsar el CTA de compra: redirige al enlace de afiliado.
- Verificar en MySQL: `SELECT productId, referer, createdAt FROM clicks ORDER BY id DESC LIMIT 5;` muestra el clic con el referer de la página de detalle.
- Visitar `/go/no-existe`: 404 y ninguna fila nueva.
- Acceso directo a `/go/<slug>` (sin referer): fila con `referer` NULL.
- Simular fallo (p. ej. detener temporalmente la tabla/renombrarla en local): la redirección sigue funcionando y se registra el error en consola.

## Tono
- Sin texto nuevo visible. Los logs son neutros, en español y sin datos personales.

## Definición de "terminado"
- Migración versionada y aplicada; `Click` registra cada redirección exitosa sin guardar IP ni user-agent.
- La redirección nunca falla por un error de registro.
- Todos los comandos automatizados pasan, la verificación manual está hecha y la Fase 19 está marcada `[x]` en el roadmap.
