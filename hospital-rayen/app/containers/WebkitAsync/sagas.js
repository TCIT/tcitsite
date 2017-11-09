"use strict";

import regeneratorRuntime from "regenerator-runtime";
import { takeLatest, call, put, all } from 'redux-saga/effects';
import request from 'utils/requests';
import { ASYNC_REQUEST } from './constants';
import { SHOW_MESSAGE } from 'containers/NotificationCenter/constants';

export function* watchFetchProducts() {
  yield takeLatest(ASYNC_REQUEST, mainSaga)
}

function requestApi(path) {
  return request.get(path)
    .then(checkStatus)
    .catch(error => ({ error }))
}

function checkStatus(response) {
  return new Promise((resolve, reject) => {
    if (response.status >= 200 && response.status < 300) {
      resolve(response);
    } else {
      reject(response);
    }
  })
}

export function* mainSaga() {
  try {
    const [response1, response2, response3] = yield all([
      call(requestApi, "https://s3-us-west-2.amazonaws.com/rayen-nexus/farmacos.json"),
      call(requestApi, "https://s3-us-west-2.amazonaws.com/rayen-nexus/diagnosis.json"),
      call(requestApi, "blabla.json")
    ]);
    yield put({ type: SHOW_MESSAGE, text: "HI" });
  } catch(err) {
    yield put({ type: SHOW_MESSAGE, text: "NO" })
  }
}
// All sagas to be loaded
export default [
  watchFetchProducts,
];
