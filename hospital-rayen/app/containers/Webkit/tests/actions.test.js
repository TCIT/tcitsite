
import {
  searchDiagnosis,
  selectDiagnosis,
} from '../actions';
import {
  SEARCH_DIAGNOSIS,
  SELECT_DIAGNOSIS,
} from '../constants';

describe('Webkit actions', () => {
  describe('Search diagnosis action', () => {
    it('has a type of SEARCH_DIAGNOSIS', () => {
      const expected = {
        type: SEARCH_DIAGNOSIS,
      };
      expect(searchDiagnosis()).toEqual(expected);
    });
  });

  describe('Select diagnosis action', () => {
    it('has a type of SELECT_DIAGNOSIS', () => {
      const expected = {
        type: SEARCH_DIAGNOSIS,
      };
      expect(selectDiagnosis()).toEqual(expected);
    });
  });
});
