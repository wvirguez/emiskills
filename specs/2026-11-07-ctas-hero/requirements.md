# Requisitos — CTAs del Hero (Fase 12)

## Alcance

### Incluye
| Botón | Antes | Después | Destino (`href`) |
|---|---|---|---|
| Primario (relleno) | "Obten una Propuesta" → `#productos` | **COMPRAR AHORA** | `/productos` |
| Secundario (borde) | "Intentalo Ahora!" → `#como-funciona` | **VER CATEGORÍAS** | `/#categorias` |

- Actualizar `components/Hero.tsx` (textos y `href`).
- Actualizar `components/Hero.test.tsx`: verificar ambos textos y sus `href`.
- Enlaces relacionados con anclas sueltas (sin `/`), que solo funcionan en la landing:
  - `components/Footer.tsx` (aparece en todas las páginas vía `app/layout.tsx`): `#productos`, `#categorias`, `#buscar`, `#como-funciona` → `/#productos`, `/#categorias`, `/#buscar`, `/#como-funciona`.
  - `components/FinalCTA.tsx` ("Ver productos"): `#productos` → `/productos`, coherente con el nuevo CTA primario.
- Navbar ya usa `/#...` y `/productos`; solo se verifica, no se modifica.

### No incluye
- Cambios de estilo, estructura o imagen del Hero.
- Cambiar el mensaje del h1 ni el párrafo.
- Nota adicional bajo los botones.
- Cambios en la sección Categorías (Fase 16) ni en el resto de la landing.

## Decisiones
- **Texto literal en mayúsculas** en el JSX ("COMPRAR AHORA", "VER CATEGORÍAS"), sin depender de `uppercase` de CSS; así los tests y los lectores de pantalla ven el mismo texto.
- **`COMPRAR AHORA` → `/productos`** (catálogo completo) en lugar del ancla `#productos`; es la ruta donde el visitante puede buscar y filtrar. La compra en sí ocurre en la plataforma del productor y el aviso de afiliados ya está visible en la página.
- **`VER CATEGORÍAS` → `/#categorias`** (ruta absoluta con ancla) para que funcione igual desde cualquier página.
- **Footer y FinalCTA** se ajustan porque el Footer se muestra también en `/productos` y en la ficha, donde las anclas sueltas no llevan a ninguna parte.

## Contexto
- **Tono:** las mayúsculas son el texto pedido por el usuario; no se añaden promesas ni urgencia ("ahora" aquí es llamada a la acción, sin "oferta limitada" ni similares).
- **Stack:** Next.js 16 App Router, `next/link`, Server Components; sin dependencias nuevas ni `"use client"`.
- **Patrones:** `Hero.test.tsx` (smoke test con Testing Library) y los enlaces `/#...` de `Navbar.tsx`.
- **Móvil:** el texto más largo ("VER CATEGORÍAS") no debe desbordar a ~375 px; los botones ya se apilan en `flex-col`.
