import {
  LIST_FORMS, OPEN_FORM, CLOSE_FORM, CONTROLS_CHANGED, CHANGE_TAB,
  ADD_OBSERVATION, OPEN_MODAL, CLEAN_FORM, CANCEL_MODAL, CLEAN_EDIT_FORM,
  SAVE_TEMPLATE, SAVE_TEMPLATE_SUCCESS, GET_ENCOUNTER_EVENTS, GET_ENCOUNTER_EVENTS_SUCCESS,
  PREPARE_OBSERVATION, PREPARE_REST, PREPARE_DIET,PREPARE_PROCEDURE, PREPARE_MEDICATION_REQUEST,
  PREPARE_MEDICATION_DILUTION, PREPARE_MEDICATION_ALTERNATIVE,
  ADD_REST, ADD_DIET, ADD_FORM_SUCCESS, ADD_PROCEDURE, ADD_MEDICATION_REQUEST, 
  ADD_MEDICATION_DILUTION, ADD_MEDICATION_ALTERNATIVE, 
  EDIT_OBSERVATION, EDIT_REST, EDIT_DIET, EDIT_FORM_SUCCESS, EDIT_PROCEDURE, EDIT_MEDICATION_REQUEST,
  EDIT_MEDICATION_DILUTION, EDIT_MEDICATION_ALTERNATIVE,
  REMOVE_OBSERVATION, REMOVE_REST, REMOVE_DIET, REMOVE_FORM_SUCCESS, REMOVE_PROCEDURE, 
  REMOVE_MEDICATION_REQUEST, REMOVE_MEDICATION_DILUTION, REMOVE_MEDICATION_ALTERNATIVE,
  CONFIRM_ENCOUNTER_EVENT, CONFIRM_ENCOUNTER_EVENT_SUCCESS, REMOVE_ENCOUNTER_EVENT, REMOVE_ENCOUNTER_EVENT_SUCCESS,
  SUSPEND_PROCEDURE, SUSPEND_MEDICATION_REQUEST, SUSPEND_MEDICATION_DILUTION, SUSPEND_MEDICATION_ALTERNATIVE, 
  UNSUSPEND_PROCEDURE, UNSUSPEND_MEDICATION_REQUEST, UNSUSPEND_MEDICATION_DILUTION, UNSUSPEND_MEDICATION_ALTERNATIVE,
  PREPARE_ALERT, ADD_ALERT, EDIT_ALERT, REMOVE_ALERT, SUSPEND_ALERT, UNSUSPEND_ALERT,
  PREPARE_DIAGNOSIS, ADD_DIAGNOSIS, EDIT_DIAGNOSIS, REMOVE_DIAGNOSIS, SUSPEND_DIAGNOSIS, UNSUSPEND_DIAGNOSIS,
  PREPARE_REFERRAL, ADD_REFERRAL, EDIT_REFERRAL, REMOVE_REFERRAL, SUSPEND_REFERRAL, UNSUSPEND_REFERRAL,
  PREPARE_SHIFT_CHANGE, ADD_SHIFT_CHANGE, EDIT_SHIFT_CHANGE, REMOVE_SHIFT_CHANGE, SUSPEND_SHIFT_CHANGE, UNSUSPEND_SHIFT_CHANGE,
  PREPARE, CHANGE_HEIGHT, SEARCH, SEARCH_SUCCESS, SEARCH_CANCEL
} from './constants';

export function listForms() {
  return {
    type: LIST_FORMS
  };
}
export function openForm(formCode, encounterEventId) {
  return {
    type: OPEN_FORM, formCode, encounterEventId
  };
}
export function openModal(modal) {
  return {
    type: OPEN_MODAL, modal
  };
}
export function closeForm() {
  return {
    type: CLOSE_FORM
  };
}
export function cleanEditForm(editForm) {
  return {
    type: CLEAN_EDIT_FORM, editForm
  };
}
export function cleanForm() {
  return {
    type: CLEAN_FORM
  };
}
export function cancelModal() {
  return {
    type: CANCEL_MODAL
  };
}
export function controlsChanged(controls, formCode, instance = 'form') {
  return {
    type: CONTROLS_CHANGED, controls, instance, formCode
  };
}
export function changeHeight(section, value) {
  return {
    type: CHANGE_HEIGHT, section, value
  };
}
export function changeTab(tabIndex) {
  return {
    type: CHANGE_TAB, tabIndex
  };
}
export function prepare(formCode, tabIndex, instance, entryType, editingObject, controls={}) {
  return {
    type: PREPARE, formCode, tabIndex, instance, editingObject, entryType, controls
  };
}
export function addObservation(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_OBSERVATION, encounterEventId, encounterId, userId, controls
  };
}
export function addRest(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_REST, encounterEventId, encounterId, userId, controls
  };
}
export function addDiet(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_DIET, encounterEventId, encounterId, userId, controls
  };
}
export function addFormSuccess(objects, instance) {
  if (!instance) {
    instance = 'form';
  }
  return {
    type: ADD_FORM_SUCCESS, objects, instance
  };
}
export function saveTemplate(name, text, userId, facilityId) {
  return {
    type: SAVE_TEMPLATE, name, text, userId, facilityId
  };
}
export function saveTemplateSuccess(objects) {
  return {
    type: SAVE_TEMPLATE_SUCCESS, objects
  };
}
export function getEncounterEvents(encounterId) {
  return {
    type: GET_ENCOUNTER_EVENTS, encounterId
  };
}
export function getEncounterEventsSuccess(objects) {
  return {
    type: GET_ENCOUNTER_EVENTS_SUCCESS, objects
  };
}
export function editObservation(controls, editingObject) {
  return {
    type: EDIT_OBSERVATION, controls, editingObject
  };
}
export function editRest(controls, editingObject) {
  return {
    type: EDIT_REST, controls, editingObject
  };
}
export function editDiet(controls, editingObject) {
  return {
    type: EDIT_DIET, controls, editingObject
  };
}
export function editFormSuccess(objects, instance) {
  if (!instance) {
    instance = 'form';
  }
  return {
    type: EDIT_FORM_SUCCESS, objects, instance
  };
}
export function removeObservation(encounterId, encounterEventId, observationEntryId, timestamp) {
  return {
    type: REMOVE_OBSERVATION, encounterId, encounterEventId, observationEntryId, timestamp
  };
}
export function removeRest(encounterId, encounterEventId, restEntryId, timestamp) {
  return {
    type: REMOVE_REST, encounterId, encounterEventId, restEntryId, timestamp
  };
}
export function removeDiet(encounterId, encounterEventId, dietEntryId, timestamp) {
  return {
    type: REMOVE_DIET, encounterId, encounterEventId, dietEntryId, timestamp
  };
}
export function removeFormSuccess(entryType, entryId) {
  return {
    type: REMOVE_FORM_SUCCESS, entryType, entryId
  };
}
export function confirmEncounterEvent(encounterEvent, practitionerId) {
  return {
    type: CONFIRM_ENCOUNTER_EVENT, encounterEvent, practitionerId
  };
}
export function confirmEncounterEventSuccess(objects) {
  return {
    type: CONFIRM_ENCOUNTER_EVENT_SUCCESS, objects
  };
}
export function removeEncounterEvent(encounterEvent, practitionerId) {
  return {
    type: REMOVE_ENCOUNTER_EVENT, encounterEvent, practitionerId
  };
}
export function removeEncounterEventSuccess(entryType, entryId) {
  return {
    type: REMOVE_ENCOUNTER_EVENT_SUCCESS, entryType, entryId
  };
}
export function addProcedure(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_PROCEDURE, encounterEventId, encounterId, userId, controls
  };
}
export function addMedicationRequest(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_MEDICATION_REQUEST, encounterEventId, encounterId, userId, controls
  };
}
export function addMedicationDilution(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_MEDICATION_DILUTION, encounterEventId, encounterId, userId, controls
  };
}
export function addMedicationAlternative(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_MEDICATION_ALTERNATIVE, encounterEventId, encounterId, userId, controls
  };
}

export function editProcedure(controls, editingObject) {
  return {
    type: EDIT_PROCEDURE, controls, editingObject
  };
}
export function editMedicationRequest(controls, editingObject) {
  return {
    type: EDIT_MEDICATION_REQUEST, controls, editingObject
  };
}
export function editMedicationDilution(controls, editingObject) {
  return {
    type: EDIT_MEDICATION_DILUTION, controls, editingObject
  };
}
export function editMedicationAlternative(controls, editingObject) {
  return {
    type: EDIT_MEDICATION_ALTERNATIVE, controls, editingObject
  };
}
export function removeProcedure(procedureEntry) {
  return {
    type: REMOVE_PROCEDURE, procedureEntry
  };
}
export function removeMedicationRequest(medicationRequestEntry) {
  return {
    type: REMOVE_MEDICATION_REQUEST, medicationRequestEntry
  };
}
export function removeMedicationDilution(medicationDilutionEntry) {
  return {
    type: REMOVE_MEDICATION_DILUTION, medicationDilutionEntry
  };
}
export function removeMedicationAlternative(medicationAlternativeEntry) {
  return {
    type: REMOVE_MEDICATION_ALTERNATIVE, medicationAlternativeEntry
  };
}
export function suspendProcedure(procedureEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_PROCEDURE, procedureEntry, encounterEventId, userId
  };
}
export function suspendMedicationRequest(medicationRequestEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_MEDICATION_REQUEST, medicationRequestEntry, encounterEventId, userId
  };
}
export function suspendMedicationDilution(medicationDilutionEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_MEDICATION_DILUTION, medicationDilutionEntry, encounterEventId, userId
  };
}
export function suspendMedicationAlternative(medicationAlternativeEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_MEDICATION_ALTERNATIVE, medicationAlternativeEntry, encounterEventId, userId
  };
}
export function unsuspendProcedure(procedureEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_PROCEDURE, procedureEntry, encounterEventId, userId
  };
}
export function unsuspendMedicationRequest(medicationRequestEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_MEDICATION_REQUEST, medicationRequestEntry, encounterEventId, userId
  };
}
export function unsuspendMedicationDilution(medicationDilutionEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_MEDICATION_DILUTION, medicationDilutionEntry, encounterEventId, userId
  };
}
export function unsuspendMedicationAlternative(medicationAlternativeEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_MEDICATION_ALTERNATIVE, medicationAlternativeEntry, encounterEventId, userId
  };
}
export function prepareAlert(alertEntry) {
  return {
    type: PREPARE_ALERT, alertEntry
  };
}
export function addAlert(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_ALERT, encounterEventId, encounterId, userId, controls
  };
}
export function editAlert(controls, editingObject) {
  return {
    type: EDIT_ALERT, controls, editingObject
  };
}
export function removeAlert(alertEntry) {
  return {
    type: REMOVE_ALERT, alertEntry
  };
}
export function suspendAlert(alertEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_ALERT, alertEntry, encounterEventId, userId
  };
}
export function unsuspendAlert(alertEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_ALERT, alertEntry, encounterEventId, userId
  };
}
export function prepareDiagnosis(diagnosisEntry) {
  return {
    type: PREPARE_DIAGNOSIS, diagnosisEntry
  };
}
export function addDiagnosis(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_DIAGNOSIS, encounterEventId, encounterId, userId, controls
  };
}
export function editDiagnosis(controls, editingObject) {
  return {
    type: EDIT_DIAGNOSIS, controls, editingObject
  };
}
export function removeDiagnosis(diagnosisEntry) {
  return {
    type: REMOVE_DIAGNOSIS, diagnosisEntry
  };
}
export function suspendDiagnosis(diagnosisEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_DIAGNOSIS, diagnosisEntry, encounterEventId, userId
  };
}
export function unsuspendDiagnosis(diagnosisEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_DIAGNOSIS, diagnosisEntry, encounterEventId, userId
  };
}
export function prepareReferral(referralEntry) {
  return {
    type: PREPARE_REFERRAL, referralEntry
  };
}
export function addReferral(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_REFERRAL, encounterEventId, encounterId, userId, controls
  };
}
export function editReferral(controls, editingObject) {
  return {
    type: EDIT_REFERRAL, controls, editingObject
  };
}
export function removeReferral(referralEntry) {
  return {
    type: REMOVE_REFERRAL, referralEntry
  };
}
export function suspendReferral(referralEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_REFERRAL, referralEntry, encounterEventId, userId
  };
}
export function unsuspendReferral(referralEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_REFERRAL, referralEntry, encounterEventId, userId
  };
}
export function prepareShiftChange(shiftChangeEntry) {
  return {
    type: PREPARE_SHIFT_CHANGE, shiftChangeEntry
  };
}
export function addShiftChange(encounterEventId, encounterId, userId, controls) {
  return {
    type: ADD_SHIFT_CHANGE, encounterEventId, encounterId, userId, controls
  };
}
export function editShiftChange(controls, editingObject) {
  return {
    type: EDIT_SHIFT_CHANGE, controls, editingObject
  };
}
export function removeShiftChange(shiftChangeEntry) {
  return {
    type: REMOVE_SHIFT_CHANGE, shiftChangeEntry
  };
}
export function suspendShiftChange(shiftChangeEntry, encounterEventId, userId) {
  return {
    type: SUSPEND_SHIFT_CHANGE, shiftChangeEntry, encounterEventId, userId
  };
}
export function unsuspendShiftChange(shiftChangeEntry, encounterEventId, userId) {
  return {
    type: UNSUSPEND_SHIFT_CHANGE, shiftChangeEntry, encounterEventId, userId
  };
}
export function search(controls, objectClass, formCode, resultsName, fieldToSearch, objectName, searchingCache = 'searchingCache') {
  const value = Object.values(controls)[0];
  let payload = {};
  if (value.length > 0) {
    payload = {
      type: SEARCH,
      controls,
      objectClass,
      formCode,
      resultsName,
      fieldToSearch,
      objectName,
      searchingCache
    };
  } else {
    payload = {
      type: SEARCH_CANCEL,
      formCode,
      resultsName,
      controls,
      searchingCache
    };
  }
  return payload;
}

export function searchSuccess(objectClass, formCode, resultsName, results, searchingCache, controls) {
  return {
    type: SEARCH_SUCCESS,
    formCode,
    resultsName,
    results,
    searchingCache,
    controls
  };
}
