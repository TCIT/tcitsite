import { getAsyncInjectors } from 'utils/asyncInjectors';

import { watchDiagnosisSearch } from 'containers/DiagnosisSearch/sagas';
import { watchMedicineSearch } from 'containers/MedicineSearch/sagas';
import * as appSagas from 'containers/App/sagas';
import * as socketSagas from 'containers/App/socketSagas';
import * as cacheSagas from 'containers/App/cacheSagas';

/**
 * This general saga can be used to inject sagas that don't have routes.
 * Just import it and ad it to the injectSagas as such.
 */
export function injectGlobalSagas(store) {
  const { injectSagas } = getAsyncInjectors(store);
  injectSagas([
    ...Object.values(appSagas),
    ...Object.values(socketSagas),
    ...Object.values(cacheSagas),
    ]);
};
