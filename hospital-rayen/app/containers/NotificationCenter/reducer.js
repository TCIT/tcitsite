/*
 *
 * NotificationCenter reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION, SHOW_MESSAGE, REMOVE_MESSAGES
} from './constants';

const initialState = fromJS({
  messages: []
});

function notificationCenterReducer(state = initialState, action) {
  const prevState = state.get('notifications');
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case REMOVE_MESSAGES:
      return initialState;
    case SHOW_MESSAGE:
      return state
        .update('messages', prevState => prevState.push(action));
    default:
      return state;
  }
}

export default notificationCenterReducer;
