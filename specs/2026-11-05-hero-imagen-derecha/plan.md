# Plan — Hero: nueva imagen derecha (Fase 2)

## 1. Preparación
- [x] Leer la guía relevante en `node_modules/next/dist/docs/`.
- [x] Confirmar rama `fase-02-hero-imagen-derecha`.

## 2. Ilustración
- [x] Crear `components/HeroIllustration.tsx` con SVG de tarjetas de producto (curso, ebook, plantilla) en paleta violet/fuchsia.
- [x] Marcarla `aria-hidden="true"`; sin texto con cifras ni marcas.

## 3. Integración en el Hero
- [x] En `components/Hero.tsx`, sustituir el avatar placeholder dentro del círculo por `<HeroIllustration />`.
- [x] Ajustar posición de los badges flotantes si se solapan.
- [x] No tocar el contenido de la columna izquierda.

## 4. Responsive
- [x] Verificar a 360 px, 768 px y 1280 px: sin scroll horizontal y la ilustración escala bien.

## 5. Validación y cierre
- [x] Ejecutar la checklist de `validation.md`.
- [x] Marcar Fase 2 como `[x]` en `specs/roadmap.md` y actualizar `TODO.md`.
