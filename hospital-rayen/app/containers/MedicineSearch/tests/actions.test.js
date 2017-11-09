
import {
  addMedicine,
} from '../actions';
import {
  ADD_MEDICINE,
} from '../constants';

describe('MedicineSearch actions', () => {
  describe('Default Action', () => {
    it('has a type of ADD_MEDICINE', () => {
      const expected = {
        type: ADD_MEDICINE,
      };
      expect(addMedicine()).toEqual(expected);
    });
  });
});
