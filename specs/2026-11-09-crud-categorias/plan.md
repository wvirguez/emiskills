# Plan — CRUD de categorías (Fase 21)

## 1. Base de datos / capa de datos
1.1 Sin cambios en Prisma ni migraciones.
1.2 `lib/slug.ts`: `slugify(name)` (minúsculas, normalización NFD sin tildes, `ñ`→`n`, solo `a-z0-9-`, sin guiones repetidos ni en los extremos, máx. 50). Tests: tildes, espacios, símbolos, nombre que queda vacío, truncado.
1.3 `lib/categories.ts` (`server-only`):
  - `listCategoriesWithCount()` → `{ id, slug, name, productCount }[]` ordenadas por nombre.
  - `getCategoryById(id)`.
  - `createCategory({ name })` (deriva el slug; error tipado si el slug existe — `P2002`).
  - `updateCategory(id, { name })` (no toca el slug).
  - `deleteCategory(id)` → resultado tipado: `ok` | `has-products` (con `count`) | `not-found` (captura `P2003`/`P2025`).
1.4 Tests con `lib/db` mockeado, en el estilo de `lib/products.test.ts` y `lib/clicks.test.ts`.

## 2. Componentes
2.1 Esquema Zod `categorySchema` (`name`: trim, 2–100) en `lib/categories.ts` o `app/admin/(panel)/categorias/schema.ts`.
2.2 `category-form.tsx` (`"use client"`, `useActionState`): campo nombre, vista previa del slug (solo en creación), error de campo y error general con `role="alert"`, botón con estado `pending`.
2.3 `delete-category-button.tsx`: confirmación en dos pasos (botón "Eliminar" → "Confirmar eliminación" / "Cancelar"); deshabilitado con texto explicativo si `productCount > 0`.
2.4 Tests de Testing Library para 2.2 y 2.3 (muestra errores, vista previa del slug, estado pendiente, botón bloqueado con productos).

## 3. Página y ruta
3.1 `app/admin/(panel)/categorias/actions.ts` (`"use server"`): `createCategoryAction`, `updateCategoryAction(id, …)` (con `bind`), `deleteCategoryAction(id)`. Cada una: `verifySession()` primero (si no hay sesión → `redirect('/admin/login')`) → Zod → `lib/categories` → `revalidatePath('/')` y `revalidatePath('/productos')` → `redirect('/admin/categorias')` en éxito.
3.2 `app/admin/(panel)/categorias/page.tsx`: lista (tabla en escritorio, tarjetas en móvil), estado vacío, enlace "Nueva categoría".
3.3 `app/admin/(panel)/categorias/nueva/page.tsx`: formulario de creación.
3.4 `app/admin/(panel)/categorias/[id]/page.tsx`: formulario de edición (`params` es una `Promise` en esta versión de Next); `notFound()` si el id no es un entero válido o no existe.
3.5 Mensaje de resultado tras redirigir (p. ej. `?ok=creada|editada|eliminada`) mostrado como aviso en la lista; validado contra una lista cerrada de valores.

## 4. Navegación
4.1 Tarjeta "Categorías" de `app/admin/(panel)/page.tsx`: pasa de "Próximamente" a enlace a `/admin/categorias`.
4.2 Enlace "← Volver a categorías" en las páginas de crear/editar; enlace "Panel" en la cabecera de la sección. Sin enlace público al admin.

## 5. Pruebas
5.1 Tests de las acciones: sin sesión → redirige a login y no toca la BD; datos inválidos → error; slug duplicado → error de campo; borrado con productos → bloqueado; éxito → `revalidatePath` + `redirect`.
5.2 Test de la página de lista (render con categorías y estado vacío) y de `[id]` (`notFound`).
5.3 Actualizar el test de la página del panel si existe (tarjeta Categorías como enlace).
5.4 Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5.5 Marcar la Fase 21 como `[x]` en `specs/roadmap.md` y actualizar `CHANGELOG.md`.
