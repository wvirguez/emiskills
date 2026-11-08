# Plan — Pulido responsive/móvil y aviso de afiliados (Fase 17)

## 1. Base de datos
1.1 Sin cambios.

## 2. Componentes
2.1 Crear `components/AffiliateNotice.tsx` con el texto corto y el enlace `/#aviso-afiliados` (`next/link`).
2.2 `components/AffiliateDisclosure.tsx`: añadir `id="aviso-afiliados"`, mejorar legibilidad en móvil (padding horizontal, tamaño de texto) sin cambiar su mensaje salvo coherencia.
2.3 `components/ProductDetail.tsx`: sustituir el párrafo suelto por `<AffiliateNotice />` y mantener la nota de moneda de origen.
2.4 Revisar el texto de divulgación de `components/Footer.tsx` para que no contradiga el aviso.

## 3. Página y ruta
3.1 Landing (`app/page.tsx` o `FeaturedProducts`): colocar `<AffiliateNotice />` junto a los productos.
3.2 `/productos` (`app/productos/page.tsx` / `SearchResults`): colocar `<AffiliateNotice />` sobre los resultados.
3.3 Auditoría responsive a 375, 768 y 1024 px de landing, `/productos`, detalle, Navbar y Footer; anotar hallazgos.
3.4 Corregir los hallazgos con clases de Tailwind (desbordes, objetivos táctiles ≥ 44 px, texto pequeño, espaciados, carrusel, franja de beneficios).

## 4. Navegación
4.1 Verificar que el enlace "Más información" lleva a `#aviso-afiliados` desde la landing y desde otras páginas.
4.2 Verificar el menú móvil de la Navbar (apertura, cierre, enlaces, objetivos táctiles).

## 5. Pruebas
5.1 `AffiliateNotice.test.tsx`: muestra "Aviso de afiliado", la mención de comisión y el enlace a `/#aviso-afiliados`.
5.2 Ajustar `ProductDetail.test.tsx`, `SearchResults.test.tsx`/`app/productos/page.test.tsx` y `app/page.test.tsx` para afirmar el aviso corto.
5.3 `AffiliateDisclosure`: prueba del `id="aviso-afiliados"`.
5.4 Marcar Fase 17 como `[x]` en `specs/roadmap.md` tras validar.
