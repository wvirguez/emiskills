# Validación — Fase 29: Revisión de rendimiento, accesibilidad y seguridad

## Automatizado
- `npm test`, `npm run lint` y `npx tsc --noEmit` pasan; `npm run build` termina sin errores.
- Afirmaciones específicas (tests nuevos):
  - `nextConfig.headers()` devuelve para `/(.*)` `X-Content-Type-Options: nosniff`, `Referrer-Policy`, protección anti-frame y `Permissions-Policy`; HSTS solo con `NODE_ENV=production`.
  - La cookie `admin_session` es `httpOnly`, `sameSite=lax` y `secure` en producción.
  - El login rechaza (rate limit) tras exceder el límite configurado.
  - Cada Server Action del admin rechaza peticiones sin sesión válida.
  - Cada corrección de accesibilidad tiene un test por rol/nombre accesible (p. ej. botón del menú con `aria-expanded`, campos con `label`, errores con `role="alert"`).
- `npm audit --omit=dev`: sin vulnerabilidades altas/críticas sin justificar en el informe.

## Manual
- Lighthouse móvil sobre `next build && next start` en `/`, `/productos/` y `/productos/<slug>/`: Accesibilidad ≥ 90, SEO ≥ 90, Buenas prácticas ≥ 90, Rendimiento ≥ 80 (o causa documentada).
- Navegación solo con teclado: menú, filtros, chips, carrusel, paginación y login; el foco siempre es visible y el orden es lógico.
- Lector de pantalla (VoiceOver) en home y detalle: landmarks y encabezados coherentes.
- Zoom 200 % y viewport 360 px sin pérdida de contenido ni scroll horizontal indebido.
- `curl -I` a `/` muestra las cabeceras de seguridad; `/go/<slug>`, `/robots.txt`, `/sitemap.xml` y webhook siguen funcionando.
- `/admin` sin sesión redirige al login; el login no acepta redirecciones a dominios externos.
- `.env.example` sin credenciales reales.

## Verificación del tono
- Si se modificó algún texto visible, sigue siendo honesto: sin falsas urgencias, sin reseñas ni cifras inventadas, con divulgación de afiliados intacta; todo en español.

## Definición de “terminado”
- Checks automatizados y manuales superados (o excepciones justificadas en el informe).
- `informe.md` completo con puntuaciones antes/después y estado de cada hallazgo.
- Sin dependencias nuevas ni cambios de diseño no justificados.
- Hallazgos pospuestos propuestos como fases en el roadmap (previa aprobación).
- Fase 29 marcada `[x]` en `specs/roadmap.md` solo tras validar.
