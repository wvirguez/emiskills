
📋 Especificación Técnica para Agente de IA: Instanciación de Prisma Client en Next.js (Patrón Singleton para Entornos Limitados)

Contexto del Proyecto:
Estamos desarrollando una aplicación utilizando Next.js (App Router) en el backend, React en el frontend y TypeScript. El motor de base de datos es MySQL y el proyecto se desplegará en un plan de hosting compartido en Hostinger. Los entornos compartidos de Hostinger imponen límites estrictos de memoria RAM y un umbral bajo de conexiones simultáneas a la base de datos (generalmente entre 30 y 60 conexiones concurrentes globales).
Problema a Evitar:
Debido al mecanismo de Fast Refresh (recarga en caliente) de Next.js en desarrollo y a la naturaleza Serverless/Edge-ready de los Route Handlers y Server Actions en producción, cada recarga o petición puede instanciar un nuevo PrismaClient. En Prisma, cada cliente abre un proceso binario (Query Engine) independiente. En Hostinger, esto provoca rápidamente el error Too many connections en MySQL o causa que el servidor mate el proceso por exceder el límite de memoria RAM.
Objetivo:
Crear un archivo de configuración de base de datos en TypeScript que implemente el Patrón Singleton para asegurar que exista una única instancia global de PrismaClient compartida en toda la aplicación, además de optimizar los parámetros de conexión de MySQL para Hostinger.

⚙️ Requisitos de Implementación

El agente de IA debe generar el código siguiendo estrictamente las siguientes directrices:
1. Estructura de TypeScript Eficiente:
	• Declarar y extender el objeto globalThis utilizando interfaces de TypeScript para almacenar de forma segura la instancia de Prisma en el entorno global sin generar errores de tipado (globalThis.prisma).
2. Lógica del Patrón Singleton:
	• Verificar si ya existe una instancia de PrismaClient en globalThis.
	• Si existe, reutilizarla. Si no existe, crear una nueva.
	• En entorno de producción (process.env.NODE_ENV === 'production'), asignar el cliente directamente. En desarrollo, guardarlo en el objeto global para sobrevivir al Hot Reloading.
3. Optimización de Parámetros de MySQL:
	• Proporcionar un ejemplo claro del formato que debe llevar la variable de entorno DATABASE_URL en el archivo .env.
	• Restricción Crítica: Debe incluir obligatoriamente el parámetro connection_limit=3 (o un valor máximo de 5) directamente en el Query String de la URL de conexión para evitar la saturación del Pool en Hostinger.
4. Exportación Limpia:
	• Exportar la instancia única como la exportación por defecto o nombrada (db o prisma) lista para ser importada en Server Components, Server Actions o API Route Handlers.

📥 Formato de Entrega Esperado

El agente debe retornar:
1. El código TypeScript completo y documentado (típicamente guardado en src/lib/db.ts o src/prisma.ts).
2. El ejemplo exacto de la línea que se debe añadir al archivo .env.
3. Una breve explicación de cómo importar y usar este cliente en un archivo del App Router (por ejemplo, en un Server Action o un route.ts).