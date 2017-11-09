
import { fromJS } from 'immutable';
import drugSearchReducer from '../reducer';

describe('drugSearchReducer', () => {
  it('returns the initial state', () => {
    expect(drugSearchReducer(undefined, {})).toEqual(fromJS({}));
  });
});
