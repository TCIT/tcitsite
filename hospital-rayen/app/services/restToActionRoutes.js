import { ASSIGN_PRACTITIONER_SUCCESS } from '../containers/EncountersPage/constants';
import {
  ADD_FORM_SUCCESS,
  EDIT_FORM_SUCCESS,
  REMOVE_FORM_SUCCESS,
  CONFIRM_ENCOUNTER_EVENT_SUCCESS
} from '../containers/EncounterEventsPage/constants';

// TCT: Trailing slashes are important!
export default [
  // {
  //   url: '/api/api/encounter/:encounterId/healthCarePractitionerAssigned/',
  //   method: 'PUT',
  //   actionType: ASSIGN_PRACTITIONER_SUCCESS
  // },
  {
    url: '/api/encounter/:encounterId/encounterEvent/',
    method: 'POST',
    type: ADD_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/observationEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/observationEntry/:observationEntryId/updatedCurrentEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  // TCT: Need to change removes so it accepts objects instead of ids
  // {
  //   url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/observationEntry/:observationEntryId',
  //   method: 'DELETE',
  //   type: REMOVE_FORM_SUCCESS
  // },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/restEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS,
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/restEntry/:restEntryId/updatedCurrentEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS,
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/nutritionOrderEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS,
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/nutritionOrderEntry/:dietEntryId/updatedCurrentEntry/',
    method: 'POST',
    type: EDIT_FORM_SUCCESS,
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/confirmedEncounterEvent/',
    method: 'PUT',
    type: CONFIRM_ENCOUNTER_EVENT_SUCCESS,
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/procedureEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/procedureEntry/:procedureEntryId/updatedCurrentEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/procedureEntry/:procedureEntryId/suspendEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationRequestEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationRequestEntry/:medicationRequestEntryId/updatedCurrentEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationRequestEntry/:medicationRequestEntryId/suspendEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationRequestEntry/:medicationRequestEntryId/suspendEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationDilutionEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationDilutionEntry/:medicationDilutionEntryId/updatedCurrentEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationDilutionEntry/:medicationDilutionEntryId/suspendEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/medicationDilutionEntry/:medicationDilutionEntryId/suspendEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/alternativeMedicationRequestEntry/',
    method: 'POST',
    type: ADD_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/alternativeMedicationRequestEntry/:alternativeMedicationRequestEntryId/updatedCurrentEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/alternativeMedicationRequestEntry/:medicationAlternativeEntryId/suspendEntry',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  },
  {
    url: '/api/encounter/:encounterId/encounterEvent/:encounterEventId/alternativeMedicationRequestEntry/:medicationAlternativeEntryId/suspendEntry/',
    method: 'PUT',
    type: EDIT_FORM_SUCCESS
  }
]