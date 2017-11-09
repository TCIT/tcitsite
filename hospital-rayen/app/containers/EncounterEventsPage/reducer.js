import { fromJS } from 'immutable';
import { CONTROLS_CHANGED, LIST_FORMS, CHANGE_TAB,
  OPEN_FORM, CLOSE_FORM, OPEN_MODAL, CLEAN_FORM, CANCEL_MODAL, CLEAN_EDIT_FORM,
  ADD_FORM_SUCCESS,EDIT_FORM_SUCCESS,
  PREPARE_OBSERVATION, PREPARE_DIET, PREPARE_REST, PREPARE_PROCEDURE, SAVE_TEMPLATE_SUCCESS,
  CONFIRM_ENCOUNTER_EVENT_SUCCESS, REMOVE_ENCOUNTER_EVENT_SUCCESS,
  PREPARE_MEDICATION_REQUEST, PREPARE_MEDICATION_DILUTION, PREPARE_MEDICATION_ALTERNATIVE,
  PREPARE_ALERT, PREPARE_DIAGNOSIS, PREPARE_REFERRAL, PREPARE_SHIFT_CHANGE, CHANGE_HEIGHT,
  PREPARE, SEARCH, SEARCH_SUCCESS, SEARCH_CANCEL } from './constants';
const defaultFormControls = {
  observation: {
    id: null,
    selectedTemplateId: null,
    notes: '',
    hasReseachProtocol: false,
    protocoleNotes: '',
    saveTemplate: false,
    nameTemplate: '',
  },
  rest: {
    id: null,
    restId: null,
    observation: ''
  },
  diet: {
    id: null,
    dietId: null,
    observation: ''
  },
  procedure: {
    id: null,
    procedureId: null,
    healthCarePractitionerRoleId: null,
    sessionsQuantity: '',
    fundaments: ''
  },
  medicationRequest: {
    id: null,
    administrationNote: '',
    virtualMedicalProduct: null,
    virtualMedicalProductSearch: '',
    virtualMedicalProducts: [],
    searchingCache: false,
    posology: '',
    RouteAdministrationId: null
  },
  medicationDilution: {
    id: null,
    index: null,
    virtualMedicalProduct: null,
    virtualMedicalProductSearch: '',
    virtualMedicalProducts: [],
    searchingCache: false,
    quantity: null,
    medicationDilutionRequestEntryDetail: [],
    posology: '',
    administrationNote: ''
  },
  medicationAlternative: {
    id: null,
    product: '',
    routeAdministrationId: null,
    dose: '',
    doseFrecuency: '',
    doseDuration: '',
    doseInstructions: ''
  },
  diagnosis: {
    searchCode: '',
    searchText: '',
    textDiagnoses: [],
    codeDiagnoses: [],
    diagnosis: null,
    searchingCache: false,
    id: null,
    description: '',
    isGes: false,
    isEno: false,
    diagnosisEntryStateId: null,
    isMorbidity:  false,
    healthProblemId: null
  },
  referral: {
    id: null,
    referralType: null,
    healthCarePractitionerMedicalSpecialtyId: null,
    referralRequestReasonId: null,
    referralRequestPriorityId: null,
    referralRequestDiagnosis: [],
    clinicalFundament: '',
    observation: ''
  },
}
const defaultAlertControls = {
  alert: {
    id: null,
    observation: ''
  }
}
const defaultShiftChangeControls = {
  shiftChange: {
    id: null,
    observation: ''
  }
}
const defaultModals = {
  closeModal: false,
  cleanModal: false,
  confirmModal: false,
  cancelModal: false
}

// Estado inicial es hidratado desde INITIAL_CONTACTS
const initialState = fromJS({
  selectedForm: null,
  listForms: false,
  encounterEventId: null,
  controls: {
    form: defaultFormControls,
    alert: defaultAlertControls,
    shiftChange: defaultShiftChangeControls,
  },
  editingObject: {
    form: null,
    alert: null,
    shiftChange: null
  },
  closeModal: false,
  cleanModal: false,
  confirmModal: false,
  cancelModal: false,
  selectedTab: 0,
  modals: defaultModals,
  heights: {
    observation: 0,
    shiftChange: 0
  }
});

function encounterEventsReducer(state = initialState, action) {
  switch (action.type) {
    case CONTROLS_CHANGED:
      return state
        .mergeIn(['controls', action.instance, action.formCode], fromJS(action.controls));
    case CHANGE_HEIGHT:
      return state
        .setIn(['heights', action.section], action.value);
    case OPEN_MODAL:
      return state
        .mergeIn(['modals', action.modal], true);
    case CHANGE_TAB:
      return state.set('selectedTab', action.tabIndex);
    case LIST_FORMS:
      return state.set('listForms', !state.get('listForms'));
    case CANCEL_MODAL:
      return state
        .set('modals', fromJS(defaultModals));
    case OPEN_FORM:
      return state
        .set('selectedForm', action.formCode)
        .setIn(['controls', 'form'], fromJS(defaultFormControls))
        .set('encounterEventId', action.encounterEventId)
        .set('selectedTab', 0)
        .setIn(['editingObject', action.instance], null)
        .set('listForms', false);
    case CLEAN_EDIT_FORM:
      return state
        .setIn(['controls', 'form', action.editForm], fromJS(state.get('editingObject').get('form')))
        .setIn(['modals', 'cleanModal'], false);
    case CLEAN_FORM: case ADD_FORM_SUCCESS:
      return state
        .setIn(['controls', 'form'], fromJS(defaultFormControls))
        .setIn(['modals', 'cleanModal'], false);
    case SAVE_TEMPLATE_SUCCESS:
      return state
        .setIn(['controls', 'saveTemplate'], false)
    case PREPARE:
      return state
        .set('selectedForm', action.formCode)
        .set('selectedTab', action.tabIndex)
        .set('encounterEventId', action.editingObject.encounterEventId)
        .mergeIn(['controls', action.instance, action.entryType], action.editingObject)
        .mergeIn(['controls', action.instance, action.entryType], action.controls)
        .setIn(['editingObject', action.instance], action.editingObject);
    case CLOSE_FORM: case EDIT_FORM_SUCCESS:
      return state
        .set('selectedForm', null)
        .setIn(['controls', 'form'], fromJS(defaultFormControls))
        .setIn(['modals', 'closeModal'], false);
    case CONFIRM_ENCOUNTER_EVENT_SUCCESS:
      return state.setIn(['modals', 'confirmModal'], false);
    case REMOVE_ENCOUNTER_EVENT_SUCCESS:
      return state.setIn(['modals', 'cancelModal'], false);
    case SEARCH:
      return state
        .mergeIn(['controls', 'form', action.formCode], fromJS(action.controls))
        .setIn(['controls', 'form', action.formCode, action.objectClass], null)
        .setIn(['controls', 'form', action.formCode, action.resultsName], fromJS([]))
        .setIn(['controls', 'form', action.formCode, action.searchingCache], true);
    case SEARCH_CANCEL:
      return state
        .mergeIn(['controls', 'form', action.formCode], fromJS(action.controls))
        .setIn(['controls', 'form', action.formCode, action.resultsName], [])
        .setIn(['controls', 'form', action.formCode, action.searchingCache], false);
    case SEARCH_SUCCESS:
      if (state.get('controls').get('form').get(action.formCode).get(Object.keys(action.controls)[0]) === Object.values(action.controls)[0]) {
        return state
        .setIn(['controls', 'form', action.formCode, action.resultsName], fromJS(action.results))
        .setIn(['controls', 'form', action.formCode, action.searchingCache], false);
      } else {
        return state;
      }
    default:
      return state;
  }
}

export {
  encounterEventsReducer,
};


