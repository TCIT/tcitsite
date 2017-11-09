import Dexie from 'dexie';
import _ from 'lodash';

const LIMIT_SEARCH = 20;

export function searchService(serviceName, filters) {
  /**
   * Metodo generico para hacer una busqueda en los servicios de indexedDB
   * @param {string} serviceName - nombre de la base de datos del cache a obtener
   * @param {object[]} filters - filtros de busqueda: {fieldToSearch, typeSearch, filterText, searchLast}
   */
  return new Promise(function(resolve, reject) {
    if (filters.length > 0) {
      filters.map(function(filter) {
        getResults(serviceName, filter)
          .then(function(res) {
            let result = {[filter.fieldToSearch]: res}
            resolve(result);
          })
      });
    }
  });
}

export function getServiceToArray(serviceName) {
  return new Promise(function(resolve, reject) {
    new Dexie(serviceName).open().then(function(db) {
      // define table cache to search
      const table = db.table(serviceName);
      resolve(table.toArray());
    })
    .catch(function(e) {
      reject(e);
    });
  })
}

function getResults(serviceName, filter) {
  /**
   * Filter should come with typeSearch a Dixie WhereClausule type string.
   * See possible WhereClausule values to use in your filters
   * http://dexie.org/docs/WhereClause/WhereClause.html
   */
  return new Promise(function(resolve, reject) {
    new Dexie(serviceName).open().then(function(db) {
      // define table cache to search
      const table = db.table(serviceName);
      let results = [];
      table
        .where(filter.fieldToSearch)[filter.typeSearch](filter.filterText)
        .limit(LIMIT_SEARCH)
        .toArray(function(resultsArray) {
          resolve(resultsArray);
        })
        .catch(function(e) {
          reject(e);
        });
    })
  });
}
