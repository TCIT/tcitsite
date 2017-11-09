import { ACTIVATE_SUCCESS, ACTIVATE, CONTROLS_CHANGED, CHANGE_THEME, SWITCH_ACCOUNT, LOGOUT, 
  LOGOUT_SUCCESS, SET_PROCESS_NOTIFICATION, SET_NOTIFICATION, CLOSE_NOTIFICATION,
RESUME_SESSION, RESUME_SESSION_SUCCESS, SUBSCRIBE_SOCKET_CONNECTION_SUCCESS} from './constants';

export function activateSuccess(objects, offsetTime, activeSessionId, activeRoleId) {
  return {
    type: ACTIVATE_SUCCESS,
    objects,
    offsetTime,
    activeSessionId,
    activeRoleId
  };
}

export function activate() {
  return {
    type: ACTIVATE
  };
}
export function controlsChanged(controls) {
  return {
    type: CONTROLS_CHANGED,
    controls
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}
export function logoutSuccess(sessionId) {
  return {
    type: LOGOUT_SUCCESS,
    sessionId
  }
}
export function changeTheme(theme) {
  return {
    type: CHANGE_THEME,
    payload: theme,
  };
}
export function switchAccount() {
  return {
    type: SWITCH_ACCOUNT
  }
}
export function setNotification(notification) {
  return {
    type: SET_NOTIFICATION, notification
  }
}
export function closeNotification() {
  return {
    type: CLOSE_NOTIFICATION
  }
}
export function resumeSession(sessionId) {
  return {
    type: RESUME_SESSION,
    sessionId: sessionId
  }
}
export function resumeSessionSuccess(sessionId) {
  return {
    type: RESUME_SESSION_SUCCESS,
    sessionId
  }
}

export function subscribeSocketConnectionSuccess(socketConnectionId) {
  return {
    type: SUBSCRIBE_SOCKET_CONNECTION_SUCCESS,
    socketConnectionId
  };
}