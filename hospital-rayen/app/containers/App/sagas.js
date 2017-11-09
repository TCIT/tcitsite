import regeneratorRuntime from "regenerator-runtime";
import { push } from 'react-router-redux';
// import { delay } from 'redux-saga';
import { put, takeLatest, call } from 'redux-saga/effects';
import { delay } from 'redux-saga'
import { ACTIVATE, LOGOUT, SWITCH_ACCOUNT, SET_NOTIFICATION, RESUME_SESSION } from './constants';
import { activateSuccess, logoutSuccess, closeNotification, resumeSessionSuccess } from './actions';
import get, { post, normalPut } from '../../services/apiFetch.js'
import sessionsDB from '../../databases/sessions';
function* activate(action) {
  let offsetTime = 0;
  const response = yield call(get, '/core/serverTime');
  if (response) {
    offsetTime = new Date(response) - new Date();
  }
  const sessionsTable = sessionsDB.sessions;
  const usersTable = sessionsDB.users;
  const activeSessionTable = sessionsDB.activeSession;
  const facilitiesTable = sessionsDB.facilities;
  const rolesTable = sessionsDB.roles;
  const activeSessionPointer = yield call(() => activeSessionTable.get(1));
  const activeSessionId = activeSessionPointer ? activeSessionPointer.sessionId : null;
  let activeSession = null;
  const objects = {sessions: {}, users: {}, facilities: {}, roles: {}, templates: {}};
  const sessionArray = yield call(() => sessionsTable.toArray());
  sessionArray.forEach((session) => {
    objects.sessions[session.id] = session;
    if (session.id === activeSessionId) {
      activeSession = session;
    }
  });
  const usersArray = yield call(() => usersTable.toArray());
  usersArray.forEach((user) => objects.users[user.id] = user);
  const facilitiesArray = yield call(() => facilitiesTable.toArray());
  facilitiesArray.forEach((facility) => objects.facilities[facility.id] = facility);
  const activeFacilityId = activeSession ? activeSession.facilityId : null;
  const activeUserId = activeSession ? activeSession.userId : null;
  const activeRoleId = activeSession ? activeSession.roleId : null;
  if (!activeSession) {
    yield put(push('/'));
  }
  else {
    const templates = yield call(get, `/core/template?healthcarePractitionerId=${activeUserId}&&facilityId=${activeFacilityId}`);
    if (templates.error) {
      yield put(push('/'));
    } else {
      templates.forEach((template) => objects.templates[template.id] = template);
      yield put(activateSuccess(objects, offsetTime, activeSessionId, activeRoleId));
    }
  }
}

export function* logout() {
  yield takeLatest(LOGOUT, function* (action) {
    const activeSessionTable = sessionsDB.activeSession;
    const activeSessionPointer = yield call(() => activeSessionTable.get(1));
    const sessionId = activeSessionPointer ? activeSessionPointer.sessionId : null;
    activeSessionTable.delete(1);
    const sessionsTable = sessionsDB.sessions;
    yield call(() => sessionsTable.update(sessionId, {token: null}));
    const newSession = yield call(() => sessionsTable.get(sessionId));
    yield put(logoutSuccess(sessionId));
    yield put(push('/'));
  });
}
export function* resumeSession() {
  yield takeLatest(RESUME_SESSION, function* (action) {
    const sessionId = action.sessionId;
    const activeSessionTable = sessionsDB.activeSession;
    const updatedActiveSession = yield call(() => activeSessionTable.put({id: 1, sessionId: sessionId}));
    yield put(resumeSessionSuccess(sessionId));
    location.reload();
  });
}
export function* switchAccount() {
  yield takeLatest(SWITCH_ACCOUNT, function* (action) {
    yield put(push('/'));
  });
}

export function* watchApp() {
  yield takeLatest(ACTIVATE, activate);
}

export function* watchErrors() {
  yield takeLatest(action => /_ERROR|_FAIL/.test(action.type), function* ({error}) {
    if (error) {
      console.log("Logging error");
      console.log(error);
    }
  });
}

export function* setNotification() {
  yield takeLatest(SET_NOTIFICATION, function* (action) {
    yield call(delay, 5000)
    yield put(closeNotification());
  });
}