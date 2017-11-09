
import { fromJS } from 'immutable';
import medicineSearchReducer from '../reducer';

describe('medicineSearchReducer', () => {
  it('returns the initial state', () => {
    expect(medicineSearchReducer(undefined, {})).toEqual(fromJS({}));
  });
});
