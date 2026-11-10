# Requisitos — Sincronización de productos Hotmart (Fase 25)

## Alcance

### Incluye
- **Migración de esquema** (`npm run db:migrate`): nuevas columnas en `products`:

| Columna | Tipo | Uso |
|---|---|---|
| `externalId` | `String? @unique @db.VarChar(50)` | ID del producto en Hotmart (clave de vinculación) |
| `externalUcode` | `String? @db.VarChar(50)` | `ucode` de Hotmart (necesario para leer ofertas) |
| `needsReview` | `Boolean @default(false)` | El producto sincronizado aún no tiene enlace de afiliado verificado |
| `syncedAt` | `DateTime?` | Última vez que la sync tocó el producto |

- **Servicio** `lib/hotmart/sync.ts` → `syncHotmartProducts()`: lee productos y ofertas con el cliente de la Fase 24 y los reconcilia con la base de datos. Devuelve un resumen tipado.
- **Disparadores:**
  - Botón **"Sincronizar con Hotmart"** en `/admin/productos` (Server Action con `verifySession()`), que muestra el resumen del resultado.
  - Script `npm run hotmart:sync` (misma lógica, salida en consola).
- **Visibilidad en el admin:** en la lista de productos, insignia "Hotmart" y "Revisar enlace" para los productos con `needsReview`.
- Marcar `needsReview = false` cuando el admin guarda un `affiliateUrl` distinto del enlace de oferta sincronizado desde `/admin/productos/[id]`.

### No incluye
- Webhooks ni actualización en tiempo real (Fases 26–27).
- Sincronización automática programada (cron).
- Descripciones, imágenes o categorías reales desde Hotmart (la API no las entrega): las completa el admin.
- Borrado de productos: la sync **nunca elimina**, solo desactiva.
- Cambios en las páginas públicas.

## Reglas de sincronización

| Situación | Acción |
|---|---|
| Producto de Hotmart `ACTIVE` sin vínculo en BD | **Crear** inactivo (`isActive=false`, `needsReview=true`) |
| Producto ya vinculado (`externalId`) | **Actualizar solo** `title`, `price`, `currency`, `externalUcode`, `syncedAt`. No toca slug, descripciones, imagen, categoría, idioma, `affiliateUrl` ni `isActive` (salvo la desactivación de abajo) |
| Vinculado, pero Hotmart lo devuelve con estado ≠ `ACTIVE` o ya no aparece en la lista | **Desactivar** (`isActive=false`); nunca se reactiva solo |
| Producto sin oferta/precio, o con moneda fuera de `CURRENCIES` | **Omitir** y reportar el motivo (no se crea ni se modifica precio) |
| Producto manual (sin `externalId`) | Nunca se toca |

### Datos de un producto nuevo
- **Título:** `name` de Hotmart.
- **Slug:** `slugify(name)`; si ya existe, se añade `-<id de Hotmart>`.
- **Precio y moneda:** de la oferta principal (`isMain`), o la primera si ninguna lo es.
- **Plataforma:** `hotmart` (upsert, ya existe en el seed).
- **Categoría:** tabla fija por formato; el resto → categoría "Sin categoría" (`sin-categoria`, se crea si no existe):

| Hotmart | Categoría |
|---|---|
| `ONLINE_COURSE` | Curso (`curso`) |
| `EBOOK` | Ebook (`ebook`) |
| `TEMPLATES` | Plantilla (`plantilla`) |
| `COMMUNITY`, o `is_subscription = true` | Membresía (`membresia`) |
| cualquier otro | Sin categoría |

  Si el slug de destino no existe en la BD, se usa "Sin categoría".
- **Idioma:** `es` por defecto (Hotmart no lo informa); el admin lo corrige.
- **`shortDescription`:** texto neutro "Producto de Hotmart pendiente de revisión." (el producto está inactivo, no es visible).
- **`affiliateUrl`:** enlace de la oferta (`directOfferLink`). **Es el enlace del productor, no de afiliado.** Por eso el producto entra con `needsReview = true`.
- **Imagen:** sin imagen; degradado por defecto.

## Decisiones
- **Nuevos productos inactivos + "Revisar enlace":** nunca se publica un enlace sin comisión por error; coherente con "enlaces de afiliado transparentes" de la misión.
- **Bloqueo de activación:** mientras `needsReview` sea `true`, el admin no puede activar el producto (botón deshabilitado con explicación) hasta guardar su enlace de afiliado real.
- **Actualizar solo campos de Hotmart:** respeta el trabajo editorial del admin.
- **Desactivar, nunca borrar:** conserva clics históricos (FK `clicks.productId`) y evita pérdidas.
- **Un fallo no aborta la corrida:** cada producto se procesa en su propio `try/catch`; errores de auth/red de Hotmart sí detienen la sync antes de modificar nada (la lista se lee completa primero). Si la lista llega incompleta (error), **no** se desactiva nada.
- **Ofertas en serie** (una petición por producto) para respetar el límite de tasa; el cliente ya reintenta ante 429.
- **Exclusión mutua:** un candado en memoria evita dos sincronizaciones simultáneas en el mismo proceso (respuesta "ya hay una sincronización en curso").
- **Idempotente:** ejecutar dos veces seguidas no crea duplicados ni cambios.
- **Revalidación:** tras sincronizar, `revalidatePath('/')` y `revalidatePath('/productos')` (solo afecta a productos activos).

## Contexto
- **Pila:** cliente `lib/hotmart/` (Fase 24), `lib/db.ts`, `lib/slug.ts`, `lib/product-options.ts`, patrón de acciones de `app/admin/(panel)/productos/actions.ts`, Zod en el límite del formulario/acción.
- **Resumen de resultado:** `{ created, updated, deactivated, unchanged, skipped: {id, name, reason}[], errors: {id, message}[] }`; mensajes en español, objetivos, sin secretos.
- **Script:** `tsx --conditions=react-server` (por `server-only`), usa la BD local (`DATABASE_URL` del `.env`).
- **Tono:** texto del admin sobrio y claro; avisar que el enlace sincronizado no es de afiliado. Nada visible al visitante cambia.
- **Puntos abiertos:** (1) confirmar con credenciales reales que `GET /products` devuelve los productos del propio productor y no los del afiliado (si el modelo de negocio es afiliado, puede requerir otro endpoint o flujo; revisar en la verificación manual); (2) host de token de sandbox heredado de la Fase 24.
