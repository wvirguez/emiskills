# Requisitos — Pulido responsive/móvil y aviso de afiliados (Fase 17)

## Alcance

### Incluye
**A. Aviso de divulgación de afiliados**
- Nuevo componente `components/AffiliateNotice.tsx` (Server Component): línea breve reutilizable, visible, con enlace al aviso completo (`/#aviso-afiliados`).
- Mostrarlo cerca del contenido de productos en: landing (junto a `FeaturedProducts`/carrusel), `/productos` (sobre los resultados) y detalle `/productos/[slug]` (sustituye el texto suelto actual bajo "Ir a la oferta", conservando la mención de la moneda de origen).
- Conservar `AffiliateDisclosure` (aviso completo) en la landing y darle `id="aviso-afiliados"`; revisar su legibilidad en móvil.
- Revisar el texto de divulgación del Footer para que sea coherente con el aviso (sin contradicciones).

**B. Pulido responsive/móvil**
- Auditoría a ~375, 768 y 1024 px de: landing (todas las secciones), `/productos` (buscador, filtros, chips, paginación), detalle, `Navbar` (menú móvil) y `Footer`.
- Corregir lo que falle: desbordes horizontales, objetivos táctiles < 44 px, texto < 14 px en contenido principal, espaciados, saltos de línea, carrusel de categorías y franja de beneficios.
- Las correcciones se limitan a clases de Tailwind/estructura; sin rediseños.

### No incluye
- Nuevas páginas/rutas (p. ej. `/afiliados`), ni cambios en datos, esquema o lógica de consultas.
- Dependencias nuevas, modo oscuro, rediseño visual.
- SEO, rendimiento y accesibilidad profundos (Fase 29).

### Texto del aviso corto (propuesto)
> **Aviso de afiliado:** si compras en la plataforma del productor, podemos recibir una comisión, sin costo extra para ti. [Más información](/#aviso-afiliados)

## Decisiones
- **Auditar todas las páginas** (decisión del usuario) y corregir; se registra en `validation.md` qué se encontró y arregló.
- **Aviso corto en landing, catálogo y detalle + aviso completo existente** (decisión del usuario): la divulgación queda visible donde se muestran productos, sin una ruta nueva.
- **Texto claro y objetivo** (decisión del usuario): somos afiliados, podemos recibir comisión, no afecta el precio ni el orden.
- **Afirmación sobre el orden:** el aviso completo y el Footer dicen "las comisiones no influyen en el orden". Hoy es cierto (el orden es por fecha de creación). Mantener solo mientras siga siéndolo; si cambia el orden, revisar el texto.
- **Enlace al aviso completo** vía ancla en la landing; desde otras páginas apunta a `/#aviso-afiliados`.

## Contexto
- **Tono:** honesto y objetivo; sin falsas urgencias ni promesas (ver `specs/mission.md`: "indicar claramente que somos afiliados").
- **Stack:** Next.js 16 App Router, React 19, Tailwind 4, TypeScript estricto sin `any`, Server Components, sin dependencias nuevas.
- **Patrones existentes:** `components/AffiliateDisclosure.tsx`, texto actual en `ProductDetail.tsx` (~línea 63) y `Footer.tsx` (~línea 73).
- **Móvil primero:** texto del aviso ≥ 12–14 px con contraste suficiente (`text-gray-600` sobre fondo claro); el aviso corto debe ser visible sin desplazarse en horizontal.
- **Pruebas:** Vitest + Testing Library; el responsive se verifica manualmente en el navegador (jsdom no calcula layout).
- **Interfaz solo en español.**
