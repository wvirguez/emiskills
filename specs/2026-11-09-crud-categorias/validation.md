# Validación — CRUD de categorías (Fase 21)

## Automatizado
- `npm test` pasa, con aserciones específicas:
  - `slugify("Diseño Gráfico & UX")` → `"diseno-grafico-ux"`; un nombre solo de símbolos produce cadena vacía y la acción lo rechaza.
  - `createCategory` genera el slug del nombre y devuelve error tipado ante `P2002`.
  - `updateCategory` cambia `name` y **no** envía `slug` a Prisma.
  - `deleteCategory` devuelve `has-products` con el conteo cuando hay productos y no llama a `delete`; captura `P2003`.
  - Cada Server Action sin sesión redirige a `/admin/login` y **no** invoca `lib/categories`.
  - Con éxito, las acciones llaman `revalidatePath('/')` y `revalidatePath('/productos')` y redirigen a `/admin/categorias`.
  - `CategoryForm` muestra el error devuelto con `role="alert"` y la vista previa del slug; el botón de borrar está deshabilitado con productos asociados.
  - La página `[id]` llama `notFound()` para ids no numéricos o inexistentes.
- `npm run lint` sin errores ni advertencias nuevas.
- `npx tsc --noEmit` sin errores (sin `any`).
- `npm run build` compila e incluye las rutas `/admin/categorias`, `/admin/categorias/nueva` y `/admin/categorias/[id]`.

## Manual (navegador, MySQL local, `npm run dev`)
1. Sin sesión, abrir `/admin/categorias` → redirige a `/admin/login`.
2. Iniciar sesión → tarjeta "Categorías" del panel enlaza a la lista con nombre, slug y nº de productos (coinciden con los datos del seed).
3. Crear "Marketing Digital" → aparece en la lista con slug `marketing-digital`; también en la landing (sección Categorías) y en el filtro de `/productos`.
4. Intentar crear otra con el mismo nombre (o "marketing  digital") → error "Ya existe una categoría con ese nombre", sin duplicar.
5. Nombre vacío, de 1 carácter o de más de 100 → error de validación en español, sin perder lo escrito.
6. Editar el nombre → se actualiza en lista y en la web pública; el slug no cambia y el enlace `/productos?categoria=<slug>` sigue funcionando.
7. Eliminar una categoría **sin** productos (con confirmación) → desaparece de lista y de la web pública. Cancelar la confirmación no borra nada.
8. Una categoría **con** productos: el borrado está bloqueado y el mensaje indica cuántos productos tiene.
9. `/admin/categorias/abc` y `/admin/categorias/99999` → página 404.
10. Cerrar sesión y reenviar una acción (p. ej. con la pestaña vieja abierta) → no modifica datos y lleva al login.
11. Móvil (~375 px): la lista se ve como tarjetas legibles, los botones son táctiles y no hay scroll horizontal.
12. Consola del navegador y terminal del servidor sin errores.

## Verificación del tono
- Todo el texto visible está en español, neutral y concreto (sin mayúsculas gritadas ni jerga).
- Los mensajes de error dicen qué ocurrió y qué hacer ("Esta categoría tiene 3 productos. Muévelos o elimínalos antes de borrarla.").
- No aparecen textos comerciales ni promesas; es una pantalla interna.

## Definición de "terminado"
- Todas las comprobaciones automatizadas y manuales anteriores pasan.
- Sin cambios en `prisma/schema.prisma` ni migraciones nuevas; sin dependencias nuevas.
- Las rutas `/admin/categorias/**` exigen sesión tanto en la página como dentro de cada acción.
- Fase 21 marcada `[x]` en `specs/roadmap.md` y entrada añadida a `CHANGELOG.md`.
