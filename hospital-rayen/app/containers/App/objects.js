import { fromJS } from 'immutable';

const initialState = fromJS({
  objects: {
    sessions: {},
    facilities: {},
    patients: {},
    practitioners: {},
    roles: {},
    templates: {},
    users: {},
    encounters: {},
    encounterEvents: {},
    observationEntries: {},
    dietEntries: {},
    restEntries: {},
    procedureEntries: {},
    drugEntries: {},
    drugs: {},
    procedures: {},
    diets: {},
    rests: {},
    medicationAlternativeEntries: {},
    medicationDilutionEntries: {},
    medicationRequestEntries: {},
    virtualMedicalProducts: {},
    routeAdministrations: {},
    diagnoses: {},
    diagnosisStates: {},
    diagnosisEntries: {},
    alertEntries: {},
    referralEntries: {},
    shiftChangeEntries: {},
    healthProblems: {},
    referralPriorities: {},
    referralReasons: {}
  }
});

import {
  ACTIVATE_SUCCESS,
  LOGOUT_SUCCESS,
  LOAD_CACHE_SUCCESS
} from './constants';
import {
  CONFIRM_ROLE_SUCCESS,
  FORGET_SESSION_SUCCESS
} from '../Session/constants';
import {
  GET_ENCOUNTERS_SUCCESS, ASSIGN_PRACTITIONER_SUCCESS
} from '../EncountersPage/constants';
import {ADD_FORM_SUCCESS, EDIT_FORM_SUCCESS, SAVE_TEMPLATE_SUCCESS, 
  GET_ENCOUNTER_EVENTS_SUCCESS, REMOVE_FORM_SUCCESS, 
  CONFIRM_ENCOUNTER_EVENT_SUCCESS, REMOVE_ENCOUNTER_EVENT_SUCCESS} from '../EncounterEventsPage/constants';



export function objectsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIVATE_SUCCESS: case CONFIRM_ROLE_SUCCESS: case ASSIGN_PRACTITIONER_SUCCESS: 
    case ADD_FORM_SUCCESS: case EDIT_FORM_SUCCESS: case GET_ENCOUNTER_EVENTS_SUCCESS: 
    case SAVE_TEMPLATE_SUCCESS: case CONFIRM_ENCOUNTER_EVENT_SUCCESS: case LOAD_CACHE_SUCCESS:
      return state.mergeDeep({ objects: action.objects });
    case REMOVE_FORM_SUCCESS: case REMOVE_ENCOUNTER_EVENT_SUCCESS:
      return state.updateIn(['objects', action.entryType], (entries) => entries.filter((entry) => entry.get('id') !== action.entryId));
    case FORGET_SESSION_SUCCESS:
      // TCT: TODO Refactor! Reducers shouldn't calculate the state
      return state
        .updateIn(['objects', 'facilities'], (facilities) => facilities.filter((facility) => facility.get('id') !== action.facilityId))
        .updateIn(['objects', 'roles'], (roles) => roles.filter((role) => role.get('id') !== action.roleId))
        .updateIn(['objects', 'sessions'], (sessions) => sessions.filter((session) => session.get('id') !== action.sessionId));
    case LOGOUT_SUCCESS:
      return state
        .setIn(['objects', 'sessions', action.sessionId.toString(), 'token'], null);
    case GET_ENCOUNTERS_SUCCESS:
      return state
        .mergeDeep({ objects: action.normalizedResponse.objects });
    default:
      return state;
  }
}