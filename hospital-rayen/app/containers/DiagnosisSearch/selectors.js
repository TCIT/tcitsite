import { createSelector } from 'reselect';

/**
 * Direct selector to the diagnosisSearch state domain
 */
const selectDiagnosisSearchDomain = () => (state) => state.get('diagnoses');

/**
 * Other specific selectors
 */

const selectDiagnosisSearchResultsDomain = () => (state) => state.get('diagnosesResults');

/**
 * Default selector used by DiagnosisSearch
 */

const makeSelectDiagnosisSearch = () => createSelector(
  selectDiagnosisSearchDomain(),
  (substate) => substate.toJS()
);

const makeSelectDiagnosisSearchResults = () => createSelector(
  selectDiagnosisSearchResultsDomain(),
  (substate) => substate.toJS()
);

export {
  makeSelectDiagnosisSearch,
  makeSelectDiagnosisSearchResults,
  selectDiagnosisSearchDomain,
  selectDiagnosisSearchResultsDomain,
};
