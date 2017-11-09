import { createSelector } from 'reselect';

/**
 * Direct selector to the drugSearch state domain
 */
const selectDrugSearchDomain = () => (state) => state.get('drugs');

/**
 * Other specific selectors
 */


/**
 * Default selector used by DrugSearch
 */

const makeSelectDrugSearch = () => createSelector(
  selectDrugSearchDomain(),
  (substate) => substate.toJS()
);

export default makeSelectDrugSearch;
export {
  selectDrugSearchDomain,
};
