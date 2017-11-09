
import { fromJS } from 'immutable';
import diagnosisSearchReducer from '../reducer';

describe('diagnosisSearchReducer', () => {
  it('returns the initial state', () => {
    expect(diagnosisSearchReducer(undefined, {})).toEqual(fromJS({}));
  });
});
