/*
 *
 * MedicineSearch reducer
 *
 */

import { fromJS } from 'immutable';
import {
  ADD_MEDICINE, GET_MEDICINES
} from './constants';

const initialStateMeds = fromJS({ medicines: [
  { time: 4,
    medicine: {genericName: 'Enalprin 10mg'},
    posology: 'Cada 24 hrs',
    obs: 'Tomar con abundante agua',
    doctor: 'Dr Mario Fernandez',
    execState: {2: false, 21: true},
  }
]});

const initialState = fromJS({});

function medicineSearchReducer(state = initialStateMeds, action) {
  const prevState = state.get('medicines');
  switch (action.type) {
    case ADD_MEDICINE:
      return state
        .update('medicines', prevState => prevState.unshift(action.payload));
    default:
      return state;
  }
}

function medicineSearchResultsReducer(state = initialState, action) {
  const prevState = state.get('medicinesResults');
  switch (action.type) {
    case GET_MEDICINES:
      return state
        .set('medicinesResults', action.payload);
    default:
      return state;
  }
}

export {
  medicineSearchReducer,
  medicineSearchResultsReducer,
}
