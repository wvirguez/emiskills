# Plan — CRUD de productos manuales (Fase 22)

## 1. Base de datos / capa de datos
1.1 Sin cambios en Prisma ni migraciones.
1.2 `lib/product-options.ts`: constantes tipadas `CURRENCIES`, `LANGUAGES` y `GRADIENT_PRESETS` (valor = clases Tailwind completas y literales, etiqueta en español).
1.3 `lib/admin-products.ts` (`server-only`):
  - `listProductsForAdmin()` → título, slug, categoría, plataforma, precio (como string), `isActive`, `clickCount`; ordenados por `createdAt` desc.
  - `getProductForAdmin(id)`.
  - `listPlatforms()` (y reutilizar `getCategories()` de `lib/products.ts`) para los selects.
  - `createProduct(data)` (deriva slug; error tipado en `P2002`; error tipado si `categoryId`/`platformId` no existen — `P2003`).
  - `updateProduct(id, data)` (no toca el slug; `not-found` en `P2025`).
  - `setProductActive(id, isActive)`.
  - `deleteProduct(id)` → `ok` | `has-clicks` (con `count`) | `not-found` (captura `P2003`/`P2025`).
1.4 Tests con `lib/db` mockeado, en el estilo de `lib/categories.test.ts`.

## 2. Componentes
2.1 `productSchema` Zod en `app/admin/(panel)/productos/schema.ts`: reglas de la tabla de datos; `price` acepta coma o punto decimal y se normaliza; cadenas vacías opcionales → `null`; URLs solo `https:`.
2.2 `product-form.tsx` (`"use client"`, `useActionState`): todos los campos, vista previa del slug (solo en creación), selects de categoría/plataforma/moneda/idioma/degradado, error por campo y general con `role="alert"`, valores conservados tras error, botón con estado `pending`.
2.3 `delete-product-button.tsx`: confirmación en dos pasos; deshabilitado con texto explicativo si hay clics ("Tiene N clics registrados; desactívalo en su lugar").
2.4 `toggle-active-button.tsx`: formulario simple que activa/desactiva.
2.5 Tests de Testing Library para 2.2–2.4.

## 3. Página y ruta
3.1 `app/admin/(panel)/productos/actions.ts` (`"use server"`): `createProductAction`, `updateProductAction(id, …)`, `toggleProductActiveAction(id)`, `deleteProductAction(id)`. Cada una: `verifySession()` primero → Zod → `lib/admin-products` → `revalidatePath('/')`, `('/productos')` y `('/productos/[slug]', 'page')` → `redirect('/admin/productos?ok=…')`.
3.2 `app/admin/(panel)/productos/page.tsx`: lista (tabla en escritorio, tarjetas en móvil), insignia activo/inactivo, estado vacío, enlace "Nuevo producto".
3.3 `productos/nuevo/page.tsx`: formulario de creación (falla con mensaje claro si no hay categorías ni plataformas, con enlace a `/admin/categorias`).
3.4 `productos/[id]/page.tsx`: formulario de edición (`params` es `Promise`); `notFound()` si el id no es entero válido o no existe.
3.5 Aviso `?ok=creado|editado|activado|desactivado|eliminado` validado contra lista cerrada.

## 4. Navegación
4.1 Tarjeta "Productos" de `app/admin/(panel)/page.tsx`: de "Próximamente" a enlace a `/admin/productos`; actualizar `page.test.tsx`.
4.2 Enlace "← Volver a productos" en crear/editar; enlace "Panel" en la cabecera. Sin enlace público al admin.
4.3 Reutilizar `GRADIENT_PRESETS` en las tarjetas existentes solo si hace falta para que Tailwind detecte las clases (verificar en el build).

## 5. Pruebas
5.1 Acciones: sin sesión → redirige a login y no toca la BD; datos inválidos → errores por campo; slug duplicado → error de campo; URL no `https` rechazada; borrado con clics bloqueado; éxito → `revalidatePath` + `redirect`.
5.2 Páginas: lista (con datos y vacía) y `[id]` (`notFound`).
5.3 `productSchema`: precio con coma, 0, negativo, > 2 decimales, vacíos → `null`.
5.4 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.5 Marcar la Fase 22 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
