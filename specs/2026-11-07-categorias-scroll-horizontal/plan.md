# Plan — Categorías con scroll horizontal (Fase 16)

## 1. Base de datos
1.1 Sin cambios (se reutilizan `getCategories` y `getProducts` con `categorySlug`).

## 2. Componentes
2.1 Crear `components/ProductCardCompact.tsx` (Server Component): `<article>` de ancho fijo con `shrink-0 snap-start`, degradado, categoría, título (`line-clamp-2`), plataforma, precio + moneda y enlace "Ver producto" a `/productos/[slug]`.
2.2 Añadir en `lib/search-params.ts` (o `lib/home-href.ts`) un helper `buildHomeCategoryHref(slug?: string)` → `/#categorias` o `/?categoria=<slug>#categorias`, con pruebas.
2.3 Reescribir `components/Categories.tsx`: recibe `categoriaActiva?: string`; carga categorías y productos (`getProducts({ categorySlug, pageSize: 12 })`) con try/catch; valida el slug contra las categorías cargadas (si no existe, "Todos").
2.4 Chips "Todos" + categorías como `<Link scroll={false}>` con `aria-current` en el activo.
2.5 Carrusel: `<ul>` con `flex gap-4 overflow-x-auto snap-x snap-mandatory`, tarjetas compactas y enlace final "Ver todos en el catálogo" (`buildProductsHref`).
2.6 Estado vacío: "Aún no hay productos en esta categoría."

## 3. Página y ruta
3.1 `app/page.tsx`: `Home` recibe `searchParams: Promise<...>`, lo parsea con `parseSearchParams` y pasa `categoria` a `<Categories />`.
3.2 Decidir `connection()` vs `Suspense` para `Categories` (fallback ligero tipo `FeaturedProducts`).
3.3 Revisar fondos Benefits → Categorías → Buscar para que la transición sea limpia.

## 4. Navegación
4.1 Confirmar que `/#categorias` (Hero, Navbar, Footer) sigue llevando a la sección y que `/?categoria=x#categorias` conserva la posición.
4.2 Probar `scroll={false}` con ancla en el navegador; ajustar si salta.

## 5. Pruebas
5.1 `ProductCardCompact.test.tsx`: título, categoría, plataforma, precio+moneda y enlace a `/productos/[slug]`.
5.2 `Categories.test.tsx` (mock de `@/lib/products`): chips "Todos" + categorías; activo con `aria-current`; slug inválido → "Todos"; llamada a `getProducts` con `categorySlug` y `pageSize: 12`; estado vacío; error de BD no rompe la página.
5.3 Prueba del helper de href.
5.4 `app/page.test.tsx`: adaptar a `Home` asíncrona con `searchParams` (render del resultado de `await Home({ searchParams })`); mantener los mocks y las aserciones existentes.
5.5 Marcar Fase 16 como `[x]` en `specs/roadmap.md` tras validar.
