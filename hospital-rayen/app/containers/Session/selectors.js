import { createSelector } from 'reselect';

const selectSessionPageDomain = () => (state) => state.get('app').merge(state.get('session'));

const makeSelectSession = () => createSelector(
  selectSessionPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectSession;

export {
  makeSelectSession,
  selectSessionPageDomain,
};
