
----
name: feature-spec
description: Inicia una nueva función de este proyecto al encontrar la siguiente fase incompleta en specs/roadmap.md, crea una rama de Git, entrevista al usuario sobre el alcance, las decisiones y el contexto, y escribe un directorio con fecha en specs/ que contiene plan.md, requirements.md y validation.md. Se activa cuando el usuario dice "especificación de la función", "siguiente fase", "iniciar la siguiente función" o invoca /feature-spec.

---

# Especificación de la función

## Flujo de trabajo

### 1. Encontrar la siguiente fase

Lee `specs/roadmap.md`. La siguiente fase es la primera sección cuyos elementos están entre corchetes `[ ]`. Anota su nombre para obtener el nombre de la rama y del directorio.

### 2. Crea la rama

```
git checkout -b phase-N-<kebab-name>
```

### 3. Entrevista al usuario — ANTES de escribir cualquier archivo

Usa `AskUserQuestion` con exactamente **3 preguntas en una sola llamada**:

| Encabezado | Enfoque de la pregunta |

|--------|---------------|

| **Alcance** | Qué recopila, expone o hace la funcionalidad: campos, comportamiento de la página, estructura de los datos |

| **Decisiones** | Opciones clave de implementación: almacenamiento, visibilidad, validación, patrón de UX |

| **Contexto** | Tono, restricciones o cualquier otro aspecto que defina la especificación: nivel de texto satírico, límites de la pila, preguntas abiertas |

No escribas ningún archivo hasta que el usuario haya respondido las tres preguntas.

### 4. Lee los archivos de guía

Lee `specs/mission.md` y `specs/tech-stack.md` antes de redactar.

### 5. Crear el directorio de especificaciones

Nombre: `specs/AAAA-MM-DD-<nombre-de-la-característica>/` usando la fecha de hoy.

#### `requirements.md`
- Sección de alcance: qué se incluye y qué no; tabla de campos/datos si corresponde.
- Sección de decisiones: decisiones tomadas y por qué (basado en las respuestas del usuario).
- Sección de contexto: reglas de tono, punteros de pila, patrones existentes a seguir.

#### `plan.md`
- Grupos de tareas numerados: Base de datos → Componentes → Página y ruta → Navegación → Pruebas
- Cada grupo tiene subtareas numeradas; los grupos deben poder implementarse de forma independiente.

#### `validation.md`
- Automatizado: `npm test` y `npm run typecheck` pasan. Se requieren afirmaciones específicas
- Manual: recorrido por el navegador, comportamiento del formulario, casos límite
- Verificación del tono si la función tiene texto visible para el usuario
- Definición de "terminado"

## Restricciones de la pila

- Hono 4.x + Hono JSX (SSR) + SQLite mediante `better-sqlite3` + Vitest: no se añadirán nuevas dependencias sin la aprobación del usuario
- Los formularios POST utilizan POST/redirect/GET
- No se utiliza JavaScript del lado del cliente
- Las migraciones se encuentran en `src/db/migrations/` como archivos `.sql` numerados
- El tono satírico solo se aplica al texto de las etiquetas/marcadores de posición, no a la estructura ni a la lógica