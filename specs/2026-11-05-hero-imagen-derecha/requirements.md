# Requisitos — Hero: nueva imagen derecha (Fase 2)

## Contexto
`components/Hero.tsx` muestra a la derecha un círculo con un avatar placeholder (icono de persona) y dos badges flotantes. La misión pide mantener el estilo visual y ser responsive, con una web ligera para móvil en LATAM.

## Alcance
- Reemplazar el avatar placeholder del lado derecho por una **ilustración SVG propia**: composición de tarjetas de productos digitales (curso, ebook, plantilla).
- Mantener intacto el mensaje de la izquierda (título, párrafo, botones).
- Conservar el círculo degradado, los anillos decorativos y los badges flotantes salvo que choquen con la ilustración.

## Fuera de alcance
- Cambios de texto, layout general del Hero o de otras secciones.
- Nuevas dependencias, fotos externas o `next/image` con archivos binarios.
- Tests automáticos (Vitest llega en la Fase 4).

## Decisiones
- Ilustración SVG inline (o componente `HeroIllustration`) con Tailwind y la paleta violet/fuchsia actual: sin peticiones de red extra.
- Sin cifras, logos de marcas ni reseñas inventadas (principio de honestidad).
- Decorativa: `aria-hidden="true"`, ya que el mensaje está en el texto.
- TypeScript estricto, sin `any`.

## Referencias
- `specs/mission.md`, `specs/tech-stack.md`
- Next.js tiene cambios incompatibles: consultar `node_modules/next/dist/docs/` antes de codificar.
