# Validación — CRUD de productos manuales (Fase 22)

## Automatizado
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan (sin `any`). Aserciones específicas:
  - `productSchema`: `"19,99"` → `19.99`; `-1`, `1.999` y `"abc"` se rechazan; `0` es válido; `imageUrl`/`description` vacíos → `null`; `affiliateUrl` con `http://`, `javascript:` o sin esquema se rechaza.
  - `createProduct` genera el slug del título y devuelve error tipado ante `P2002`.
  - `updateProduct` **no** envía `slug` a Prisma.
  - `deleteProduct` devuelve `has-clicks` con el conteo y no llama a `delete` cuando hay clics; captura `P2003`.
  - Cada Server Action sin sesión redirige a `/admin/login` y **no** invoca `lib/admin-products`.
  - Con éxito, las acciones llaman `revalidatePath` para `/`, `/productos` y `/productos/[slug]` y redirigen a `/admin/productos`.
  - `ProductForm` muestra errores por campo con `role="alert"`, conserva los valores y muestra la vista previa del slug solo al crear.
  - El botón de borrar está deshabilitado con clics registrados.
  - La página `[id]` llama `notFound()` para ids no numéricos o inexistentes.
  - La tarjeta "Productos" del panel es un enlace a `/admin/productos`.
- `npm run build` compila e incluye `/admin/productos`, `/admin/productos/nuevo` y `/admin/productos/[id]`.

## Manual (navegador, MySQL local, `npm run dev`)
1. Sin sesión, abrir `/admin/productos` → redirige a `/admin/login`.
2. Con sesión, la tarjeta "Productos" lleva a la lista con los datos del seed (título, categoría, plataforma, precio, estado, clics).
3. Crear un producto completo → aparece en la lista; con `isActive` activo se ve en la landing, en `/productos` y en `/productos/<slug>`; el botón de compra usa `/go/<slug>` y redirige a la URL de afiliado.
4. El degradado elegido se ve en la tarjeta (las clases de Tailwind se generan en dev y en el build).
5. Imagen con URL `https` válida se muestra; una URL rota no rompe la tarjeta.
6. Título duplicado → "Ya existe un producto con ese título", sin duplicar.
7. Campos vacíos, precio negativo o con 3 decimales, URL `http://` → errores en español junto a cada campo, sin perder lo escrito.
8. Editar título/precio/descripción → se refleja en la web pública; el slug no cambia.
9. Desactivar un producto → desaparece de la landing, de `/productos` y su detalle devuelve 404; reactivar lo restaura.
10. Producto **sin** clics: eliminar con confirmación → desaparece; cancelar no borra.
11. Producto **con** clics (generarlos visitando `/go/<slug>`): borrado bloqueado con el mensaje del nº de clics; desactivar sigue disponible.
12. `/admin/productos/abc` y `/admin/productos/99999` → 404.
13. Cerrar sesión y reenviar una acción desde una pestaña vieja → no modifica datos y lleva al login.
14. Móvil (~375 px): lista como tarjetas, formulario en una columna, controles táctiles, sin scroll horizontal.
15. Consola del navegador y terminal del servidor sin errores.

## Verificación del tono
- Todo el texto visible en español, neutral y concreto; sin mayúsculas gritadas ni jerga.
- Errores accionables ("Esta URL debe empezar con https://", "Tiene 12 clics registrados; desactívalo en su lugar").
- Los textos de ayuda del formulario fomentan descripciones objetivas, sin falsas urgencias ni reseñas inventadas.

## Definición de "terminado"
- Todas las comprobaciones automatizadas y manuales pasan.
- Sin cambios en `prisma/schema.prisma` ni migraciones; sin dependencias nuevas.
- Las rutas `/admin/productos/**` exigen sesión tanto en la página como dentro de cada acción.
- Fase 22 marcada `[x]` en `specs/roadmap.md` y entrada añadida a `CHANGELOG.md`.
