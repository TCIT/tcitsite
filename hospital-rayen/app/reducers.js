/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';
import notificationCenterReducer from 'containers/NotificationCenter/reducer';
import { encountersReducer } from 'containers/EncountersPage/reducer';
import { encounterEventsReducer } from 'containers/EncounterEventsPage/reducer';
import { diagnosisSearchReducer, diagnosisSearchResultsReducer } from 'containers/DiagnosisSearch/reducer';
import { medicineSearchReducer, medicineSearchResultsReducer } from 'containers/MedicineSearch/reducer';
import { reducer as formReducer } from 'redux-form';
import { sessionReducer } from './containers/Session/reducer';
import { appReducer } from './containers/App/reducer';
import { objectsReducer } from './containers/App/objects';


/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    app: appReducer,
    objects: objectsReducer,
    session: sessionReducer,
    route: routeReducer,
    language: languageProviderReducer,
    encounters: encountersReducer,
    encounterEvents: encounterEventsReducer,
    notifications: notificationCenterReducer,
    diagnoses: diagnosisSearchReducer,
    diagnosesResults: diagnosisSearchResultsReducer,
    medicines: medicineSearchReducer,
    medicinesResults: medicineSearchResultsReducer,
    form: formReducer,
    ...asyncReducers,
  });
}
