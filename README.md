# 🇻 emiskills -  Tienda de productos digitales (afiliados)

> **PRD Activo (Versión 1.0)** -  Tenemos una Aplicación web, que queremos modificar a partir de el código existente en este proyecto para reunir en un solo catálogo productos digitales de Hotmart y de otros productores (cursos, manuales, ebooks, plantillas, membresías), para ayudar al visitante a elegir el producto correcto con información clara y honesta, y así generar ingresos por comisión de afiliado en cada venta.


## 🎯 1. Características Principales

* **Buscador Avanzado:** Filtros por categoría, precio, idioma y plataforma de origen.
* **Integración API/Webhooks:** Conexión con Hotmart (vía Hotmart Developers) y sincronización con bases de datos propias.
* **Sistema de Afiliados:** Enrutamiento inteligente con enlaces de afiliado parametrizados.
* **Diseño Responsive:** Interfaz moderna, rápida y adaptada a dispositivos móviles manteniendo los estilos actuales.
* **Panel de Administración:** Gestión de productos manuales (otros productores) y métricas de clics.
* **Entorno de Ingeniería (SDD con IA):** Uso estricto de especificaciones en Markdown para guiar a agentes locales (**Claude Code**, **OpenCode** u **Ollama** vía VS Code) en la generación de código limpio, tipado y testeado.

## 🧪 Pruebas

```bash
# Ejecutar todos los tests una vez (modo CI)
npm test

# Iniciar Vitest en modo observación (watch)
npm run test:watch
```

El test de humo (`components/Hero.test.tsx`) verifica que el componente `Hero` se renderice correctamente con su mensaje principal.
 


## 🗄️ Base de datos local (MySQL + Prisma)

```bash
# 1. Instalar e iniciar MySQL con Homebrew
brew install mysql
brew services start mysql

# 2. Crear la base de datos y el usuario de desarrollo
mysql -u root -e "CREATE DATABASE emiskills CHARACTER SET utf8mb4;
  CREATE USER 'emiskills'@'localhost' IDENTIFIED BY 'TU_CLAVE';
  GRANT ALL PRIVILEGES ON emiskills.* TO 'emiskills'@'localhost';"

# 3. Configurar variables de entorno (.env no se versiona)
cp .env.example .env   # edita DATABASE_URL con tu clave

# 4. Verificar la conexión
npm run db:check
```

```bash
# Migrar (crear/aplicar migraciones)
npm run db:migrate -- --name nombre_migracion

# Primera migración (esquema inicial: Product, Category, Platform)
npm run db:migrate -- --name esquema_inicial

# Regenerar cliente Prisma tras cambios en schema.prisma
npm run db:generate

# Sembrar datos iniciales (plataformas, categorías, 6 productos de ejemplo)
npm run db:seed

# Abrir Prisma Studio para inspeccionar la BD
npm run db:studio
```

Scripts: `db:generate` (cliente Prisma), `db:migrate`, `db:seed`, `db:studio`, `db:check`.
`DATABASE_URL` incluye `connection_limit=3` para respetar los límites del hosting compartido (Hostinger).
El cliente se importa desde `@/lib/db` (`import { db } from "@/lib/db"`).

> **Nota:** Las URLs de afiliado en el seed son ficticias (`https://example.com/...`) y no representan afiliaciones reales.
