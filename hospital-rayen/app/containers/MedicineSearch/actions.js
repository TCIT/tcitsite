/*
 *
 * MedicineSearch actions
 *
 */

import {
  ADD_MEDICINE, SEARCH_MEDICINE
} from './constants';


export function getMedicine(medicine) {
  return {
    type: SEARCH_MEDICINE,
    payload: medicine,
  };
}

export function addMedicine(medicine) {
  if (medicine) {
    const med = { time: 24,
      medicine: {genericName: medicine.NOMBRE_GENERICO},
      posology: 'Cada 6 hrs',
      obs: 'Tomar con abundante agua',
      doctor: 'Dr Patricio Frez',
      execState: {2: false, 21: true},
    }
    return {
      type: ADD_MEDICINE,
      payload: med
    };
  }
}
