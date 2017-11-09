/*
 *
 * DiagnosisSearch reducer
 *
 */

import { fromJS } from 'immutable';
import {
  ADD_DIAGNOSIS, GET_DIAGNOSES
} from './constants';

const initialStateDiags = fromJS({diagnoses: [
  {name: "Observación de trombosis lumbar profunda"}
]});

const initialState = fromJS({});

function diagnosisSearchReducer(state = initialStateDiags, action) {
  const prevState = state.get('diagnoses');
  switch (action.type) {
    case ADD_DIAGNOSIS:
      return state
        .update('diagnoses', prevState => prevState.unshift(action.payload));
    default:
      return state;
  }
}

function diagnosisSearchResultsReducer(state = initialState, action) {
  const prevState = state.get('diagnosesResults');
  switch (action.type) {
    case GET_DIAGNOSES:
      return state
        .set('diagnosesResults', action.payload);
    default:
      return state;
  }
}

export {
  diagnosisSearchReducer,
  diagnosisSearchResultsReducer,
}
