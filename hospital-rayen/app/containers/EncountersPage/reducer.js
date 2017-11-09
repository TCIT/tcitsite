/*
 *
 * ContactList reducer
 *
 */

import { fromJS } from 'immutable';
import { GET_ENCOUNTERS_SUCCESS, CONTROLS_CHANGED, ASSIGN_PRACTITIONER, MEDICAL_RECORD_SUCCESS, SET_ENCOUNTERS_SUBTITLE} from './constants';

// Estado inicial es hidratado desde INITIAL_CONTACTS
const initialState = fromJS({
  encounterIds: [],
  assignedEncounters: 0,
  controls: {
  	searchText: ''
  }
});

function encountersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ENCOUNTERS_SUCCESS:
      return state
        .set('encounterIds', action.normalizedResponse.result);
    case CONTROLS_CHANGED:
      return state
        .mergeIn(['controls'], fromJS(action.controls));
    case SET_ENCOUNTERS_SUBTITLE:
      return state.mergeIn(['assignedEncounters'], fromJS(action.assignedEncounters));
    default:
      return state;
  }
}

export {
  encountersReducer,
};


