import { createSelector } from 'reselect';

/**
 * Direct selector to the medicineSearch state domain
 */
const selectMedicineSearchDomain = () => (state) => state.get('medicines');

/**
 * Other specific selectors
 */
const selectMedicineSearchResultsDomain = () => (state) => state.get('medicinesResults');

/**
 * Default selector used by MedicineSearch
 */

const makeSelectMedicineSearch = () => createSelector(
  selectMedicineSearchDomain(),
  (substate) => substate.toJS()
);

const makeSelectMedicineSearchResults = () => createSelector(
  selectMedicineSearchResultsDomain(),
  (substate) => substate.toJS()
);

export {
  makeSelectMedicineSearch,
  makeSelectMedicineSearchResults,
  selectMedicineSearchResultsDomain,
  selectMedicineSearchDomain,
};
