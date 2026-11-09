# Requisitos — CRUD de productos manuales (Fase 22)

## Alcance

### Incluido
- Sección `/admin/productos` dentro del panel protegido (grupo `(panel)`):
  - **Listar** productos (título, categoría, plataforma, precio, estado activo/inactivo, nº de clics).
  - **Crear** (`/admin/productos/nuevo`), **editar** (`/admin/productos/[id]`), **activar/desactivar** y **eliminar**.
- Validación con Zod en el límite (Server Actions) y mensajes de error en español.
- Verificación de sesión **dentro de cada Server Action** (no basta con proteger la página).
- Refresco de las páginas públicas afectadas tras cada mutación: `/`, `/productos` y `/productos/[slug]`.
- Activar la tarjeta "Productos" del panel (`/admin`) como enlace a la nueva sección.

### Excluido
- Cambios en `prisma/schema.prisma` y migraciones.
- Subida de archivos de imagen.
- CRUD de plataformas (se eligen entre las existentes).
- Edición de productos sincronizados desde Hotmart (Fases 24–27); aquí solo se gestionan los manuales.
- Métricas de clics (Fase 23); solo se muestra el conteo en la lista.
- Paginación y búsqueda en la lista (volumen bajo en v1.0).

### Datos
| Campo | Tipo | Regla |
|---|---|---|
| `title` | string | Obligatorio, `trim`, 3–200 caracteres. |
| `slug` | string | Generado del título al **crear** (`slugify`, máx. 150 en BD). Único. **Inmutable al editar.** |
| `shortDescription` | string | Obligatoria, `trim`, 10–300 caracteres (se muestra en tarjetas). |
| `description` | string | Opcional, máx. 5000 caracteres; vacío → `null`. Texto plano. |
| `price` | decimal | Obligatorio, ≥ 0, máx. 2 decimales, < 100 000 000 (`Decimal(10,2)`). 0 = gratuito. |
| `currency` | string | Código ISO de 3 letras en mayúsculas, de una lista cerrada (USD, EUR, MXN, COP, ARS, CLP, PEN, BRL). |
| `language` | string | 2 letras minúsculas, lista cerrada (es, en, pt). Por defecto `es`. |
| `imageUrl` | string | Opcional; si se indica, URL `https://` válida, máx. 500; vacío → `null`. |
| `imageGradient` | string | Opcional; uno de un conjunto cerrado de degradados predefinidos (clases Tailwind). Vacío → `null` (degradado por defecto de la tarjeta). |
| `affiliateUrl` | string | Obligatoria, URL `https://` válida, máx. 500. |
| `categoryId` | int | Obligatorio, debe existir. |
| `platformId` | int | Obligatorio, debe existir (select de plataformas existentes). |
| `isActive` | boolean | Por defecto `true`; los inactivos no aparecen en la web pública. |

## Decisiones
| Decisión | Motivo |
|---|---|
| CRUD completo sin cambios de esquema | Alcance de una sesión; el modelo `Product` ya tiene todos los campos. |
| Slug generado del título (vista previa en creación) e inmutable al editar | Mismo patrón que categorías (Fase 21); evita romper `/productos/[slug]` y `/go/[slug]` ya compartidos. Se reutiliza `lib/slug.ts`. |
| Colisión de slug → error de campo ("Ya existe un producto con ese título"), sin sufijos automáticos | Coherente con la Fase 21. |
| Plataforma elegida de un `<select>` de las existentes | No se crea lógica de plataformas; evita duplicados por typos. |
| Desactivar como alternativa al borrado | Los productos con clics no se pueden borrar (FK restrictiva sobre `Click`): se bloquea el borrado, se informa del nº de clics y se sugiere desactivar. Se captura `P2003` por si hay una carrera. Así se conservan las métricas. |
| Borrado con confirmación en dos pasos | Evita borrados accidentales; funciona sin JavaScript (mismo enfoque que categorías). |
| Imagen: URL `https` + degradado opcional, sin subida de archivos | Sin dependencias ni almacenamiento nuevo; el disco de Hostinger puede ser efímero. |
| Degradados de una lista cerrada | Tailwind solo genera clases detectables en el código fuente; una cadena libre no produciría estilos. La lista vive en una constante tipada compartida por el formulario, el esquema Zod y las tarjetas. |
| Solo `https` en `affiliateUrl` e `imageUrl` | Evita esquemas peligrosos (`javascript:`, `data:`) y contenido mixto; es una redirección saliente de confianza. |
| Páginas separadas + Server Actions | Mismo patrón que login y categorías (`useActionState`, `actions.ts`); sin API REST. |

## Contexto
- **Stack:** Next.js 16 App Router (leer `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `authentication.md` y `03-api-reference/04-functions/revalidatePath.md` antes de codificar), Prisma 7 vía `lib/db.ts`, Zod, Vitest + Testing Library. `Decimal` de Prisma: convertir a string/número en el límite para no pasar objetos no serializables a Client Components.
- **Server Components por defecto**; `"use client"` solo en el formulario (`useActionState`) y el botón de borrado.
- **Patrones a seguir:** `app/admin/(panel)/categorias/` (actions, formulario, botón de borrado, avisos `?ok=`), `verifySession()` de `lib/auth/session.ts`, `lib/slug.ts`, módulo de escritura separado `lib/admin-products.ts` (`server-only`) para no mezclar con las consultas públicas de `lib/products.ts`.
- **Interfaz solo en español**, responsive y móvil primero (tabla → tarjetas apiladas en pantallas pequeñas; formulario en una columna).
- **Tono:** texto de la interfaz claro y neutral; mensajes de error concretos y accionables. Textos de ayuda recuerdan los principios de la misión: descripciones objetivas, sin falsas urgencias ni reseñas inventadas.
- **Sin dependencias nuevas.**
