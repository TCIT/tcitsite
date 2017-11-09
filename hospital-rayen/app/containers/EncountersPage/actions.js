import {
  GET_ENCOUNTERS, GET_ENCOUNTERS_SUCCESS, CONTROLS_CHANGED, ASSIGN_PRACTITIONER, SET_ENCOUNTERS_SUBTITLE,
  ASSIGN_PRACTITIONER_SUCCESS,PRINT, PRINT_SUCCESS, MEDICAL_RECORD
} from './constants';

export function getEncounters(facilityId) {
  return {
    type: GET_ENCOUNTERS,
    facilityId
  };
}

export function getEncountersSuccess(normalizedResponse) {
  return {
    type: GET_ENCOUNTERS_SUCCESS,
    normalizedResponse 
  };
}
export function controlsChanged(controls) {
  return {
    type: CONTROLS_CHANGED,
    controls
  }
}
export function assignPractitioner(encounter, practitioner) {
  return {
    type: ASSIGN_PRACTITIONER,
    encounter,
    practitioner
  }
}
export function assignPractitionerSuccess(objects) {
  return {
    type: ASSIGN_PRACTITIONER_SUCCESS,
    objects
  }
}
export function print() {
  return {
    type: PRINT
  }
}
export function printSuccess() {
  return {
    type: PRINT_SUCCESS
  }
}
export function accessMedicalRecord(encounterId) {
  return {
    type: MEDICAL_RECORD, encounterId
  }
}
export function setEncountersSubtitle(assignedEncounters, firstMessage, secondMessage) {
  const subtitle = `${firstMessage}: ${assignedEncounters} ${secondMessage }`
  return {
    type: SET_ENCOUNTERS_SUBTITLE,
    subtitle, assignedEncounters

  }
}

