# Validación — Franja de beneficios (Fase 15)

## Automatizada
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- `Benefits.test.tsx` afirma los 4 títulos (Alta Calidad, Acceso Instantáneo, Pago Seguro, Gran Apoyo) y sus 4 descripciones exactas.
- `Benefits.test.tsx` afirma que existe la región con nombre "Beneficios".
- `app/page.test.tsx` afirma que la franja se renderiza en la landing.

## Manual
Con `npm run build && npm start`:
- Home: la franja aparece justo bajo el Hero, con 4 beneficios, ícono, título y descripción.
- Escritorio (≥1024 px): 4 columnas en una fila; tablet/móvil: 2×2 sin desbordes a ~375 px.
- Estilo coherente con el resto de la landing (violeta, bordes redondeados).
- Transición de fondo Hero → franja → Categorías limpia.
- Anclas de Navbar/Footer siguen funcionando; sin errores en consola.

## Verificación del tono
- Los textos coinciden con los acordados. Se deja constancia de que "Premium", "inmediata", "encriptados" y "en cualquier momento" no están garantizados por nosotros (la venta ocurre en la plataforma del productor); revisar en la Fase 17.

## Definición de "terminado"
- `Benefits.tsx` creado, tipado, sin `any`, sin `"use client"` ni dependencias nuevas.
- Franja visible bajo el Hero en la landing.
- Comprobaciones automatizadas y manuales pasan.
- Fase 15 marcada `[x]` en `specs/roadmap.md`.
