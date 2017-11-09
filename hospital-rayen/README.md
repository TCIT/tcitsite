# Nexus Boilerplate

Este boilerplate es una fundación escalable y modular para desarrollar aplicaciones basadas en React con Redux `redux-saga`. Este template es un desarrollo para Rayen Salud. Este boilerplate además incluye un UI kit en `react-md` que se basa en Material Design.

## Tabla de contenidos
1. [Caracteristicas](#caracteristicas)
2. [Requerimientos](#requerimientos)
3. [Instalación](#instalacion)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Usando este boiler](#usando-este-boiler)
    - [React Router](#react-router)
    - [Redux](#redux)
    - [Reselect](#reselect)
    - [Redux Saga](#redux-saga)
6. [Ejemplo Flujo de la App](#ejemplo-flujo-de-la-app)

## Caracteristicas
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [redux-saga](https://github.com/redux-saga/redux-saga)
* [immutablejs](https://github.com/facebook/immutable-js)
* [styled-components](https://github.com/styled-components/styled-components)
* [react-router](https://github.com/rackt/react-router)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [react-md](https://github.com/mlaursen/react-md)
* [jest](https://github.com/facebook/jest)
* [eslint](http://eslint.org)

## Requerimientos
* node `^4.5.0`
* yarn `^0.17.0` or npm `^3.0.0`

## Instalación

Después de confirmar que tu entorno de desarrollo tenga instalado los [requerimientos](#Requirimientos) necesarios, puedes instalar el boilerplate para comenzar a desarrollar haciendo lo siguiente:

### Instalar desde el repo

Primero clona el repo:

```bash
$ git clone https://bitbucket.org/2brainschile/nexus-boilerplate
$ cd nexus-boilerplate
```

Luego instala las dependencias y ve si funcionan. Se autodetecta [Yarn](https://yarnpkg.com/) para instalaciones deterministicas, pero `npm install` funciona igualmente bien.

```bash
$ yarn install    # Install project dependencies
$ yarn start      # Compile and launch (same as `npm start`)
```

_Nota_:
Si al ejecutar tienes errores similares a `Module not found: Error: Can't resolve 'redux-persist-immutable'` puede ser que `yarn` no haya instalado todo. Prueba con `npm install`. Esto será corregido.

Si todo sale bien deberias ver esto:
![](https://d2ppvlu71ri8gs.cloudfront.net/items/2V05090u3g1b0g2A0P1g/Screen%20Shot%202017-05-24%20at%205.43.08%20PM.png)

Durante el desarrollo se utilizará principalmente `npm start`; sin embargo, En 2brains se planificó el desarrollo de los siguientes comandos para el manejo del boilerplate:

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Sirve la app en `localhost:3000`. Cambios en la app serán cargados en vivo en el browser.|
|`start:production`|Corre los tests, compila la app e inicia el servidor en producción (`npm test && npm run build && npm run start:prod`) |
|`build`|Prepara tu app para su despliegue continuo (no corre los tests). Optimiza y minifica los archivos, y los deja en el directorio `/build`. |
|`generate`|Te permite autogenerar código para partes especificas de tu aplicación, como `component`, `container`, `route` o `language`. Ej: `npm run generate container`|
|`test`|Corre los tests unitarios de Jest especificados en `**/tests/*.js` y genera un reporte de cobertura.|
|`test -- Button` (sin run)|Corre Jest solo en el componente especificado|
|`test:watch`|Observa cambios en tu aplicación y vuelve a correr los test cuando se hacen cambios al código.|
|`analyze`|Este comando genera un archivo `stats.json` en tu build de producción, que puedes subir al [webpack analizer](https://webpack.github.io/analyse/), para visualizar tus dependencias y estadisticas detalladas del peso de tu bundle|
|`lint`|_Lintea_ todos los archivos .js.|
|`deploy`|Hace un build de la app y la sube a un servidor de prueba|
|`docs`|Genera la documentación de la App con ESDocs en el archivo `docs/index.html`|
|`extract-intl`|Extrae todos los tags de lenguaje en los archivos JSON i18n en `app/translations.`|

## Estructura del proyecto

La estructura propuesta se basa en 3 principios:

* El código de la aplicación va en el directorio `app`. Es acá donde el desarrollo pasara el 99% tiempo.
* La configuración, los generadores y templates van en el directorio `internals`.
* El directorio `server` contendra todos los archivos de configuración de Webpack para desarrollo y producción.


```
.
├── internals                 # El "motor" de la app
│   └── webpack               # Configuración de Webpack y ES6
│   └── generators            # Código para generar components, containers y routes
│   └── mocks                 # Mocks que usa Jest para testear tu app
├── server                    # Configuración del servidor en prod y dev
├── app                       # Codigo fuente de la App
│   ├── routes.js             # Rutas de la App con React Router
│   ├── app.js                # Punto de entrada de la app
│   ├── index.html            # HTML que contiene la app
│   ├── global-styles.js      # Estilos globales de la app (deprecado).
│   ├── i18n.js               # Configuración React-Intl
│   ├── reducers.js           # Root reducer
│   ├── store.js              # Store redux
│   ├── components            # Global Reusable Presentational Components
│   ├── containers            # Global Reusable Container Components
│   │   └── ContactList       # Contenedor de prueba: Lista de contactos
│   │       ├── actions.js    # Acciones de Redux
│   │       ├── constants.js  # Constantes del contenedor
│   │       ├── ContactList.js# Archivo JSX del contenedor
│   │       ├── messages.js   # Mensajes i18n del contenedor
│   │       ├── reducer.js    # Reducidores del contenedor
│   │       ├── selectors.js  # Selectores del contenedor
│   │       └── tests         # Carpeta de tests del contenedor
│   ├── tests                 # Tests globales
│   │   └── store.test.js     # Jest del store redux
│   ├── translations          # Consolidados de traducciones React-Intl
```

## Usando este boilerplate

# React Router

`<Router />` setea tus rutas. Revisa [`routes.js`](/app/routes.js) para ver como los `path`s son mapeados con los contenedores de tu app.

- Path `"/"` corresponde al contenedor `<HomePage />`
- Path `"/info"` corresponde al contenedor `<InfoPage />`
- Path `"/contact/${id}"` corresponde al contenedor `<ContactDetail id = ${contact.id}/>`
- Path `"*"` i.e. corresponde al componente `<NotFoundPage />` (404 page)

Estos contenedores, junto con sus correspondientes reducidores y sagas, son cargados asincrónicamente con la ayuda dinámica de la función `import()`. Cuando webpack encuentra `import()` en el código, crea un archivo separado para esas importaciones. Esto significa que para cualquier ruta habrá un archivo separado, y por corolario, solo los archivos js necesarios serán cargados para una ruta en especifico.

**Cuando navegas a `"/"`, solo los archivos relacionados con el contenedor Homepage serán descargados y ejecutados. Esto hace a la app muy liviana y rápida.**

---

# Redux

El `store` de Redux es el corazón de tu aplicación. Revisa [`store.js`](app/store.js) para ver la configuración del `store` de Redux.

El `store` es creado con la función _factory_ `createStore()` que acepta 3 parametros.

1. **Root reducer:** El reducer maestro que combina todos los reducers.
2. **Initial state:** El estado inicial de tu app esta dado por sus reducers.
3. **Middleware/enhancers:** Middlewares son librerias de terceros que interceptan las acciones de Redux, y hacen algo..

En este boilerplate se usan 2 middlewares.

1. **Router Redux:** Mantiene las rutas en sincronización con el `store` de Redux.
2. **Redux saga:** Es usado para manejar los _efectos secundarios_ como despachar acciones asincronicamente o acceder a la data del browser.

---

# Redux Saga

Redux Sagas se usa principalmente para hacer llamadas a APIs, pero también se pueden usar para cualquier acción asincronica. Para ejecutarse la saga debe escuchar una acción que se envia al `store` Redux. Esto significa que las sagas escuchan a las acciones, y si encuentran una interesante, harán algo.

Las Sagas no son más que una [función generadora de ES6](http://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html) con [helpers provistos por Redux-Saga](https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html). Una saga actua como funciones normales, pero que puede ser pausadas y resumidas en cualquier momento. `redux-saga` provee un API intuitivo y declarativo para manejar operaciones asincronicas.

Las sagas se asocian a un container, tal como las acciones, constantes, selectores y reductores. Si tu contenedor ya contiene el archivo sagas.js, simplemente añade tu saga ahí. Si tu contenedor no cuenta con el archivo sagas.js, debes añadirlo a este boilerplate con la siguiente estructura:

```javascript
import { take, call, put, select } from 'redux-saga/effects';

// Tus sagas para este contenedor
export default [
  sagaName,
];

// Exportables individuales para testing Jest
export function* sagaName() {

}
```

Luego, si tu contenedor tiene una ruta asociada debes inyectarla en `routes.js`

```javascript
getComponent(nextState, cb) {
  const importModules = Promise.all([
    import('containers/YourContainer/reducer'),
    import('containers/YourContainer/sagas'),
    import('containers/YourContainer'),
  ]);

  const renderRoute = loadModule(cb);

  importModules.then(([reducer, sagas, component]) => {
    injectReducer('home', reducer.default);
    injectSagas(sagas.default); // Inject the saga

    renderRoute(component);
  });

  importModules.catch(errorLoading);
},
```

Si tu contenedor no tiene una ruta asociada puedes inyectarla en una saga global especifica para estos casos, ubicada en en `app/sagas.js`.

```javascript
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { sagaName } from 'containers/YourContainer/sagas';

export function injectGlobalSagas(store) {
  const { injectSagas } = getAsyncInjectors(store);

  injectSagas([
    sagaName,
  ]);
};
```

### Agregar Sagas a través de comandos
* Primero agregar un contenedor con: `npm run generate container`. Escoger tuple de Sagas.
* Luego crear una ruta con `npm run generate route` y seleccionar el contenedor anteriormente creado. La saga sera inyectada a la ruta.


---

# Reselect

Reselect "memoiza" (hace cache) de los árboles de estados anteriores y sus calculos basados en dicho árbol. Esto significa que cambios o calculos repetidos son más rapidos y eficientes, obteniendo un boost en la performance sobre implementaciones standard de `mapStateToProps`. 

Hay dos tipos diferentes de selectores. Selectores simples y complejos

### Funciones simples

Selectores simples son eso, toman el estado de la aplicación y seleccionan una parte de ella.

```javascript
const mySelector = (state) => state.get('someState');

export {
  mySelector,
};
```

### Funciones complejas

Si es necesario, se pueden combinar selectores simples para crear selectores más complejos que obtienen estados anidados con la función `createSelector` de Reselect. Se deben importar otros selectores y pasarlos en la llamada a `createSelector`.


```javascript
import { createSelector } from 'reselect';
import mySelector from 'mySelector';

const myComplexSelector = createSelector(
  mySelector,
  (myState) => myState.get('someNestedState')
);

export {
  myComplexSelector,
};
```

Estos selectores pueden ser usados directamente en nuestros contenedores como funciones `mapStateToProps` o ser anidados nuevamente con la función `createSelector`.

```javascript
export default connect(createSelector(
  myComplexSelector,
  (myNestedState) => ({ data: myNestedState })
))(SomeComponent);
```

### Añadir un nuevo selector

Si tienes un archivo `selectors.js` junto al reducidor que es parte del estado que quieres seleccionar, añade tu selector a dicho archivo. Si no existe el archivo puedes añadirlo dentro de la carpeta del contenedor y copiar este codigo boilerplate:

```javascript
import { createSelector } from 'reselect';

const selectMyState = () => createSelector(
	// tu selector
);

export {
  selectMyState,
};
```

App de ejemplo: `app/containers/ContactList/selector.js`

---

# Cache en IndexedDB de objetos estáticos

El manejo de los caches iniciales, llamados `servicios` en este boilerplate, se realiza a traves de una saga inicial que los carga desde una API especifica para insertalos en sus respectivas tablas en indexedDB. Esta saga además crea una tabla anexa donde se guarda el numero de objetos, sus TIDS y otros valores que son cotejados en cargas posteriores. Si existen discordancias se recrean los servicios desde cero. Para agregar un servicio a la carga inicial se hace a traves de los helpers [all y call](https://redux-saga.js.org/docs/advanced/RunningTasksInParallel.html) de Redux-Saga que funcionan similar a `Promises.all` y ejecuta las cargas en paralelo. El esquema de carga es el siguiente. 

![](docs/images/cache_diagram.png) 
[Esquema actualizado en kingfisher](https://kingfisher.link/maps/WPZ4QF2XP)

### Agregar cache a la carga de servicios
Para agregar más servicios solo se deben agregar elementos al array siguiendo la convención estipulada en la saga `loadServices` ubicada en `services/get.js`, por ejemplo:

```javascript
const [diagnosis, drugs] = yield all([
	call(loadService, { name: "diagnosis", path: "/DiagnosisClassify", tidLabel: "timeStamp", inMemory: true }),
	call(loadService, { name: "drugs", path: "/MedicineClassify", tidLabel: "TID", inMemory: false }),
]);
```


---



## Generar Documentación

* Usar reglas de [EsDoc](https://esdoc.org/manual/usage/usage.html)
* Listado de tags [acá](https://esdoc.org/manual/usage/tags.html)

Ejemplo de comentario de codigo valido para ESDoc:

```javascript
/**
 * this is MyClass.
 */
export default class MyClass {
  /**
   * @param {number} a - this is a value.
   * @param {number} b - this is a value.
   * @return {number} result of the sum value.
   */
  sum(a, b){
    return a + b;
  }
}
```

Generar documentacion en html
`npm run docs`

Abrir archivo `docs/index.html`


---

## Ejemplo de flujo de la app


![](docs/images/workflow.png)


 