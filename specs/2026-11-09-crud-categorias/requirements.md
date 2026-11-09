# Requisitos — CRUD de categorías (Fase 21)

## Alcance

### Incluido
- Sección `/admin/categorias` dentro del panel protegido (grupo `(panel)`):
  - **Listar** categorías con nombre, slug y número de productos asociados.
  - **Crear** (`/admin/categorias/nueva`), **editar** (`/admin/categorias/[id]`) y **eliminar** categorías.
- Validación con Zod en el límite (Server Actions) y mensajes de error en español.
- Verificación de sesión **dentro de cada Server Action** (no basta con proteger la página).
- Refresco de las páginas públicas que muestran categorías (`/` y `/productos`) tras cada mutación.
- Activar la tarjeta "Categorías" del panel (`/admin`) como enlace a la nueva sección.

### Excluido
- Cambios en `prisma/schema.prisma` y migraciones (`Category` sigue con `id`, `slug`, `name`).
- Orden manual, descripción o ícono de categoría.
- CRUD de productos (Fase 22) y métricas (Fase 23).
- Paginación o búsqueda en la lista (el volumen de categorías es bajo).

### Datos
| Campo | Tipo | Regla |
|---|---|---|
| `name` | string | Obligatorio, recortado (`trim`), 2–100 caracteres. Único sin distinguir mayúsculas (se valida por el `slug` derivado). |
| `slug` | string | Se genera del nombre al **crear**: minúsculas, sin tildes, `a-z0-9` y guiones, máx. 50 caracteres. Único (restricción de BD). **Inmutable al editar.** |

## Decisiones
| Decisión | Motivo |
|---|---|
| CRUD mínimo sin cambios de esquema | Alcance de una sesión; el catálogo público ya funciona con `slug` y `name`. |
| Slug generado del nombre, mostrado como vista previa en el formulario de creación | Evita errores de tipeo y mantiene URLs consistentes (`/productos?categoria=<slug>`). |
| Slug inmutable al editar | Cambiarlo rompería enlaces ya compartidos y filtros guardados. Editar solo cambia `name`. |
| Bloquear el borrado si hay productos asociados | `Product.categoryId` es obligatorio y la FK es restrictiva; se informa al admin cuántos productos hay y se le pide moverlos o eliminarlos antes (Fase 22). Además se captura el error `P2003` por si hay una carrera. |
| Páginas separadas + Server Actions | Mismo patrón que el login (`useActionState` + acciones en `actions.ts`); sin API REST. |
| Borrado con confirmación | Formulario independiente con paso de confirmación (`<details>` o botón en dos pasos) para evitar borrados accidentales; funciona sin JavaScript. |
| Colisión de slug | Si el slug derivado ya existe, se devuelve error de campo ("Ya existe una categoría con ese nombre"); no se añaden sufijos numéricos automáticos. |

## Contexto
- **Stack:** Next.js 16 App Router (leer `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `authentication.md` y `03-api-reference/04-functions/revalidatePath.md` antes de codificar), Prisma 7 vía `lib/db.ts`, Zod, Vitest + Testing Library.
- **Server Components por defecto**; `"use client"` solo en los formularios (`useActionState`) y el botón de borrado si hace falta.
- **Patrones a seguir:** `app/admin/login/actions.ts` (estado `{ error }`, Zod `safeParse`), `login-form.tsx` (errores con `role="alert"`, `pending`), `verifySession()` de `lib/auth/session.ts`, estilo Tailwind del panel (tarjetas blancas, `border-gray-200`, botón azul).
- **Capa de datos:** `getCategories()` en `lib/products.ts` ya sirve a la parte pública; las operaciones de escritura y el conteo de productos van en un módulo nuevo `lib/categories.ts` para no mezclar lectura pública con mutaciones de admin.
- **Interfaz solo en español**, responsive y móvil primero (tabla → tarjetas apiladas en pantallas pequeñas).
- **Tono:** texto de la interfaz claro y neutral, sin jerga; mensajes de error concretos y accionables.
- **Sin dependencias nuevas.**
