/*
 *
 * NotificationCenter actions
 *
 */

import {
  DEFAULT_ACTION, SHOW_MESSAGE, REMOVE_MESSAGES
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function showMessage(msg) {
  return {
    type: SHOW_MESSAGE,
    text: msg,
  };
}

export function removeMessages() {
  return {
    type: REMOVE_MESSAGES,
  }
}
