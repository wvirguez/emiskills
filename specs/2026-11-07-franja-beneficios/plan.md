# Plan — Franja de beneficios (Fase 15)

## 1. Base de datos
1.1 Sin cambios.

## 2. Componentes
2.1 Crear `components/Benefits.tsx` con un arreglo tipado `{ title, description, Icon }[]` de 4 elementos.
2.2 Marcado: `<section aria-label="Beneficios">` con grid `grid-cols-2 lg:grid-cols-4 gap-4`; cada ítem con ícono en círculo violeta (`aria-hidden`), título y descripción.
2.3 Verificar que los textos coinciden exactamente con la tabla de `requirements.md`.

## 3. Página y ruta
3.1 `app/page.tsx`: importar `Benefits` y renderizarlo entre `<Hero />` y `<Categories />`.
3.2 Revisar fondos Hero → Benefits → Categories; ajustar solo si la transición es brusca.

## 4. Navegación
4.1 Sin enlaces nuevos; confirmar que las anclas `#productos`, `#categorias`, `#buscar`, `#como-funciona` siguen funcionando.

## 5. Pruebas
5.1 `components/Benefits.test.tsx`: renderiza los 4 títulos y 4 descripciones; la región "Beneficios" existe; los íconos son `aria-hidden`.
5.2 `app/page.test.tsx`: afirmar que la landing incluye la región "Beneficios" y que aparece después del Hero y antes de Categorías.
5.3 Marcar Fase 15 como `[x]` en `specs/roadmap.md` tras validar.
