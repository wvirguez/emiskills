# Tech Stack — emiskills

## Existente (package.json)
| Área | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) — **tiene cambios incompatibles; leer `node_modules/next/dist/docs/` antes de codificar** |
| UI | React 19.2, Tailwind CSS 4, react-icons |
| Lenguaje | TypeScript 5 |
| Calidad | ESLint 9 + eslint-config-next |

## Decisiones para cubrir las brechas
| Área | Decisión | Notas |
|---|---|---|
| Base de datos | **MySQL** | Hostinger ofrece MySQL nativo. |
| Acceso a datos | ORM tipado (propuesto: **Prisma** con provider `mysql`; validar compatibilidad al implementar) | Migraciones versionadas. |
| Autenticación admin | Sesión propia para un único rol admin (propuesto: **Auth.js** con credenciales, o JWT en cookie httpOnly) | Sin cuentas de visitantes. |
| Validación | **Zod** en límites (formularios, webhooks, API) | |
| Integración | API de **Hotmart Developers** + webhooks | Verificar firma/token del webhook. |
| Pruebas | **Vitest** (unitarias) + Testing Library; Playwright opcional para flujos clave | |
| Desarrollo | 100 % local primero (MySQL local, p. ej. Docker o instalación nativa) | |
| Despliegue | **Hostinger** (hosting con Node.js) tras terminar el desarrollo local | Variables de entorno en el panel; `next build` + `next start`. |

## Riesgos / puntos abiertos
- Confirmar que el plan de Hostinger contratado soporta aplicaciones Node.js (Next.js SSR). Si no, considerar VPS.
- Confirmar versión de MySQL de Hostinger y compatibilidad con el ORM elegido.
- Los acuerdos de afiliación de Hotmart y de otros productores deben revisarse (uso de marca, enlaces).

## Convenciones
- TypeScript estricto, sin `any`.
- Secretos solo en variables de entorno; `.env*` fuera de git.
- Cada feature con su spec en `specs/` antes de implementarse.
- Código nuevo con pruebas.
