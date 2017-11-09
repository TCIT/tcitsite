
import {
  getDiagnosis,
} from '../actions';
import {
  GET_DIAGNOSIS,
} from '../constants';

describe('DiagnosisSearch actions', () => {
  describe('Default Action', () => {
    it('has a type of GET_DIAGNOSIS', () => {
      const expected = {
        type: GET_DIAGNOSIS,
      };
      expect(getDiagnosis()).toEqual(expected);
    });
  });
});
