# Requisitos — Eliminar sección Partners (Fase 13)

## Alcance

### Incluye
- Quitar `<Partners />` y su import de `app/page.tsx`.
- Borrar `components/Partners.tsx` (no tiene tests ni assets propios: los logos son SVG en línea).
- Mover la información de origen al Footer: una línea breve bajo la descripción de marca en `components/Footer.tsx` que indique que el catálogo reúne productos de Hotmart y de otros productores.
- Añadir `app/page.test.tsx` (humo de la landing): ya no aparece el texto "Plataformas de origen de los productos" y siguen presentes las secciones con ancla `categorias`, `buscar`, `productos` y `como-funciona`.
- Ampliar `components/Footer.test.tsx` para verificar la nueva línea.

### No incluye
- Reemplazar la sección por otra (la franja de beneficios es la Fase 15).
- Logos ni imágenes de marca de las plataformas.
- Cambios en Hero, Categories ni otras secciones, salvo un ajuste de fondo si la alternancia visual lo exige.

## Decisiones
- **Solo se retira Partners** de la landing (decisión del usuario); no se rediseñan otras secciones.
- **El contenido se conserva en el Footer** como texto, sin logos: mantiene la transparencia sobre el origen de los productos (misión: "un catálogo, varias fuentes") sin ocupar espacio en la landing.
- **Sin assets que borrar:** `Partners.tsx` usa SVG en línea; basta con eliminar el archivo.
- **Verificación de fondos y enlaces:** tras quitar la franja (`from-violet-100 … to-violet-100`), el Hero (degradado violeta claro) queda seguido de Categorías (`bg-white`); se revisa visualmente que la transición sea limpia y que no queden anclas rotas.

## Contexto
- **Tono:** texto del Footer objetivo y sin promesas, p. ej. "Reunimos productos de Hotmart y de otros productores."
- **Stack:** Next.js 16 App Router, Server Components; sin dependencias nuevas.
- **Patrones:** `Footer.test.tsx` existente (Testing Library), `app/page.tsx` como composición de secciones.
- **Nota:** `Footer.tsx` está marcado `'use client'` sin necesitarlo; no se toca en esta fase.
