import {
  ADD_SESSION,
  CONFIRM_ROLE,
  FORGET_SESSION,
  FORGET_SESSION_SUCCESS,
  LOGOUT,
  RESUME_SESSION,
  RESUME_SESSION_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CONFIRM_ROLE_SUCCESS,
  SIGN_UP,
  CONTROLS_CHANGED,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  FIRST_LOGIN,
  FORGET_SESSION_FAIL,
  CONFIRM_ROLE_FAIL
} from './constants';

//import { LOGIN_SUCCESS } from '../App/constants';
export function signUp(loginSessionId, username) {
  return {
    type: SIGN_UP,
    loginSessionId,
    username
  };
}
export function addSession(session) {
  return {
    type: ADD_SESSION,
    payload: session,
  };
}
export function loginSuccess(response) {
  return {
    type: LOGIN_SUCCESS,
    payload: response,
  }
}
export function firstLogin(response) {
  return {
    type: FIRST_LOGIN,
    payload: response,
  }
}
export function loginFail(error) {
  return {
    type: LOGIN_FAIL,
    error
  }
}
export function changePassword(response) {
  return {
    type: CHANGE_PASSWORD,
    payload: response,
  }
}
export function changePasswordSuccess() {
  return {
    type: CHANGE_PASSWORD_SUCCESS
  }
}
export function changePasswordFail(error) {
  return {
    type: CHANGE_PASSWORD_FAIL,
    error
  }
}

export function confirmRoleSuccess(activeSession, objects) {
  return {
    type: CONFIRM_ROLE_SUCCESS,
    activeSession,
    objects
  }
}
export function confirmRoleFail(error) {
  return {
    type: CONFIRM_ROLE_FAIL,
    error
  }
}
export function confirmRole(payload) {
  return {
    type: CONFIRM_ROLE,
    payload: payload,
  }
}

export function forgetSession(sessionId) {
  return {
    type: FORGET_SESSION,
    sessionId,
  }
}
export function forgetSessionFail(error) {
  return {
    type: FORGET_SESSION_FAIL,
    error
  }
}

export function forgetSessionSuccess(sessionId, activeSessionId, facilityId, roleId) {
  return {
    type: FORGET_SESSION_SUCCESS,
    sessionId,
    activeSessionId,
    facilityId, 
    roleId
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

export function controlsChanged(controls) {
  return {
    type: CONTROLS_CHANGED,
    controls,
  }
}
