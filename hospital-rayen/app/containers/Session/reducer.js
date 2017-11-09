import { fromJS } from 'immutable';
import {
  ADD_SESSION,
  CONFIRM_ROLE,
  CONTROLS_CHANGED,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  FORGET_SESSION,
  LOGIN_SUCCESS,
  FIRST_LOGIN,
  FORGET_SESSION_SUCCESS,
  LOGIN_FAIL,
  CONFIRM_ROLE_SUCCESS,
  CONFIRM_ROLE_FAIL,
  SIGN_UP
} from './constants';

import { ACTIVATE_SUCCESS, SWITCH_ACCOUNT } from '../App/constants'

const initialState = fromJS({
  step: 2,
  isLoading: false,
  activeSessionData: null,
  loginSessionId: null,
  error: '',
  loginAjaxState: '',
  changePasswordAjaxState: '',
  controls: {
    expandedRolesSubheaders: [],
    username: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    facilityId: null,
    roleId: null
  }
});

/**
 * Si la sesión fue iniciada sin la opción "Recordar contraseña"
 * la opción "Cambiar cuenta" se comporta de la misma forma que
 * "Cerrar sesión".
 */

export function sessionReducer(state = initialState, action) {
  const prevState = state;
  switch (action.type) {
    case ADD_SESSION:
      return state
        .set('loginAjaxState', 'pending');
    case CONTROLS_CHANGED:
      return state
        .mergeIn(['controls'], fromJS(action.controls));
    case SIGN_UP:
      return state
        .setIn(['controls', 'username'], action.username)
        .setIn(['controls', 'password'], '')
        .set('loginSessionId', action.loginSessionId)
        .set('error', '')
        .set('step', 2)
        .set('password', '')
        .set('loginAjaxState', '');
    case FIRST_LOGIN:
      return state
        .set('step', 3)
        .set('error', '')
        .setIn(['controls', 'username'], '')
        .setIn(['controls', 'password'], '')
        .set('newPassword', '')
        .set('confirmPassword', '')
        .set('activeSessionData', action.payload)
        .set('changePasswordAjaxState', '');
    case LOGIN_SUCCESS:
      return state
        .set('step', 4)
        .set('error', '')
        .set('activeSessionData', action.payload)
        .set('username', '')
        .set('password', '')
        .set('loginAjaxState', 'success');
    case LOGIN_FAIL:
      return state
        .set('error', action.error)
        .setIn(['controls', 'username'], '')
        .setIn(['controls', 'password'], '')
    case CHANGE_PASSWORD:
      return state
        .set('changePasswordAjaxState', 'pending');
    case CHANGE_PASSWORD_SUCCESS:
      return state
        .set('step', 4)
        .set('error', '')
        .setIn(['controls', 'password'], '')
        .setIn(['controls', 'newPassword'], '')
        .setIn(['controls', 'confirmPassword'], '')
        .set('changePasswordAjaxState', 'success')
        .set('error', action.error);
    case CHANGE_PASSWORD_FAIL:
      return state
        .set('error', action.error)
        .setIn(['controls', 'password'], '')
        .setIn(['controls', 'newPassword'], '')
        .setIn(['controls', 'confirmPassword'], '')
        .set('changePasswordAjaxState', 'fail')
    case CONFIRM_ROLE_SUCCESS:
      return state
        .set('step', 1)
        .set('error', '');
    case CONFIRM_ROLE_FAIL:
      return state
        .set('error', action.error)
    case ACTIVATE_SUCCESS:
      return state
      .setIn(['controls','expandedRolesSubheaders'],[action.activeRoleId]);
    case SWITCH_ACCOUNT:
      return state
        .set('error', '')
        .set('step', 1);
    default:
      return state;
  }
}

export default sessionReducer;
