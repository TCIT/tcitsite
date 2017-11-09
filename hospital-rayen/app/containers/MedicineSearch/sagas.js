"use strict";

import regeneratorRuntime from "regenerator-runtime";

import { take, call, put, throttle } from 'redux-saga/effects';
import { multipleArrayFilter, multipleArraySort, multipleHighlightTerms} from 'utils/search-in-array';
import { searchService } from 'services/search';
import { SEARCH_MEDICINE, GET_MEDICINES } from './constants';

// name of the service to search
const serviceName = "drugs";

// limit results
const limitResults = 10;

// watcher function
export function* watchMedicineSearch() {
  yield throttle(500, SEARCH_MEDICINE, filterSearch);
}

function* filterSearch(action){

  let filters = [];
  let sortFilters = [];
  let highlighters = [];
  let data = {};

  /* MEDICINE FILTERS */
  const generateFilter = (fieldTo, typeSearch, terms) => {
    /**
     * Filtros para busquedas en cache.
     * @param {string} fieldTo - Columna donde se realizara la busqueda
     * @param {string} typeSearch - Tipo de busqueda, debe ser uno de los tipos indicados acá: http://dexie.org/docs/WhereClause/WhereClause.html
     * @param {object} terms - Valor de busqueda, puede ser un string en busquedas o un array en casos más complejos (ej. rangos, mayor o menor que)
     * @return {true}
     */
    if(terms) {
      let beginWordsOnly = false;
      // Dixie WhereClausules that start with a word
      if (typeSearch === "startsWithIgnoreCase" ||
          typeSearch === "startsWithAnyOfIgnoreCase" ||
          typeSearch === "startsWithAnyOf" ||
          typeSearch === "startsWith") {
        beginWordsOnly = true;
      }
      filters.push({beginWordsOnly, typeSearch, filterText: terms, fieldToSearch: fieldTo});
      sortFilters.push({beginWordsOnly, terms, fieldToSort: fieldTo});
      highlighters.push({ beginWordsOnly, terms, fieldToHighlight: fieldTo, highlightedName: fieldTo, beginTag:'', endTag:'' });
    }
  };

  /* filters for advanced search */
  generateFilter('NOMBRE_GENERICO', 'startsWithIgnoreCase', action.payload.genericName);
  generateFilter('NOMBRE_COMERCIAL', 'startsWithIgnoreCase', action.payload.brandedName);
  generateFilter('FORMA', 'startsWithIgnoreCase', action.payload.drugForm);
  generateFilter('VIA', 'startsWithIgnoreCase', action.payload.route);
  generateFilter('LABORATORIO', 'startsWithIgnoreCase', action.payload.manufacturer);

  if(filters.length>0) {
    /* search filters on the service */
    const results = yield searchService(serviceName, filters).then(function(results) {
      const arrayResults = Object.values(results)[0]
      let filteredList = multipleArrayFilter(arrayResults, filters);
      let orderedList = multipleArraySort(filteredList, sortFilters);

      orderedList = orderedList.slice(0,limitResults);
      let highlightedList = multipleHighlightTerms(orderedList, highlighters);
      return highlightedList;
    });

    // send results to store
    yield put({
      type: GET_MEDICINES,
      payload: results,
    });
  }

}

// All sagas to be loaded
export default [
  watchMedicineSearch,
];
