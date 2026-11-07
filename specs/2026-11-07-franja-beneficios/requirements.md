# Requisitos — Franja de beneficios (Fase 15)

## Alcance

### Incluye
- Nuevo componente `components/Benefits.tsx` (Server Component, sin `"use client"`): franja horizontal con 4 beneficios, colocada en `app/page.tsx` justo debajo de `<Hero />` y antes de `<Categories />`.
- Cada beneficio muestra ícono (react-icons, ya instalado), título y descripción.
- Prueba `components/Benefits.test.tsx` y ajuste de `app/page.test.tsx`.

### No incluye
- Interactividad, animaciones, enlaces o imágenes.
- Dependencias nuevas.
- Cambios en otras secciones (salvo ajuste de fondo si la transición Hero → franja lo exige).

### Datos (constante tipada dentro del componente)
| Título | Descripción | Ícono sugerido |
|---|---|---|
| Alta Calidad | Productos Premium y útiles | `FiAward` / `FaStar` |
| Acceso Instantáneo | Descarga inmediata después de comprar | `FiZap` / `FaBolt` |
| Pago Seguro | Pagos seguros y encriptados | `FiLock` / `FaLock` |
| Gran Apoyo | Estamos aquí para ayudarte en cualquier momento | `FiHeadphones` / `FaHeadset` |

Usar la familia de react-icons que ya se use en el proyecto (verificar imports existentes).

## Decisiones
- **Ubicación:** justo bajo el Hero (decisión del usuario).
- **Contenido:** ícono + título + descripción (decisión del usuario).
- **Textos del roadmap tal cual** (decisión del usuario), sin matizar con la plataforma del productor.
- **Layout:** 4 columnas en escritorio (`lg`), 2×2 en móvil/tablet; estilo violeta existente.

## Contexto
- **Riesgo de tono (para el usuario):** la misión indica que la venta y la entrega ocurren en la plataforma del productor y pide no exagerar ("Premium", "en cualquier momento", "encriptados", "inmediata" son afirmaciones que no controlamos). Se implementan los textos acordados; queda como punto abierto reformularlos en la Fase 17 (pulido y divulgación) si se quiere alinear con la misión.
- **Stack:** Next.js 16 App Router (leer `node_modules/next/dist/docs/` si se toca algo de framework), React 19, Tailwind 4, TypeScript estricto sin `any`.
- **Patrones a seguir:** `HowItWorks.tsx` (tarjetas `rounded-2xl`, `bg-violet-50`, `border-violet-200`, contenedor `max-w-7xl px-4 sm:px-6 lg:px-8`).
- **Accesibilidad:** íconos decorativos con `aria-hidden="true"`; la franja como `<section aria-label="Beneficios">`; títulos como `<h3>` o `<p>` según jerarquía (la franja no lleva `<h2>` visible).
- **Interfaz solo en español.**
