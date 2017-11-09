import { put, takeLatest, takeEvery, call, select, fork, take } from 'redux-saga/effects';

import { ACTIVATE_SUCCESS, LOAD_CACHE, LOAD_CACHE_SUCCESS } from './constants';
import { CONFIRM_ROLE_SUCCESS } from '../Session/constants';
import loadServices from '../../services/get';
import { setNotification } from './actions';

export function* subscribeSocketConnection() {
  yield takeEvery(action => RegExp(`${ACTIVATE_SUCCESS}|${CONFIRM_ROLE_SUCCESS}`).test(action.type), function* (action) {
    try {
      yield put({
        type: LOAD_CACHE,
      });
      const objects = yield call(loadServices);
      yield put({
        type: LOAD_CACHE_SUCCESS,
        objects
      });
    } catch (error) {
      yield put(setNotification(error));
    }
  });
}