/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'es';
export const ACTIVATE = 'app/App/ACTIVATE';
export const ACTIVATE_SUCCESS = 'app/App/ACTIVATE_SUCCESS';
export const CONTROLS_CHANGED = 'app/App/CONTROLS_CHANGED';
export const CHANGE_THEME = 'app/App/CHANGE_THEME';
export const LOAD_CACHE = 'app/App/LOAD_CACHE';
export const LOAD_CACHE_SUCCESS = 'app/App/LOAD_CACHE_SUCCESS';
export const LOGOUT = 'app/App/LOGOUT';
export const LOGOUT_SUCCESS = 'app/App/LOGOUT_SUCCESS';
export const SWITCH_ACCOUNT = 'app/App/SWITCH_ACCOUNT';
export const SET_NOTIFICATION = 'app/App/OPEN_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'app/App/CLOSE_NOTIFICATION';
export const RESUME_SESSION = 'app/App/RESUME_SESSION';
export const RESUME_SESSION_SUCCESS = 'app/App/RESUME_SESSION_SUCCESS';
export const SUBSCRIBE_SOCKET_CONNECTION_SUCCESS = 'app/App/SUBSCRIBE_SOCKET_CONNECTION_SUCCESS';

