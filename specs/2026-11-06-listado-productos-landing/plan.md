# Plan — Listado de productos en la landing (Fase 8)

## 1. Base de datos
1.1 Sin cambios de esquema ni migraciones.
1.2 Confirmar que el seed local tiene 6 productos activos (`npm run db:seed`).

## 2. Componentes
2.1 Crear `components/ProductCard.tsx` (Server Component): recibe un `ProductDTO` y muestra degradado, badge de categoría, título, descripción corta (2 líneas), plataforma, precio + moneda y enlace "Ver producto" a `/productos/[slug]`.
2.2 Reescribir `components/FeaturedProducts.tsx` como componente `async`: llama a `getProducts({ pageSize: 6 })` dentro de `try/catch`, forzando lectura por petición (ver requirements).
2.3 Encabezado: "Productos destacados" y subtítulo neutro; eliminar "(productos de ejemplo)".
2.4 Estado vacío: mensaje honesto ("Aún no hay productos disponibles. Vuelve pronto.") cuando `items` está vacío o hay error.
2.5 Quitar el import de `@/data/sample-products` de la UI (el archivo se conserva para el seed).

## 3. Página y ruta
3.1 `app/page.tsx`: envolver `<FeaturedProducts />` en `<Suspense>` con un fallback ligero (esqueleto de la sección) si se usa `connection()`.
3.2 Ejecutar `npm run build` y comprobar que la landing no queda congelada con datos del build.

## 4. Navegación
4.1 El enlace de cada tarjeta apunta a `/productos/[slug]` (la ruta llega en la Fase 9; 404 temporal aceptado).
4.2 No modificar `Navbar` ni anclas existentes.

## 5. Pruebas
5.1 `components/ProductCard.test.tsx`: muestra título, descripción, categoría, plataforma, `29.00 USD`; el enlace tiene `href="/productos/<slug>"`; con `imageGradient: null` usa el degradado por defecto; no aparece `affiliateUrl`.
5.2 `components/FeaturedProducts.test.tsx` (mock de `@/lib/products`): renderiza una tarjeta por producto; llama a `getProducts` con `{ pageSize: 6 }`; con `items: []` muestra el estado vacío; con `getProducts` rechazado muestra el estado vacío sin lanzar; no contiene "ejemplo".
5.3 Marcar Fase 8 como `[x]` en `specs/roadmap.md` tras validar.
