-------------------------------
Autor:

Carlos Antonio Rodriguez Martínez

Escuela: 

Novauniversitas:

Campus:

San Jacinto
--------------------

Nombre del proyecto: 

TaskFlow 



# Gestion De Actividades

Aplicación web de gestión de tareas desarrollada con TypeScript y React.
Se ejecuta de forma íntegra en el navegador del usuario, sin servidor externo, y
persiste los datos en el almacenamiento local del cliente (localStorage).


## Tabla de contenido

1. [Descripción](#descripción)
2. [Dominio del problema](#dominio-del-problema)
3. [Stack tecnológico](#stack-tecnológico)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Arquitectura de componentes](#arquitectura-de-componentes)
6. [Modelo de datos](#modelo-de-datos)
7. [Flujo de datos y estado](#flujo-de-datos-y-estado)
8. [Persistencia](#persistencia)
9. [Identificación única de tareas](#identificación-única-de-tareas)
10. [Búsqueda y filtrado](#búsqueda-y-filtrado)
11. [Restricción de modularidad](#restricción-de-modularidad)
12. [Estilos](#estilos)
13. [Instalación y uso](#instalación-y-uso)
14. [Scripts disponibles](#scripts-disponibles)
15. [Decisiones de diseño](#decisiones-de-diseño)

---

## Descripción

TaskFlow es una aplicación de una sola página (SPA) que funciona completamente
en el navegador. Permite registrar tareas, marcarlas como completadas o
pendientes, eliminarlas, filtrarlas por estado y buscarlas por nombre.

Al no depender de un backend, el tiempo de respuesta es instantáneo y la
aplicación puede usarse sin conexión una vez cargada.

---

## Dominio del problema

El sistema opera dentro del dominio de la productividad personal. Resuelve
la necesidad de centralizar y dar seguimiento a las actividades cotidianas
a través de una bitácora digital estructurada.

Conceptos clave del negocio:

- Tarea (Todo): unidad mínima de información. Tiene una descripción y un
  estado binario (realizada / no realizada).

- Persistencia local: los datos sobreviven al cierre del navegador o a la
  recarga de la página mediante localStorage.

- Filtros de estado: clasificación del listado según su condición
  (Todas, Activas, Finalizadas).

- Búsqueda: filtrado parcial e insensible a mayúsculas por nombre de tarea.

---

## Stack tecnológico

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| TypeScript | 5.x | Tipado estático estricto |
| React      | 18.x | Biblioteca de interfaz por componentes |
| Vite       | 5.x | Bundler y servidor de desarrollo |
| uuid       | 9.x | Generación de identificadores únicos |
| CSS puro   | - | Hoja de estilos propia, sin frameworks |

No se utilizan frameworks CSS externos ni librerías de estado global. El
estado se maneja con las APIs nativas de React.

---

## Estructura del proyecto

```
taskflow/
├── src/
│   ├── main.tsx                  Punto de entrada de la aplicación
│   ├── App.tsx                   Componente raíz y orquestador de estado
│   ├── interfaces/
│   │   └── todo.ts               Tipos e interfaces del dominio
│   ├── hooks/
│   │   └── useTodos.ts           Hook personalizado de gestión de tareas
│   ├── utils/
│   │   ├── storage.ts            Serialización y acceso a localStorage
│   │   └── filtrar.ts            Lógica pura de filtrado combinado
│   ├── components/
│   │   ├── Header.tsx            Encabezado visual
│   │   ├── FormularioEntrada.tsx Formulario de creación de tareas
│   │   ├── BuscadorTarea.tsx     Campo de búsqueda por nombre
│   │   ├── BarraFiltros.tsx      Filtros de estado y contador
│   │   ├── ContenedorLista.tsx   Render del listado completo
│   │   └── ItemTarea.tsx         Fila individual de tarea
│   └── styles/
│       └── style.css             Hoja de estilos global
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

**Convención de extensiones:**

- Archivos `.tsx`: contienen JSX (componentes React).
- Archivos `.ts`: no contienen JSX (tipos, utilidades, hooks que no devuelven
  elementos visuales).

Esta separación permite que las herramientas (linter, formateador, compilador)
apliquen reglas distintas a cada tipo de archivo y comunica la intención de
cada módulo de un vistazo.

---

## Arquitectura de componentes

La interfaz se divide en componentes atómicos especializados. Cada uno tiene
una única responsabilidad y ninguno supera las 30 líneas de código.

| Componente | Responsabilidad |
|------------|-----------------|
| `Header` | Muestra el título y subtítulo de la aplicación. No recibe props. |
| `FormularioEntrada` | Captura la descripción de una nueva tarea y la emite al padre. Controla su propio input local. |
| `BuscadorTarea` | Campo de texto controlado para buscar tareas por nombre. |
| `BarraFiltros` | Presenta los filtros de estado (Todas / Activas / Finalizadas) y el contador de pendientes. |
| `ContenedorLista` | Itera el arreglo de tareas y delega cada fila a `ItemTarea`. Muestra un mensaje cuando la lista está vacía. |
| `ItemTarea` | Renderiza una tarea individual: checkbox de estado, descripción y botón de eliminar. |
| `App` | Componente raíz. Mantiene el estado de filtro y búsqueda, compone los componentes hijos y conecta los callbacks. |

Comunicación entre componentes: todos los flujos se realizan por props.
Los componentes hijos notifican eventos hacia arriba mediante funciones
callbacks (`onAgregar`, `onAlternar`, `onEliminar`, `onBuscar`, `onCambiar`).
No se usa Context ni ninguna librería de estado externa.

---

## Modelo de datos

Definido en `src/interfaces/todo.ts`:

```ts
export interface Todo {
  id: string;
  descripcion: string;
  status: boolean;
}

export type Filtro = 'todas' | 'activas' | 'finalizadas';
```

- `id`: identificador único generado con uuid v4.
- `descripcion`: texto ingresado por el usuario.
- `status`: `false` indica pendiente, `true` indica finalizada.
- `Filtro`: tipo unión que restringe los valores válidos del filtro de estado.

El tipado estricto evita errores en tiempo de compilación y sirve como
documentación viva del dominio.

---

## Flujo de datos y estado

El estado se concentra en dos lugares:

1. `useTodos` (`src/hooks/useTodos.ts`): mantiene el arreglo de tareas y
   expone las operaciones para agregar, alternar y eliminar. Se sincroniza
   automáticamente con localStorage mediante `useEffect`.

2. `App` (`src/App.tsx`): mantiene el estado de UI (`filtro` y `busqueda`),
   calcula el arreglo visible combinando ambos criterios y pasa los datos a
   los componentes hijos.

Flujo típico de una interacción:

```
Usuario escribe en FormularioEntrada
        |
        v
FormularioEntrada llama a onAgregar(texto)
        |
        v
App invoca agregar() del hook useTodos
        |
        v
useTodos actualiza el arreglo con un nuevo objeto Todo (id uuid)
        |
        v
useEffect persiste el arreglo en localStorage
        |
        v
React re-renderiza ContenedorLista con la nueva tarea
```

Para la búsqueda y los filtros:

```
Usuario escribe en BuscadorTarea o pulsa un filtro
        |
        v
App actualiza su estado local (busqueda / filtro)
        |
        v
filtrarTodos(todos, filtro, busqueda) calcula la lista visible
        |
        v
ContenedorLista recibe solo las tareas que coinciden
```

---

## Persistencia

`localStorage` solo admite cadenas de texto, por lo que se implementa un flujo
de conversión en `src/utils/storage.ts`.

**Guardado:**

```
arreglo tipado Todo[]
        |
        v
JSON.stringify()
        |
        v
localStorage.setItem('k=todo', texto)
```

**Carga:**

```
localStorage.getItem('k=todo')
        |
        v
Validación: si está vacío, se devuelve []
        |
        v
JSON.parse() protegido con try/catch
        |
        v
arreglo tipado Todo[] inyectado en el estado

```

El bloque `try/catch` evita que un dato corrupto rompa la aplicación: si el
parseo falla, se devuelve un arreglo vacío y la app arranca normalmente.

La clave usada en localStorage es `k=todo`.

---

## Identificación única de tareas

Cada tarea recibe un identificador generado con `uuid` v4 en el momento
exacto de su creación:

```ts

{ id: uuid(), descripcion, status: false }

```

Esto garantiza unicidad global y evita colisiones al buscar, alternar o
eliminar elementos dentro del arreglo en memoria. No se usan índices como
clave ni como identificador porque cambian al reordenar o eliminar.

---

## Búsqueda y filtrado

Ambas operaciones se combinan en `src/utils/filtrar.ts`, una función pura que
recibe la lista completa, el filtro de estado y el texto de búsqueda, y
devuelve el arreglo visible.

Criterios de la búsqueda:

- Es insensible a mayúsculas y minúsculas.
- Es parcial: usa `includes`, por lo que basta con escribir un fragmento
  del nombre.
- Ignora espacios al inicio y al final del texto ingresado.
- Se aplica siempre en conjunto con el filtro de estado activo.

---

## Restricción de modularidad

El proyecto impone que ningún componente supere las 30 líneas de código.

| Archivo | Líneas |
|---|---|
| `Header.tsx` | 6 |
| `FormularioEntrada.tsx` | 22 |
| `BuscadorTarea.tsx` | 17 |
| `BarraFiltros.tsx` | 24 |
| `ItemTarea.tsx` | 19 |
| `ContenedorLista.tsx` | 18 |
| `App.tsx` | 28 |
| `useTodos.ts` | 21 |
| `storage.ts` | 16 |
| `filtrar.ts` | 18 |

Cuando un componente tiende a crecer, se extrae la lógica a un helper o a un
subcomponente. Esto mantiene los archivos legibles, desacoplados y fáciles de
probar por separado.

---

## Estilos

La hoja de estilos `src/styles/style.css` es propia, sin frameworks externos.
Sigue un enfoque visual moderno orientado a productividad:

- Paleta oscura con acentos cian y violeta.
- Variables CSS en `:root` para colores, radios y sombras.
- Efecto glassmorphism en el contenedor principal.
- Checkbox personalizado con transición y realce al marcarse.
- Animación de entrada en cada fila de tarea.
- Diseño responsive con un punto de quiebre en 520px.

Se prioriza el contraste adecuado, la legibilidad y un peso reducido de la
hoja de estilos.

---

## Instalación y uso

Requisitos previos: Node.js 18 o superior y npm.

```bash
# Clonar el repositorio
git clone https://github.com/<usuario>/taskflow.git
cd taskflow

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Uso

1. Escribe una descripción en el campo superior y pulsa Agregar (o Enter)
   para crear una tarea.
2. Usa el campo de búsqueda para filtrar tareas por nombre.
3. Usa los botones Todas, Activas y Finalizadas para filtrar por estado.
4. Marca el checkbox de una tarea para alternar entre pendiente y finalizada.
5. Pulsa el botón de eliminar para remover una tarea.

Los datos se guardan automáticamente en localStorage tras cada cambio.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Ejecuta el linter sobre el código fuente |

---

## Decisiones de diseño

- Sin backend: toda la lógica se ejecuta en el navegador. Reduce
  complejidad, tiempos de respuesta y dependencias de despliegue.

- Componentes atómicos: facilitan el cumplimiento del límite de 30 líneas
  y hacen cada pieza reutilizable y testeable de forma aislada.


- Estado centralizado solo donde corresponde: el estado de dominio vive
  en `useTodos`; el estado de UI vive en `App`. Los componentes hijos son
  controlados o no controlados según su naturaleza, sin duplicar fuente de
  verdad.

- Funciones puras para lógica no visual: `storage.ts` y `filtrar.ts` no
  conocen React, lo que los hace portables y fáciles de probar.

- uuid en lugar de índices: evita colisiones al buscar, modificar o
  eliminar tareas en el arreglo.

- Persistencia protegida: el `try/catch` en la carga evita que un dato
  corrupto en localStorage rompa la aplicación.

- Hoja de estilos propia: sin frameworks pesados, manteniendo control
  total sobre el diseño y el rendimiento.