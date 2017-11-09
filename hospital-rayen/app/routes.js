// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
/* eslint-disable */
  return [
    {
      path: '/',
      name: 'sessionsPage',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/Session/sagas'),
          import('containers/Session'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/encounters',
      name: 'encountersPage',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/EncountersPage/sagas'),
          import('containers/EncountersPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/encounters/:encounterId',
      name: 'encounterEventsPage',
      getComponent(location, cb) {
        const importModules = Promise.all([
          import('containers/EncounterEventsPage/sagas'),
          import('containers/EncounterEventsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/webkit_search',
      name: 'webkitSearch',
      getComponent(location, cb) {
        System.import('containers/WebkitSearch')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/webkit_async',
      name: 'webkitAsync',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/WebkitAsync/sagas'),
          import('containers/WebkitAsync'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default); // Inject the saga

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
/* eslint-enable */
