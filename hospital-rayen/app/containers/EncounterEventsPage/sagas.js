import regeneratorRuntime from "regenerator-runtime";
import { push } from 'react-router-redux';
import { call, takeLatest, fork, take, cancel, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import get, { del, post, putRequest } from '../../services/apiFetch.js';
import { GET_ENCOUNTER_EVENTS, SAVE_TEMPLATE, 
  ADD_OBSERVATION, ADD_REST, ADD_DIET, ADD_PROCEDURE, ADD_MEDICATION_REQUEST, 
  ADD_MEDICATION_DILUTION, ADD_MEDICATION_ALTERNATIVE, 
  EDIT_OBSERVATION, EDIT_REST, EDIT_DIET, EDIT_PROCEDURE, EDIT_MEDICATION_REQUEST,
  EDIT_MEDICATION_DILUTION, EDIT_MEDICATION_ALTERNATIVE,
  REMOVE_OBSERVATION, REMOVE_REST, REMOVE_DIET, REMOVE_PROCEDURE, 
  REMOVE_MEDICATION_REQUEST, REMOVE_MEDICATION_DILUTION, REMOVE_MEDICATION_ALTERNATIVE,
  CONFIRM_ENCOUNTER_EVENT, REMOVE_ENCOUNTER_EVENT, 
  SUSPEND_PROCEDURE, SUSPEND_MEDICATION_REQUEST, SUSPEND_MEDICATION_DILUTION, 
  SUSPEND_MEDICATION_ALTERNATIVE, 
  UNSUSPEND_PROCEDURE, UNSUSPEND_MEDICATION_REQUEST, UNSUSPEND_MEDICATION_DILUTION, 
  UNSUSPEND_MEDICATION_ALTERNATIVE,
  ADD_ALERT, EDIT_ALERT, REMOVE_ALERT, SUSPEND_ALERT, UNSUSPEND_ALERT,
  ADD_DIAGNOSIS, EDIT_DIAGNOSIS, REMOVE_DIAGNOSIS, SUSPEND_DIAGNOSIS, UNSUSPEND_DIAGNOSIS,
  ADD_REFERRAL, EDIT_REFERRAL, REMOVE_REFERRAL, SUSPEND_REFERRAL, UNSUSPEND_REFERRAL,
  ADD_SHIFT_CHANGE, EDIT_SHIFT_CHANGE, REMOVE_SHIFT_CHANGE, SUSPEND_SHIFT_CHANGE, UNSUSPEND_SHIFT_CHANGE,
  SEARCH } from './constants';
import { saveTemplateSuccess, addFormSuccess, editFormSuccess, getEncounterEventsSuccess,
confirmEncounterEventSuccess, removeEncounterEventSuccess, removeFormSuccess, searchSuccess } from './actions';
import { setNotification } from '../App/actions';
import encounterSchema from '../../schemas/encounter';
import normalize from '../../schemas/normalizer';
import { multipleArrayFilter, multipleArraySort, multipleHighlightTerms} from '../../utils/search-in-array';

function* getEncounterEvents() {
  yield takeLatest(GET_ENCOUNTER_EVENTS, function* (action) {
    const responseEncounter = yield call(get, `/encounter/${action.encounterId}`);
    //yield call(get, `/encounter/${action.encounterId}/encounterEvent`);
    const normalizedResponse = normalize(responseEncounter, encounterSchema);
    const objects = normalizedResponse.objects;
    //yield call(get, `/encounter/39/encounterEvent/31/VitalSign/byData`);
    yield put(getEncounterEventsSuccess(objects));
  });
}

function addEncounterEvent(encounterId, userId) {
  return post(`/encounter/${encounterId}/encounterEvent`,{
    "Id": "0",
    "EncounterId": encounterId,
    "HealthCarePractitionerId": userId,
    "Deleted": "false"
  });
}
function* saveTemplate() {
  yield takeLatest(SAVE_TEMPLATE, function* (action) {
    const template = yield call(post, `/core/template/`,{
      "healthCarePractitionerId": action.userId,
      "facilityId": action.facilityId,
      "templateText": action.text,
      "name": action.name,
      "type": 1
    });
    const objects = {templates: {}};
    objects.templates[template.id] = template;
    yield put(saveTemplateSuccess(objects));
  });
}
// OBSERVATION
function* addObservation() {
  yield takeLatest(ADD_OBSERVATION, function* (action) {
    const encounterId = action.encounterId;
    const objects = {encounterEvents: {}, observationEntries: {}};
    let encounterEventId = action.encounterEventId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      confidentialityLevelId: 4,
      notes: action.controls.notes,
      hasReseachProtocol: action.controls.searchProtocol,
      protocoleNotes: action.controls.protocolNotes,
      encounterEventId: encounterEventId
    };
    const observationEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/observationEntry/`, payload);
    objects.observationEntries[observationEntry.id] = observationEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Observación creada'));
  });
}
function* editObservation() {
  yield takeLatest(EDIT_OBSERVATION, function* (action) {
    let observationEntry = action.editingObject;
    const encounterEventId = observationEntry.encounterEventId;
    const encounterId = observationEntry.encounterEvent().encounterId;
    const objects = {observationEntries: {}};
    const payload = {
      id: observationEntry.id,
      confidentialityLevelId: 4,
      notes: action.controls.notes,
      hasReseachProtocol: action.controls.searchProtocol,
      protocoleNotes: action.controls.protocolNotes,
      encounterEventId: encounterEventId,
      timestamp: observationEntry.timestamp
    };
    observationEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/observationEntry/${observationEntry.id}/updatedCurrentEntry`, payload);
    objects.observationEntries[observationEntry.id] = observationEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Observación editada'));
  });
}
function* removeObservation() {
  yield takeLatest(REMOVE_OBSERVATION, function* (action) {
    const response = yield call(del, `/encounter/${action.encounterId}/encounterEvent/${action.encounterEventId}/observationEntry/${action.observationEntryId}?tid=${action.timestamp}`);
    yield put(removeFormSuccess('observationEntries',action.observationEntryId));
    yield put(setNotification('Observación eliminada'));
  });
}
// REST
function* addRest() {
  yield takeLatest(ADD_REST, function* (action) {
    const encounterId = action.encounterId;
    const objects = {encounterEvents: {}, restEntries: {}};
    let encounterEventId = action.encounterEventId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      restId: action.controls.restId,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4
    };
    const restEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/restEntry/`,payload);
    objects.restEntries[restEntry.id] = restEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Reposo creado'));
  });
}
function* editRest() {
  yield takeLatest(EDIT_REST, function* (action) {
    let restEntry = action.editingObject;
    const encounterEventId = restEntry.encounterEventId;
    const encounterId = restEntry.encounterEvent().encounterId;
    const objects = {restEntries: {}};
    const payload = {
      id: restEntry.id,
      restId: action.controls.restId,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
      timestamp: restEntry.timestamp
    };
    restEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/restEntry/${restEntry.id}/updatedCurrentEntry`, payload);
    objects.restEntries[restEntry.id] = restEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Reposo editado'));
  });
}
function* removeRest() {
  yield takeLatest(REMOVE_REST, function* (action) {
    const response = yield call(del, `/encounter/${action.encounterId}/encounterEvent/${action.encounterEventId}/restEntry/${action.restEntryId}?tid=${action.timestamp}`);
    yield put(removeFormSuccess('restEntries',action.restEntryId));
    yield put(setNotification('Reposo eliminado'));
  });
}
// DIET
function* addDiet() {
  yield takeLatest(ADD_DIET, function* (action) {
    const encounterId = action.encounterId;
    const objects = {encounterEvents: {}, dietEntries: {}};
    let encounterEventId = action.encounterEventId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      dietId: action.controls.dietId,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4
    };
    const dietEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/nutritionOrderEntry/`,payload);
    objects.dietEntries[dietEntry.id] = dietEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Régimen creado'));
  });
}
function* editDiet() {
  yield takeLatest(EDIT_DIET, function* (action) {
    let dietEntry = action.editingObject;
    const encounterEventId = dietEntry.encounterEventId;
    const encounterId = dietEntry.encounterEvent().encounterId;
    const objects = {dietEntries: {}};
    const payload = {
      id: dietEntry.id,
      dietId: action.controls.dietId,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
      timestamp: dietEntry.timestamp
    };
    dietEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/nutritionOrderEntry/${dietEntry.id}/updatedCurrentEntry`, payload);
    objects.dietEntries[dietEntry.id] = dietEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Régimen editado'));
  });
}
function* removeDiet() {
  yield takeLatest(REMOVE_DIET, function* (action) {
    const response = yield call(del, `/encounter/${action.encounterId}/encounterEvent/${action.encounterEventId}/nutritionOrderEntry/${action.dietEntryId}?tid=${action.timestamp}`);
    yield put(removeFormSuccess('dietEntries',action.dietEntryId));
    yield put(setNotification('Régimen eliminado'));
  });
}
function* confirmEncounterEvent() {
  yield takeLatest(CONFIRM_ENCOUNTER_EVENT, function* (action) {
    const objects = {encounterEvents: {}};
    const payload = {
      id: action.encounterEvent.id,
      encounterId: action.encounterEvent.encounterId,
      healthCarePractitionerLegalId: action.practitionerId,
      timestamp: action.encounterEvent.timestamp
    };
    const encounter = yield call(putRequest, `/encounter/${action.encounterEvent.encounterId}/encounterEvent/${action.encounterEvent.id}/confirmedEncounterEvent`,payload);
    const encounterEvent = encounter.encounterEvent.pop();
    objects.encounterEvents[encounterEvent.id] = encounterEvent;
    yield put(confirmEncounterEventSuccess(objects));
  });
}
function* removeEncounterEvent() {
  yield takeLatest(REMOVE_ENCOUNTER_EVENT, function* (action) {
    const response = yield call(del, `/encounter/${action.encounterEvent.encounterId}/encounterEvent/${action.encounterEvent.id}?tid=${action.encounterEvent.timestamp}`);
    yield put(removeEncounterEventSuccess('encounterEvents',action.encounterEvent.id));
  });
}
// PROCEDURE
function* addProcedure() {
  yield takeLatest(ADD_PROCEDURE, function* (action) {
    const encounterId = action.encounterId;
    let encounterEventId = action.encounterEventId;
    const objects = {encounterEvents: {}, procedureEntries: {}};
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      procedureId: action.controls.procedureId,
      healthCarePractitionerRoleId: action.controls.healthCarePractitionerRoleId,
      sessionsQuantity: action.controls.sessionsQuantity,
      fundaments: action.controls.fundaments,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 1,
      suspended: false
    };
    const procedureEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/procedureEntry/`, payload);
    objects.procedureEntries[procedureEntry.id] = procedureEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Procedimiento creado'));
  });
}
function* editProcedure() {
  yield takeLatest(EDIT_PROCEDURE, function* (action) {
    let procedureEntry = action.editingObject;
    const encounterEventId = procedureEntry.encounterEventId;
    const encounterId = procedureEntry.encounterEvent().encounterId;
    const objects = {procedureEntries: {}};
    const payload = {
      id: procedureEntry.id,
      guid: procedureEntry.guid,
      suspended: procedureEntry.suspended,
      procedureId: action.controls.procedureId,
      healthCarePractitionerRoleId: action.controls.healthCarePractitionerRoleId,
      sessionsQuantity: action.controls.sessionsQuantity,
      fundaments: action.controls.fundaments,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 1,
      timestamp: procedureEntry.timestamp
    };
    procedureEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/procedureEntry/${procedureEntry.id}/updatedCurrentEntry`, payload);
    objects.procedureEntries[procedureEntry.id] = procedureEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Procedimiento editado'));
  });
}
function* removeProcedure() {
  yield takeLatest(REMOVE_PROCEDURE, function* (action) {
    const procedureEntry = action.procedureEntry;
    const encounterEvent = procedureEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/procedureEntry/${procedureEntry.id}?tid=${procedureEntry.timestamp}`);
    yield put(removeFormSuccess('procedureEntries',action.procedureEntry.id));
    yield put(setNotification('Procedimiento eliminado'));
  });
}
function* suspendProcedure() {
  yield takeLatest(SUSPEND_PROCEDURE, function* (action) {
    const objects = {procedureEntries: {}, encounterEvents:{}};
    let procedureEntry = action.procedureEntry;
    const encounterEvent = procedureEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounter;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: true,
      encounterEventId: encounterEventId,
      id: procedureEntry.id,
      timestamp: procedureEntry.timestamp
    };
    procedureEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/procedureEntry/${procedureEntry.id}/suspendedEntry?tid=${procedureEntry.timestamp}`, payload);
    
    objects.procedureEntries[procedureEntry.id] = procedureEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendProcedure() {
  yield takeLatest(UNSUSPEND_PROCEDURE, function* (action) {
    const objects = {procedureEntries: {}, encounterEvents:{}};
    let procedureEntry = action.procedureEntry;
    const encounterEvent = procedureEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: false,
      encounterEventId: encounterEventId,
      id: procedureEntry.id,
      timestamp: procedureEntry.timestamp
    };
    procedureEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/procedureEntry/${procedureEntry.id}/suspendedEntry?tid=${procedureEntry.timestamp}`, payload);
    objects.procedureEntries[procedureEntry.id] = procedureEntry;
    yield put(editFormSuccess(objects));
  });
}
// MEDICATION_REQUEST
function* addMedicationRequest() {
  yield takeLatest(ADD_MEDICATION_REQUEST, function* (action) {
    const encounterId = action.encounterId;
    const objects = {encounterEvents: {}, medicationRequestEntries: {}};
    let encounterEventId = action.encounterEventId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      administrationNote: action.controls.administrationNote,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
      posology: action.controls.posology,
      virtualMedicalProductId: action.controls.virtualMedicalProduct.id,
      routeAdministrationId: action.controls.routeAdministrationId,
      actualMedicalProductId: 1,
      suspended: false
    };
    payload.encounterEventId = encounterEventId;
    const medicationRequestEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationRequestEntry/`,payload);
    objects.medicationRequestEntries[medicationRequestEntry.id] = medicationRequestEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Medicamento creado'));
  });
}
function* editMedicationRequest() {
  yield takeLatest(EDIT_MEDICATION_REQUEST, function* (action) {
    let medicationRequestEntry = action.editingObject;
    const encounterEventId = medicationRequestEntry.encounterEventId;
    const encounterId = medicationRequestEntry.encounterEvent().encounterId;
    const objects = {medicationRequestEntries: {}};
    const payload = {
      id: medicationRequestEntry.id,
      encounterEventId: encounterEventId,
      timestamp: medicationRequestEntry.timestamp,
      guid: medicationRequestEntry.guid,
      administrationNote: action.controls.administrationNote, 
      confidentialityLevelId: 1,
      posology: action.controls.posology,
      virtualMedicalProductId: action.controls.virtualMedicalProduct.id,
      routeAdministrationId: action.controls.routeAdministrationId,
      actualMedicalProductId: medicationRequestEntry.actualMedicalProductId,
      suspended: medicationRequestEntry.suspended,
    };
    medicationRequestEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationRequestEntry/${medicationRequestEntry.id}/updatedCurrentEntry`, payload);
    objects.medicationRequestEntries[medicationRequestEntry.id] = medicationRequestEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Medicamento editado'));
  });
}
function* removeMedicationRequest() {
  yield takeLatest(REMOVE_MEDICATION_REQUEST, function* (action) {
    const medicationRequestEntry = action.medicationRequestEntry;
    const encounterEvent = medicationRequestEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationRequestEntry/${medicationRequestEntry.id}?tid=${medicationRequestEntry.timestamp}`);
    yield put(removeFormSuccess('medicationRequestEntries',action.medicationRequestEntry.id));
    yield put(setNotification('Medicamento eliminado'));
  });
}
function* suspendMedicationRequest() {
  yield takeLatest(SUSPEND_MEDICATION_REQUEST, function* (action) {
    const objects = {encounterEvents: {}, medicationRequestEntries: {}};
    let medicationRequestEntry = action.medicationRequestEntry;
    const encounterEvent = medicationRequestEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: true,
      encounterEventId: encounterEventId,
      id: medicationRequestEntry.id,
      timestamp: medicationRequestEntry.timestamp
    };
    medicationRequestEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationRequestEntry/${medicationRequestEntry.id}/suspendedEntry?tid=${medicationRequestEntry.timestamp}`, payload);
    
    objects.medicationRequestEntries[medicationRequestEntry.id] = medicationRequestEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendMedicationRequest() {
  yield takeLatest(UNSUSPEND_MEDICATION_REQUEST, function* (action) {
    const objects = {encounterEvents: {}, medicationRequestEntries: {}};
    let medicationRequestEntry = action.medicationRequestEntry;
    const encounterEvent = medicationRequestEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: false,
      id: medicationRequestEntry.id,
      encounterEventId: encounterEventId,
      timestamp: medicationRequestEntry.timestamp
    };
    medicationRequestEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationRequestEntry/${medicationRequestEntry.id}/suspendedEntry?tid=${medicationRequestEntry.timestamp}`, payload);
    objects.medicationRequestEntries[medicationRequestEntry.id] = medicationRequestEntry;
    yield put(editFormSuccess(objects));
  });
}
// MEDICATION_DILUTION
function* addMedicationDilution() {
  yield takeLatest(ADD_MEDICATION_DILUTION, function* (action) {
    const encounterId = action.encounterId;
    const objects = {encounterEvents: {}, medicationDilutionEntries: {}};
    let encounterEventId = action.encounterEventId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      medicationDilutionRequestEntryDetail: action.controls.medicationDilutionRequestEntryDetail,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
      suspended: false,
      posology: action.controls.posology,
      administrationNote: action.controls.administrationNote
    };
    payload.encounterEventId = encounterEventId;
    const medicationDilutionEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationDilutionRequestEntry/`,payload);
    objects.medicationDilutionEntries[medicationDilutionEntry.id] = medicationDilutionEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Medicamento creado'));
  });
}
function* editMedicationDilution() {
  yield takeLatest(EDIT_MEDICATION_DILUTION, function* (action) {
    let medicationDilutionEntry = action.editingObject;
    const encounterEventId = medicationDilutionEntry.encounterEventId;
    const encounterId = medicationDilutionEntry.encounterEvent().encounterId;
    const objects = {medicationDilutionEntries: {}};
    const payload = { 
      id: medicationDilutionEntry.id,
      timestamp: medicationDilutionEntry.timestamp,
      guid: medicationDilutionEntry.guid,
      suspended: medicationDilutionEntry.suspended,
      medicationDilutionRequestEntryDetail: action.controls.medicationDilutionRequestEntryDetail,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
      posology: action.controls.posology,
      administrationNote: action.controls.administrationNote
    };
    medicationDilutionEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationDilutionRequestEntry/${medicationDilutionEntry.id}/updatedCurrentEntry`, payload);
    objects.medicationDilutionEntries[medicationDilutionEntry.id] = medicationDilutionEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Medicamento editado'));
  });
}
function* removeMedicationDilution() {
  yield takeLatest(REMOVE_MEDICATION_DILUTION, function* (action) {
    const medicationDilutionEntry = action.medicationDilutionEntry;
    const encounterEvent = medicationDilutionEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationDilutionRequestEntry/${medicationDilutionEntry.id}?tid=${medicationDilutionEntry.timestamp}`);
    yield put(removeFormSuccess('medicationDilutionEntries',medicationDilutionEntry.id));
    yield put(setNotification('Medicamento eliminado'));
  });
}
function* suspendMedicationDilution() {
  yield takeLatest(SUSPEND_MEDICATION_DILUTION, function* (action) {
    const objects = {encounterEvents: {}, medicationDilutionEntries: {}};
    let medicationDilutionEntry = action.medicationDilutionEntry;
    const encounterEvent = medicationDilutionEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: true,
      id: medicationDilutionEntry.id,
      encounterEventId: encounterEventId,
      timestamp: medicationDilutionEntry.timestamp
    };
    medicationDilutionEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationDilutionRequestEntry/${medicationDilutionEntry.id}/suspendedEntry?tid=${medicationDilutionEntry.timestamp}`, payload);
    objects.medicationDilutionEntries[medicationDilutionEntry.id] = medicationDilutionEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendMedicationDilution() {
  yield takeLatest(UNSUSPEND_MEDICATION_DILUTION, function* (action) {
    const objects = {encounterEvents: {}, medicationDilutionEntries: {}};
    let medicationDilutionEntry = action.medicationDilutionEntry;
    const encounterEvent = medicationDilutionEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: false,
      id: medicationDilutionEntry.id,
      encounterEventId: encounterEventId,
      timestamp: medicationDilutionEntry.timestamp
    };
    medicationDilutionEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/medicationDilutionRequestEntry/${medicationDilutionEntry.id}/suspendedEntry?tid=${medicationDilutionEntry.timestamp}`, payload);
    objects.medicationDilutionEntries[medicationDilutionEntry.id] = medicationDilutionEntry;
    yield put(editFormSuccess(objects));
  });
}
// MEDICATION_ALTERNATIVE
function* addMedicationAlternative() {
  yield takeLatest(ADD_MEDICATION_ALTERNATIVE, function* (action) {
    const encounterId = action.encounterId;
    const objects = {encounterEvents: {}, medicationAlternativeEntries: {}};
    let encounterEventId = action.encounterEventId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      product: action.controls.product,
      routeAdministrationId: action.controls.routeAdministrationId,
      dose: action.controls.dose,
      doseFrecuency: action.controls.doseFrecuency,
      doseDuration: action.controls.doseDuration,
      doseInstructions: action.controls.doseInstructions,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
      suspended: false
    };
    payload.encounterEventId = encounterEventId;
    const medicationAlternativeEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alternativeMedicationRequestEntry/`, payload);
    objects.medicationAlternativeEntries[medicationAlternativeEntry.id] = medicationAlternativeEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Medicamento creado'));
  });
}
function* editMedicationAlternative() {
  yield takeLatest(EDIT_MEDICATION_ALTERNATIVE, function* (action) {
    let medicationAlternativeEntry = action.editingObject;
    const encounterEventId = medicationAlternativeEntry.encounterEventId;
    const encounterId = medicationAlternativeEntry.encounterEvent().encounterId;
    const objects = {medicationAlternativeEntries: {}};
    const payload = { 
      id: medicationAlternativeEntry.id,
      timestamp: medicationAlternativeEntry.timestamp,
      guid: medicationAlternativeEntry.guid,
      suspended: medicationAlternativeEntry.suspended,
      product: action.controls.product,
      routeAdministrationId: action.controls.routeAdministrationId,
      dose: action.controls.dose,
      doseFrecuency: action.controls.doseFrecuency,
      doseDuration: action.controls.doseDuration,
      doseInstructions: action.controls.doseInstructions,
      encounterEventId: encounterEventId,
      confidentialityLevelId: 4,
    };
    medicationAlternativeEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alternativeMedicationRequestEntry/${medicationAlternativeEntry.id}/updatedCurrentEntry`, payload);
    objects.medicationAlternativeEntries[medicationAlternativeEntry.id] = medicationAlternativeEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Medicamento editado'));
  });
}
function* removeMedicationAlternative() {
  yield takeLatest(REMOVE_MEDICATION_ALTERNATIVE, function* (action) {
    const medicationAlternativeEntry = action.medicationAlternativeEntry;
    const encounterEvent = medicationAlternativeEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alternativeMedicationRequestEntry/${medicationAlternativeEntry.id}?tid=${medicationAlternativeEntry.timestamp}`);
    yield put(removeFormSuccess('medicationAlternativeEntries',medicationAlternativeEntry.id));
    yield put(setNotification('Medicamento eliminado'));
  });
}
function* suspendMedicationAlternative() {
  yield takeLatest(SUSPEND_MEDICATION_ALTERNATIVE, function* (action) {
    const objects = {encounterEvents: {}, medicationAlternativeEntries: {}};
    let medicationAlternativeEntry = action.medicationAlternativeEntry;
    const encounterEvent = medicationAlternativeEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    console.log("ENCID")
    console.log(encounterEventId)
    if (!encounterEventId) {
      console.log("ENYTRR")
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: true,
      id: medicationAlternativeEntry.id,
      encounterEventId: encounterEventId,
      timestamp: medicationAlternativeEntry.timestamp
    };
    medicationAlternativeEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alternativeMedicationRequestEntry/${medicationAlternativeEntry.id}/suspendedEntry?tid=${medicationAlternativeEntry.timestamp}`, payload);
    objects.medicationAlternativeEntries[medicationAlternativeEntry.id] = medicationAlternativeEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendMedicationAlternative() {
  yield takeLatest(UNSUSPEND_MEDICATION_ALTERNATIVE, function* (action) {
    const objects = {encounterEvents: {}, medicationAlternativeEntries: {}};
    let medicationAlternativeEntry = action.medicationAlternativeEntry;
    const encounterEvent = medicationAlternativeEntry.encounterEvent();
    let encounterEventId = encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      suspended: false,
      id: medicationAlternativeEntry.id,
      encounterEventId: encounterEventId,
      timestamp: medicationAlternativeEntry.timestamp
    };
    medicationAlternativeEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alternativeMedicationRequestEntry/${medicationAlternativeEntry.id}/suspendedEntry?tid=${medicationAlternativeEntry.timestamp}`, payload);
    objects.medicationAlternativeEntries[medicationAlternativeEntry.id] = medicationAlternativeEntry;
    yield put(editFormSuccess(objects));
  });
}
// ALERT
function* addAlert() {
  yield takeLatest(ADD_ALERT, function* (action) {
    const encounterId = action.encounterId;
    let encounterEventId = action.encounterEventId;
    const objects = {encounterEvents: {}, alertEntries: {}};
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      confidentialityLevelId: 1,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      archived: false
    };
    const alertEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alertEntry/`, payload);
    objects.alertEntries[alertEntry.id] = alertEntry;
    yield put(addFormSuccess(objects, 'alert'));
    yield put(setNotification('Procedimiento creado'));
  });
}
function* editAlert() {
  yield takeLatest(EDIT_ALERT, function* (action) {
    let alertEntry = action.editingObject;
    const encounterEventId = alertEntry.encounterEventId;
    const encounterId = alertEntry.encounterEvent().encounterId;
    const objects = {alertEntries: {}};
    const payload = {
      confidentialityLevelId: 1,
      id: alertEntry.id,
      guid: alertEntry.guid,
      timestamp: alertEntry.timestamp,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      archived: false
    };
    alertEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alertEntry/${alertEntry.id}/updatedCurrentEntry`, payload);
    objects.alertEntries[alertEntry.id] = alertEntry;
    yield put(editFormSuccess(objects, 'alert'));
    yield put(setNotification('Procedimiento editado'));
  });
}
function* removeAlert() {
  yield takeLatest(REMOVE_ALERT, function* (action) {
    const alertEntry = action.alertEntry;
    const encounterEvent = alertEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alertEntry/${alertEntry.id}?tid=${alertEntry.timestamp}`);
    yield put(removeFormSuccess('alertEntries',action.alertEntry.id));
    yield put(setNotification('Alerta eliminada'));
  });
}
function* suspendAlert() {
  yield takeLatest(SUSPEND_ALERT, function* (action) {
    const objects = {alertEntries: {}, encounterEvents:{}};
    let alertEntry = action.alertEntry;
    const encounterEvent = alertEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: true,
      guid: alertEntry.guid,
      encounterEventId: encounterEventId,
      id: alertEntry.id,
      timestamp: alertEntry.timestamp
    };
    alertEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alertEntry/${alertEntry.id}/archivedEntry?tid=${alertEntry.timestamp}`, payload);
    
    objects.alertEntries[alertEntry.id] = alertEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendAlert() {
  yield takeLatest(UNSUSPEND_ALERT, function* (action) {
    const objects = {alertEntries: {}, encounterEvents:{}};
    let alertEntry = action.alertEntry;
    const encounterEvent = alertEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: false,
      guid: alertEntry.guid,
      encounterEventId: encounterEventId,
      id: alertEntry.id,
      timestamp: alertEntry.timestamp
    };
    alertEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/alertEntry/${alertEntry.id}/archivedEntry?tid=${alertEntry.timestamp}`, payload);
    objects.alertEntries[alertEntry.id] = alertEntry;
    yield put(editFormSuccess(objects));
  });
}
// DIAGNOSIS
function* addDiagnosis() {
  yield takeLatest(ADD_DIAGNOSIS, function* (action) {
    const encounterId = action.encounterId;
    let encounterEventId = action.encounterEventId;
    const objects = {encounterEvents: {}, diagnosisEntries: {}};
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      confidentialityLevelId: 1,
      diagnosisClassifyId: action.controls.diagnosis.id,
      description: action.controls.description,
      isGes: action.controls.isGes,
      diagnosisEntryStateId: action.controls.diagnosisEntryStateId,
      isMorbidity: action.controls.isMorbidity,
      healthProblemId: action.controls.healthProblemId,
      encounterEventId: encounterEventId,
      archived: false
    };
    const diagnosisEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/diagnosisEntry/`, payload);
    objects.diagnosisEntries[diagnosisEntry.id] = diagnosisEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Diagnóstico creado'));
  });
}
function* editDiagnosis() {
  yield takeLatest(EDIT_DIAGNOSIS, function* (action) {
    let diagnosisEntry = action.editingObject;
    const encounterEventId = diagnosisEntry.encounterEventId;
    const encounterId = diagnosisEntry.encounterEvent().encounterId;
    const objects = {diagnosisEntries: {}};
    const payload = {
      confidentialityLevelId: 1,
      id: diagnosisEntry.id,
      guid: diagnosisEntry.guid,
      timestamp: diagnosisEntry.timestamp,
      diagnosisClassifyId: action.controls.diagnosisClassifyId,
      description: action.controls.description,
      isGes: action.controls.isGes,
      diagnosisEntryStateId: action.controls.diagnosisEntryStateId,
      isMorbidity: action.controls.isMorbidity,
      healthProblemId: action.controls.healthProblemId,
      encounterEventId: encounterEventId,
      archived: false
    };
    diagnosisEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/diagnosisEntry/${diagnosisEntry.id}/updatedCurrentEntry`, payload);
    objects.diagnosisEntries[diagnosisEntry.id] = diagnosisEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Procedimiento editado'));
  });
}
function* removeDiagnosis() {
  yield takeLatest(REMOVE_DIAGNOSIS, function* (action) {
    const diagnosisEntry = action.diagnosisEntry;
    const encounterEvent = diagnosisEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/diagnosisEntry/${diagnosisEntry.id}?tid=${diagnosisEntry.timestamp}`);
    yield put(removeFormSuccess('diagnosisEntries',action.diagnosisEntry.id));
    yield put(setNotification('Diagnóstico eliminado'));
  });
}
function* suspendDiagnosis() {
  yield takeLatest(SUSPEND_DIAGNOSIS, function* (action) {
    const objects = {diagnosisEntries: {}, encounterEvents:{}};
    let diagnosisEntry = action.diagnosisEntry;
    const encounterEvent = diagnosisEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: true,
      encounterEventId: encounterEventId,
      id: diagnosisEntry.id,
      timestamp: diagnosisEntry.timestamp
    };
    diagnosisEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/diagnosisEntry/${diagnosisEntry.id}/archivedEntry?tid=${diagnosisEntry.timestamp}`, payload);
    
    objects.diagnosisEntries[diagnosisEntry.id] = diagnosisEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendDiagnosis() {
  yield takeLatest(UNSUSPEND_DIAGNOSIS, function* (action) {
    const objects = {diagnosisEntries: {}, encounterEvents:{}};
    let diagnosisEntry = action.diagnosisEntry;
    const encounterEvent = diagnosisEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: false,
      guid: diagnosisEntry.guid,
      encounterEventId: encounterEventId,
      id: diagnosisEntry.id,
      timestamp: diagnosisEntry.timestamp
    };
    diagnosisEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/diagnosisEntry/${diagnosisEntry.id}/archivedEntry?tid=${diagnosisEntry.timestamp}`, payload);
    objects.diagnosisEntries[diagnosisEntry.id] = diagnosisEntry;
    yield put(editFormSuccess(objects));
  });
}
// REFERRAL
function* addReferral() {
  yield takeLatest(ADD_REFERRAL, function* (action) {
    const encounterId = action.encounterId;
    let encounterEventId = action.encounterEventId;
    const objects = {encounterEvents: {}, referralEntries: {}};
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      confidentialityLevelId: 1,
      referralType: action.controls.referralType,
      healthCarePractitionerMedicalSpecialtyId: action.controls.healthCarePractitionerMedicalSpecialtyId,
      referralRequestReasonId: action.controls.referralRequestReasonId,
      referralRequestPriorityId: action.controls.referralRequestPriorityId,
      referralRequestDiagnosis: action.controls.referralRequestDiagnosis,
      clinicalFundament: action.controls.clinicalFundament,
      referralRequestStatusId: 1,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      archived: false
    };
    const referralEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/referralRequestEntry/`, payload);
    objects.referralEntries[referralEntry.id] = referralEntry;
    yield put(addFormSuccess(objects));
    yield put(setNotification('Solicitud de Interconsulta creada'));
  });
}
function* editReferral() {
  yield takeLatest(EDIT_REFERRAL, function* (action) {
    let referralEntry = action.editingObject;
    const encounterEventId = referralEntry.encounterEventId;
    const encounterId = referralEntry.encounterEvent().encounterId;
    const objects = {referralEntries: {}};
    const payload = {
      confidentialityLevelId: 1,
      id: referralEntry.id,
      guid: referralEntry.guid,
      timestamp: referralEntry.timestamp,
      referralType: action.controls.referralType,
      healthCarePractitionerMedicalSpecialtyId: action.controls.healthCarePractitionerMedicalSpecialtyId,
      referralRequestReasonId: action.controls.referralRequestReasonId,
      referralRequestPriorityId: action.controls.referralRequestPriorityId,
      referralRequestDiagnosis: action.controls.referralRequestDiagnosis,
      clinicalFundament: action.controls.clinicalFundament,
      referralRequestStatusId: 1,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      archived: false
    };
    referralEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/referralRequestEntry/${referralEntry.id}/updatedCurrentEntry`, payload);
    objects.referralEntries[referralEntry.id] = referralEntry;
    yield put(editFormSuccess(objects));
    yield put(setNotification('Procedimiento editado'));
  });
}
function* removeReferral() {
  yield takeLatest(REMOVE_REFERRAL, function* (action) {
    const referralEntry = action.referralEntry;
    const encounterEvent = referralEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/referralRequestEntry/${referralEntry.id}?tid=${referralEntry.timestamp}`);
    yield put(removeFormSuccess('referralEntries',action.referralEntry.id));
    yield put(setNotification('Solicitud de interconsulta eliminada'));
  });
}
function* suspendReferral() {
  yield takeLatest(SUSPEND_REFERRAL, function* (action) {
    const objects = {referralEntries: {}, encounterEvents:{}};
    let referralEntry = action.referralEntry;
    const encounterEvent = referralEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: true,
      encounterEventId: encounterEventId,
      id: referralEntry.id,
      timestamp: referralEntry.timestamp
    };
    referralEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/referralRequestEntry/${referralEntry.id}/archivedEntry?tid=${referralEntry.timestamp}`, payload);
    
    objects.referralEntries[referralEntry.id] = referralEntry;
    yield put(editFormSuccess(objects));
  });
}
function* unsuspendReferral() {
  yield takeLatest(UNSUSPEND_REFERRAL, function* (action) {
    const objects = {referralEntries: {}, encounterEvents:{}};
    let referralEntry = action.referralEntry;
    const encounterEvent = referralEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: false,
      guid: referralEntry.guid,
      encounterEventId: encounterEventId,
      id: referralEntry.id,
      timestamp: referralEntry.timestamp
    };
    referralEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/referralRequestEntry/${referralEntry.id}/archivedEntry?tid=${referralEntry.timestamp}`, payload);
    objects.referralEntries[referralEntry.id] = referralEntry;
    yield put(editFormSuccess(objects));
  });
}
// SHIFT CHANGE
function* addShiftChange() {
  yield takeLatest(ADD_SHIFT_CHANGE, function* (action) {
    const encounterId = action.encounterId;
    let encounterEventId = action.encounterEventId;
    const objects = {encounterEvents: {}, shiftChangeEntries: {}};
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = { 
      confidentialityLevelId: 1,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      archived: false
    };
    const shiftChangeEntry = yield call(post, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/shiftChangeEntry/`, payload);
    objects.shiftChangeEntries[shiftChangeEntry.id] = shiftChangeEntry;
    yield put(addFormSuccess(objects, 'shiftChange'));
    yield put(setNotification('Procedimiento creado'));
  });
}
function* editShiftChange() {
  yield takeLatest(EDIT_SHIFT_CHANGE, function* (action) {
    let shiftChangeEntry = action.editingObject;
    const encounterEventId = shiftChangeEntry.encounterEventId;
    const encounterId = shiftChangeEntry.encounterEvent().encounterId;
    const objects = {shiftChangeEntries: {}};
    const payload = {
      confidentialityLevelId: 1,
      id: shiftChangeEntry.id,
      guid: shiftChangeEntry.guid,
      timestamp: shiftChangeEntry.timestamp,
      observation: action.controls.observation,
      encounterEventId: encounterEventId,
      archived: false
    };
    shiftChangeEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/shiftChangeEntry/${shiftChangeEntry.id}/updatedCurrentEntry`, payload);
    objects.shiftChangeEntries[shiftChangeEntry.id] = shiftChangeEntry;
    yield put(editFormSuccess(objects, 'shiftChange'));
    yield put(setNotification('Procedimiento editado'));
  });
}
function* removeShiftChange() {
  yield takeLatest(REMOVE_SHIFT_CHANGE, function* (action) {
    const shiftChangeEntry = action.shiftChangeEntry;
    const encounterEvent = shiftChangeEntry.encounterEvent();
    const encounterEventId = encounterEvent.id;
    const encounterId = encounterEvent.encounterId;
    const response = yield call(del, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/shiftChangeEntry/${shiftChangeEntry.id}?tid=${shiftChangeEntry.timestamp}`);
    yield put(removeFormSuccess('shiftChangeEntries',action.shiftChangeEntry.id));
    yield put(setNotification('Cambio de turno eliminado'));
  });
}
function* suspendShiftChange() {
  yield takeLatest(SUSPEND_SHIFT_CHANGE, function* (action) {
    const objects = {shiftChangeEntries: {}, encounterEvents:{}};
    let shiftChangeEntry = action.shiftChangeEntry;
    const encounterEvent = shiftChangeEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: true,
      guid: shiftChangeEntry.guid,
      encounterEventId: encounterEventId,
      id: shiftChangeEntry.id,
      timestamp: shiftChangeEntry.timestamp
    };
    shiftChangeEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/shiftChangeEntry/${shiftChangeEntry.id}/archivedEntry?tid=${shiftChangeEntry.timestamp}`, payload);
    
    objects.shiftChangeEntries[shiftChangeEntry.id] = shiftChangeEntry;
    yield put(editFormSuccess(objects));
  });
}

export function* search() {
  yield takeLatest(SEARCH, function* ({ controls, objectClass, formCode, resultsName, fieldToSearch, objectName, searchingCache }) {
    yield call(delay, 1000);
    objectName = objectName ? objectName : resultsName;
    searchingCache = searchingCache ? searchingCache : 'searchingCache';
    let objects = yield select((state) => state.getIn(['objects', 'objects', objectName]).toJS());
    const objectsArray = Object.values(objects);
    const value = Object.values(controls)[0];
    const results = multipleArrayFilter(objectsArray, [{beginWordsOnly: true, typeSearch: 'startsWithIgnoreCase', filterText: value, fieldToSearch}]);
    yield put(searchSuccess(objectClass, formCode, resultsName, results.slice(0, 10), searchingCache, controls));
  });
}

function* unsuspendShiftChange() {
  yield takeLatest(UNSUSPEND_SHIFT_CHANGE, function* (action) {
    const objects = {shiftChangeEntries: {}, encounterEvents:{}};
    let shiftChangeEntry = action.shiftChangeEntry;
    const encounterEvent = shiftChangeEntry.encounterEvent();
    let encounterEventId = action.encounterEventId;
    const encounterId = encounterEvent.encounterId;
    if (!encounterEventId) {
      const encounterEvent = yield addEncounterEvent(encounterId, action.userId);
      encounterEventId = encounterEvent.id;
      objects.encounterEvents[encounterEvent.id] = encounterEvent;
    }
    const payload = {
      archived: false,
      guid: shiftChangeEntry.guid,
      encounterEventId: encounterEventId,
      id: shiftChangeEntry.id,
      timestamp: shiftChangeEntry.timestamp
    };
    shiftChangeEntry = yield call(putRequest, `/encounter/${encounterId}/encounterEvent/${encounterEventId}/shiftChangeEntry/${shiftChangeEntry.id}/archivedEntry?tid=${shiftChangeEntry.timestamp}`, payload);
    objects.shiftChangeEntries[shiftChangeEntry.id] = shiftChangeEntry;
    yield put(editFormSuccess(objects));
  });
}



function* saga() {
  const forks = yield [
    fork(getEncounterEvents),
    fork(saveTemplate),
    fork(addObservation),
    fork(addRest),
    fork(addDiet),
    fork(editObservation),
    fork(editRest),
    fork(editDiet),
    fork(removeObservation),
    fork(removeRest),
    fork(removeDiet),
    fork(confirmEncounterEvent),
    fork(removeEncounterEvent),
    fork(addProcedure),
    fork(editProcedure),
    fork(removeProcedure),
    fork(suspendProcedure),
    fork(unsuspendProcedure),
    fork(addMedicationRequest),
    fork(editMedicationRequest),
    fork(removeMedicationRequest),
    fork(suspendMedicationRequest),
    fork(unsuspendMedicationRequest),
    fork(addMedicationDilution),
    fork(editMedicationDilution),
    fork(removeMedicationDilution),
    fork(suspendMedicationDilution),
    fork(unsuspendMedicationDilution),
    fork(addMedicationAlternative),
    fork(editMedicationAlternative),
    fork(removeMedicationAlternative),
    fork(suspendMedicationAlternative),
    fork(unsuspendMedicationAlternative),
    fork(addAlert),
    fork(editAlert),
    fork(removeAlert),
    fork(suspendAlert),
    fork(unsuspendAlert),
    fork(addDiagnosis),
    fork(editDiagnosis),
    fork(removeDiagnosis),
    fork(suspendDiagnosis),
    fork(unsuspendDiagnosis),
    fork(addReferral),
    fork(editReferral),
    fork(removeReferral),
    fork(suspendReferral),
    fork(unsuspendReferral),
    fork(addShiftChange),
    fork(editShiftChange),
    fork(removeShiftChange),
    fork(suspendShiftChange),
    fork(unsuspendShiftChange),
    fork(search),
  ];
  yield take(LOCATION_CHANGE);
  yield forks.map((f) => cancel(f));
}

export default [saga];
