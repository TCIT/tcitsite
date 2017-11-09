/*
 *
 * DiagnosisSearch actions
 *
 */

import {
  SEARCH_DIAGNOSIS, ADD_DIAGNOSIS
} from './constants';

export function getDiagnosis(diagnosis) {
  return {
    type: SEARCH_DIAGNOSIS,
    payload: diagnosis,
  };
}

export function addDiagnosis(diagnosis) {
  const diag = {name: diagnosis}
  return {
    type: ADD_DIAGNOSIS,
    payload: diag,
  };
}
