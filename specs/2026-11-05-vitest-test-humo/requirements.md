# Requisitos — Configurar Vitest y test de humo (Fase 4)

## Alcance
- Instalar y configurar **Vitest** con entorno `jsdom`, **@testing-library/react**, **@testing-library/jest-dom** y **@vitejs/plugin-react**.
- Un test de humo que renderice el componente real `Hero` y compruebe el mensaje principal.
- Scripts `npm test` (ejecución única) y `npm run test:watch`.
- Sección breve en `README.md` sobre cómo ejecutar los tests.

## Fuera de alcance
- Playwright / E2E, cobertura, tests de la capa de datos (fases posteriores).
- Cambios visuales o de textos en componentes.

## Decisiones
- **Alcance de pruebas:** Vitest + Testing Library (no solo runner mínimo).
- **Test de humo:** render de `components/Hero.tsx`; verifica el `h1` ("Desbloquea tu potencial con Nosotros").
- **Alias `@/*`:** los componentes importan con `@/`, por lo que es necesario resolverlo en Vitest (`resolve.alias` o `vite-tsconfig-paths`), aunque no se eligiera como extra.
- **Rama:** `fase-04-vitest-smoke`. Archivos: `vitest.config.mts`, `vitest.setup.ts`, `components/Hero.test.tsx`.
- `next/link` se renderiza sin mocks en jsdom; si falla, mockear solo lo mínimo.
- TypeScript estricto, sin `any`; incluir tipos de `vitest/globals` solo si se usan globals.

## Contexto
- Next.js 16.2 con cambios incompatibles: consultar `node_modules/next/dist/docs/` (guía de Vitest) antes de configurar.
- Convención del proyecto (`specs/tech-stack.md`): código nuevo con pruebas.
- Los tests no deben ser incluidos por `next build` ni por ESLint con errores.
