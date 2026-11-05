# Requisitos — FrontPage como hub de productos digitales (Fase 1)

Rama: `fase-01-frontpage-hub-productos` · Roadmap: Bloque 0, Fase 1 (TODO.md · Ahora)

## Objetivo
Que la página de inicio se vea y se lea como un **hub profesional de productos digitales** (cursos, ebooks, manuales, plantillas, membresías de Hotmart y otros productores), alineado con `specs/mission.md`: curaduría honesta para hispanohablantes de LATAM, uso principal desde móvil.

## Alcance (incluido)
1. **Reenfoque de contenido y estructura** de la landing (`app/page.tsx` y componentes): pasar de "cursos/estudiantes" a "productos digitales".
2. **Hero:** conservar el mensaje de la izquierda (titular, párrafo, botones). Reemplazar las insignias flotantes inventadas ("1000+ Estudiantes", "120+ Cursos") por mensajes veraces sin cifras (p. ej. "Hotmart y otros productores", "Reseñas honestas").
3. **Partners:** quitar el bloque "Con la confianza de los líderes del sector" con logos de Apple/Microsoft (respaldo falso). Sustituir por una franja de plataformas de origen reales (Hotmart + "otros productores").
4. **Categorías:** nueva sección con tipos de producto (cursos, ebooks, plantillas, membresías, manuales).
5. **Búsqueda:** `SearchCourses` pasa a ser búsqueda de productos (textos y categorías); sigue siendo solo visual, sin lógica (llega en fases 10–11).
6. **Productos destacados:** `PopularCourses` pasa a productos destacados, usando datos de ejemplo **tipados en un archivo propio** (`data/sample-products.ts`) fáciles de reemplazar en la fase 8. Quitar valoraciones y conteo de "estudiantes" inventados; marcar claramente que son ejemplos.
7. **"Cómo funciona":** sección corta (explora → compara → compra en la plataforma del productor).
8. **FinalCTA:** quitar "1000+ Clientes Felices"; texto coherente con el hub.
9. **Aviso de afiliados** visible (en la landing y en el footer): somos afiliados y podemos recibir comisión sin costo extra para el comprador.
10. **Navbar y Footer:** actualizar etiquetas y enlaces a las secciones nuevas; eliminar anclas que apuntan a nada.

## Fuera de alcance
- Cambiar la imagen derecha del Hero → **Fase 2**.
- Base de datos, datos reales, buscador funcional, filtros → fases 5–11.
- Enlaces de afiliado reales y registro de clics → fases 13–14.
- Páginas internas (detalle, términos, privacidad): los enlaces sin destino se retiran o se dejan para su fase.

## Decisiones
- Sin cifras ni reseñas inventadas en ningún componente (honestidad, ver mission.md).
- Datos de ejemplo en un solo módulo tipado, con campo `source` (`"hotmart" | "manual"`) y `price` con `currency`, para encajar con el modelo de la Fase 6.
- Mantener estilo visual actual (violeta/fucsia, Tailwind 4) y diseño responsive mobile-first.
- Sin nuevas dependencias.
- Componentes en servidor por defecto; `"use client"` solo si hay interactividad real.
- Next.js 16 con cambios incompatibles: consultar `node_modules/next/dist/docs/` antes de tocar código de Next.

## Contexto
- Hoy: Hero, Partners, SearchCourses, PopularCourses, FinalCTA en `components/`; todo con textos y datos estáticos.
- `next.config.ts` aún tiene `output: 'export'` (no afecta esta fase).
