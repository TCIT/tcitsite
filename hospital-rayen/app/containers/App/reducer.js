import { fromJS } from 'immutable';

const initialState = fromJS({
  activeSessionId: null,
  cacheLoaded: false,
  socketConnectionId: null,
  subtitle: '',
  theme: 'rayen',
  notification: null,
  offsetTime: null,
  controls: {
    menuVisible: false
  }
});
import {
  ACTIVATE_SUCCESS, CONTROLS_CHANGED, CHANGE_THEME, SWITCH_ACCOUNT, LOGOUT_SUCCESS, CLOSE_NOTIFICATION,
  SET_NOTIFICATION, RESUME_SESSION_SUCCESS, SUBSCRIBE_SOCKET_CONNECTION_SUCCESS, LOAD_CACHE, LOAD_CACHE_SUCCESS
} from './constants';
import {ASSIGN_PRACTITIONER, MEDICAL_RECORD_SUCCESS, SET_ENCOUNTERS_SUBTITLE} from '../EncountersPage/constants';
import {CONFIRM_ROLE_SUCCESS, FORGET_SESSION_SUCCESS} from '../Session/constants';

export function appReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case CHANGE_THEME:
      return state
        .set('theme', action.payload);
    case CONTROLS_CHANGED:
      return state
        .mergeIn(['controls'], fromJS(action.controls));
    case ACTIVATE_SUCCESS:
      return state
        .set('offsetTime', action.offsetTime)
        .set('activeSessionId', action.activeSessionId);
    case CONFIRM_ROLE_SUCCESS:
      return state
        .set('activeSessionId', action.activeSession.id);
    case RESUME_SESSION_SUCCESS:
      return state
        .set('activeSessionId', action.sessionId);
    case FORGET_SESSION_SUCCESS:
      return state.set('activeSessionId', action.activeSessionId);
    case LOAD_CACHE:
      return state.set('cacheLoaded', false);
    case LOAD_CACHE_SUCCESS:
      return state.set('cacheLoaded', true);
    case LOGOUT_SUCCESS:
      return state.set('activeSessionId', null);
    case SET_ENCOUNTERS_SUBTITLE:
      return state.set('subtitle', action.subtitle);
    case SET_NOTIFICATION:
      return state
        .set('notification', action.notification);
    case CLOSE_NOTIFICATION:
      return state
        .set('notification', null);
    case SUBSCRIBE_SOCKET_CONNECTION_SUCCESS:
      return state
        .set('socketConnectionId', action.socketConnectionId);
    default:
      return state;
  }
}