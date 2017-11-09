import Dexie from 'dexie';
import _ from 'lodash';

const LIMIT_SEARCH = 20;

export function searchService(serviceName, filters) {
  /**
   * Metodo generico para hacer una busqueda en los servicios de indexedDB
   * @param {string} serviceName - nombre de la base de datos del cache a obtener
   * @param {object[]} filters - filtros de busqueda: {filterType, searchText, rowName}
   */
  return new Promise(function(resolve, reject) {
    if (filters.length > 0) {
      const that = this;
      // let results = [];

      filters.map(function(filter) {
        getResults(serviceName, filter)
          .then(function(res) {
            let result = {[filter.rowName]: res}
            resolve(result);
          })
      });
    }
  });
}

function getResults(serviceName, filter) {
  return new Promise(function(resolve, reject) {
    new Dexie(serviceName).open().then(function(db) {
      // define table cache to search
      const table = db.table(serviceName);
      let results = [];
      if (filter.searchText && filter.filterType == "startsWithIgnoreCase") {
        table
          .where(filter.rowName)
          .startsWithIgnoreCase(filter.searchText)
          .limit(LIMIT_SEARCH)
          .toArray(function(resultsArray) {
            // console.log(resultsArray)
            resolve(_.map(resultsArray, filter.rowName));
          });
      } else
      if (filter.searchText && filter.filterType == "equals") {
        table
          .where(filter.rowName)
          .equals(filter.searchText)
          .limit(LIMIT_SEARCH)
          .toArray(function(resultsArray) {
            // console.log(resultsArray)
            resolve(_.map(resultsArray, filter.rowName));
          });
      }
    })
  });
}
