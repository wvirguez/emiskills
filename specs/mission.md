# Misión — emiskills

## Qué es
Tienda web de productos digitales (cursos, manuales, ebooks, plantillas, membresías) que reúne en un solo catálogo ofertas de Hotmart y de otros productores. Se monetiza con comisiones de afiliado en cada venta.

## Propuesta de valor
**Curaduría honesta.** Ayudar al visitante a elegir el producto correcto con información clara, comparable y sin exageraciones. La confianza es el diferenciador; las comisiones son consecuencia de ella, no el objetivo que dicta qué se muestra.

## Audiencia objetivo
- Hispanohablantes de **LATAM** que compran cursos, ebooks y plantillas digitales.
- Uso mayoritario desde **móvil**, con conexiones variables: la web debe ser rápida y ligera.
- Precios mostrados claramente (moneda de origen del producto; sin conversiones engañosas).

## Principios
1. **Honestidad primero:** descripciones objetivas, indicar claramente que somos afiliados (divulgación visible), sin falsas urgencias ni reseñas inventadas.
2. **Encontrar rápido:** buscador con filtros por categoría, precio, idioma y plataforma de origen.
3. **Un catálogo, varias fuentes:** productos de Hotmart (sincronizados por API/webhooks) y productos manuales de otros productores.
4. **Enlaces de afiliado transparentes:** enrutamiento propio con parámetros de afiliado y registro de clics.
5. **Mantener el estilo visual actual** y ser responsive.
6. **Ingeniería guiada por especificaciones (SDD):** especificaciones en Markdown que guían a agentes (Claude Code, OpenCode, Ollama) a generar código limpio, tipado y testeado.

## Fuera de alcance (v1.0)
- Procesar pagos propios o entregar los productos (la venta ocurre en la plataforma del productor).
- Cuentas de usuario para visitantes.
- Soporte multilingüe de la interfaz (solo español en v1.0).

## Métricas de éxito
- Clics salientes a enlaces de afiliado (por producto, categoría, plataforma).
- Ventas/comisiones atribuidas.
- Tiempo desde la llegada hasta el primer clic a un producto.
