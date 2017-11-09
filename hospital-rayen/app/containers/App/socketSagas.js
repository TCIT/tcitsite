import { eventChannel } from 'redux-saga';
import { put, takeLatest, takeEvery, call, select, fork, take } from 'redux-saga/effects';
import getSessionToken from '../../services/getSessionToken';

import { ACTIVATE_SUCCESS } from './constants';
import { subscribeSocketConnectionSuccess } from './actions';
import { CONFIRM_ROLE_SUCCESS } from '../Session/constants';

import { hubConnection } from 'signalr-shimmy';

import restToActions from '../../services/restToActions';
import { getObjectsFromSingleResponse } from '../../services/getObjectsFromResponse';

export function* subscribeSocketConnection() {
  const socketConnectionId = yield select((state) => state.getIn(['app', 'socketConnectionId']));
  console.log("PAASAD")
  yield takeEvery(action => RegExp(`${ACTIVATE_SUCCESS}|${CONFIRM_ROLE_SUCCESS}`).test(action.type), function* (action) {
    if (!socketConnectionId) {
      const token = yield call(getSessionToken);
      let connection = hubConnection('http://172.16.0.169:20002', {});
      connection.qs = { token, app: 'Hospitalizado' };
      const hubProxy = connection.createHubProxy('message')
      yield fork(read, hubProxy);
      const conn = yield connection.start();
      yield put(subscribeSocketConnectionSuccess(conn.id));
    }
  });
}

function* read(hubProxy) {
  const channel = yield call(subscribe, hubProxy);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function subscribe(hubProxy) {
  return eventChannel(emit => {
    hubProxy.on('syncServerDate', (date) => {
      const parsedDate = JSON.parse(date);
    });

    hubProxy.on('syncData',  (sender, resource, method, content) => {
      const parsedContent = JSON.parse(content);
      const lowerCasedKeysContent = {};
      Object.keys(parsedContent).forEach(key => {
        const loweredCasedKey = key.charAt(0).toLowerCase() + key.slice(1);
        lowerCasedKeysContent[loweredCasedKey] = parsedContent[key];
      });
      // TCT: Following line will never work as sender is always different from current id since the sender is the main app as the messages are a result of a normal POST
      // if (sender !== conn.id) {
      const restToAction = restToActions.find(restToAction => restToAction.match(resource.split('?')[0]) && restToAction.method === method);
      if (restToAction) {
        const urlResources = restToAction.url.split('?')[0].split('/').filter(resource => resource.indexOf(':') === -1 && resource !== 'updatedCurrentEntry' && resource !== 'confirmedEncounterEvent');
        const urlResource = urlResources[urlResources.length - 2];
        const objects = getObjectsFromSingleResponse(lowerCasedKeysContent, urlResource);
        emit({
          type: restToAction.type,
          objects
        });
      }
      // }
    });
    return () => {};
  });
}