import regeneratorRuntime from "regenerator-runtime";
import { push } from 'react-router-redux';
import { call, takeLatest, fork, take, cancel, put } from 'redux-saga/effects';
import { GET_ENCOUNTERS, ASSIGN_PRACTITIONER, PRINT, MEDICAL_RECORD } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import get, { post, putRequest } from '../../services/apiFetch.js';
import encounterListSchema from '../../schemas/encounterList';
import normalize from '../../schemas/normalizer';

import { getEncountersSuccess, assignPractitionerSuccess, printSuccess } from './actions';
import { setNotification } from '../App/actions';


function* getEncounters() {
  yield takeLatest(GET_ENCOUNTERS, function* (action) {
    const users = yield call(get, `/core/healthCarePractitioner/healthCarePractitionerRole?facilityId=${action.facilityId}&healthCarePratitionerRole=1`);
    const responseEncounters = yield call(get, `/encounter/list?facilityId=${action.facilityId}`);
    const normalizedResponse = normalize(responseEncounters, encounterListSchema);
    normalizedResponse.objects.users = {};
    users.forEach( (user) => normalizedResponse.objects.users[user.id] = user);
    yield put(getEncountersSuccess(normalizedResponse));
  });
}
function* assignPractitioner() {
  yield takeLatest(ASSIGN_PRACTITIONER, function* (action) {
    const encounters = yield call(putRequest, `/encounter/${action.encounter.id}/healthCarePractitionerAssigned`, {
      encounterId: action.encounter.id,
      timestamp: action.encounter.timestamp,
      healthCarePractitionerId: action.practitioner.id
    });
    const encounter = action.encounter;
    encounter.assignedHealthCarePractitionerId = action.practitioner.id;
    const objects = {encounters: {}};
    objects.encounters[encounter.id] = encounter;
    yield put(assignPractitionerSuccess(objects));
    yield put(setNotification('Paciente asignado exitosamente'));
  });
}
function* print() {
  yield takeLatest(PRINT, function* (action) {
    const encounters = yield call(putRequest, `/encounter/${action.encounterId}/healthCarePractitionerAssigned`,{
      encounterId: action.encounterId,
      timestamp: action.practitioner.timestamp,
      healthCarePractitionerId: action.practitioner.id
    });
    yield put(printSuccess());
  });
}
function* accessMedicalRecord() {
  yield takeLatest(MEDICAL_RECORD, function* (action) {
    yield put(push(`/encounters/${action.encounterId}`));
  });
}


function* saga() {
  const forks = yield [
    fork(getEncounters),
    fork(assignPractitioner),
    fork(print),
    fork(accessMedicalRecord)
  ];
  yield take(LOCATION_CHANGE);
  yield forks.map((f) => cancel(f));
}

export default [saga];
