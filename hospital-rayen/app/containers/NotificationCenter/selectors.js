import { createSelector } from 'reselect';

/**
 * Direct selector to the notificationCenter state domain
 */
const selectNotificationCenterDomain = () => (state) => state.getIn(['notifications', 'messages']);

/**
 * Other specific selectors
 */


/**
 * Default selector used by NotificationCenter
 */

const makeSelectNotificationCenter = () => createSelector(
  selectNotificationCenterDomain(),
  (substate) => substate.toJS()
);

export default makeSelectNotificationCenter;
export {
  selectNotificationCenterDomain,
};
