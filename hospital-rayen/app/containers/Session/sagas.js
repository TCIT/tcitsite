import regeneratorRuntime from "regenerator-runtime";
import { push } from 'react-router-redux';
import { delay } from 'redux-saga';
import { call, put, takeLatest, fork, take, cancel } from 'redux-saga/effects';
import { ADD_SESSION, CHANGE_PASSWORD, CONFIRM_ROLE, RESUME_SESSION, GET_SERVER_TIME, FORGET_SESSION } from './constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import get, { post, putRequest } from '../../services/apiFetch.js'
import sessionsDB from '../../databases/sessions';


import { loginSuccess, confirmRoleSuccess, confirmRoleFail, firstLogin, loginFail, changePasswordSuccess, changePasswordFail, forgetSessionSuccess, resumeSessionSuccess } from './actions';

function* login() {
  yield takeLatest(ADD_SESSION, function* (action) {
    const {username, password} = action.payload;
    // TODO: Process Response to return JSON in promise directly
    const res = yield call(post, '/login', {
      user: username, password
    });
    if (res.responseStatus == 0 ) {
      if (res.mustChangePassword){
        yield put(firstLogin(res));
      } else {
        yield put(loginSuccess(res));
      }
    } else {
      yield put(loginFail(res.message));
    }
    // 500 error messages should be handled by middleware
    // } else {
    //   yield put(loginFail('Intente de nuevo'));
    // }
  });
}
function* changePassword() {
  yield takeLatest(CHANGE_PASSWORD, function* (action) {
    const {activeSession, password, newPassword, confirmPassword} = action.payload;
    if (newPassword === confirmPassword) {
      const res = yield call(putRequest, '/login/Password', {
        firstToken: activeSession.token,
        mustChangePassword : true, 
        user: activeSession.user, 
        actualPassword: password, 
        newPassword:newPassword
      });
      
      if (res.responseStatus === 0) {
        activeSession.token = res.newFirstToken;
        yield put(changePasswordSuccess(activeSession));
      }
      else {
        yield put(changePasswordFail(res.message));
      }
      // 500 error messages should be handled by middleware
      // else {
      //   yield put(changePasswordFail('Intente de nuevo'));
      // }
    } else {
      yield put(changePasswordFail('Contraseñas no coinciden'));
    }
  });
}


function* confirmRole() {
  yield takeLatest(CONFIRM_ROLE, function* (action) {
    const {facilityId, roleId, activeSession} = action.payload;
    const userId = activeSession.healthCarePractitioner.id;
    const domain = activeSession.facilitiesRol.find((facilityRol) => facilityRol.facility.id === facilityId).facility.domain;
    const res = yield call(post, '/login/AccessFacility', {
      firstToken: activeSession.token, 
      facilityId: facilityId, 
      userId: userId,
      domain: domain, 
      healthCarePractitionerRoleId: roleId
    });
    const claims = res.secondTokenInformation.claims;
    // if (true) {
    if (true || claims.indexOf('')) {
      const sessionsTable = sessionsDB.sessions;
      const usersTable = sessionsDB.users;
      const activeSessionTable = sessionsDB.activeSession;
      const facilitiesTable = sessionsDB.facilities;
      const rolesTable = sessionsDB.roles;
      const roleFacility = activeSession.facilitiesRol.find((facilityRol) =>facilityRol.facility.id === facilityId);
      const timeZoneSetting = roleFacility.facility.setting.find((setting) => setting.description === "DEFAULT_TIME_ZONE");
      const timeZone = timeZoneSetting ? timeZoneSetting.value.trim() : 'America/Santiago';
      yield call(() => facilitiesTable.put({ id: facilityId, name: roleFacility.facility.name, timeZone: timeZone }));
      const newFacility = yield call(() => facilitiesTable.get(facilityId));
      const role = roleFacility.practitionerRoleList.find((role) =>role.id === roleId);
      yield call(() => rolesTable.put({id: roleId, name: role.name}));
      const newRole = yield call(() => rolesTable.get(roleId));
      const existingSession = yield call(() => sessionsTable.where({userId: userId, facilityId: facilityId, roleId: roleId}).first());
      const sessionRow = { 
        userId: userId,
        token: res.secondTokenInformation.token,
        userData: JSON.stringify(activeSession),
        facilityId: facilityId,
        roleId: roleId,
        tokenExpirationDate: res.secondTokenInformation.expirationDate, 
        claims: claims
      }
      if (existingSession) {
        sessionRow.id = existingSession.id;
      }
      const newSessionId = yield call(() => sessionsTable.put(sessionRow));
      const newSession = yield call(() => sessionsTable.get(newSessionId));
      yield call(() => usersTable.put({id: userId, 
          administrativeSexId: activeSession.healthCarePractitioner.administrativeSexId,
          birthdate: activeSession.healthCarePractitioner.birthdate, 
          email: activeSession.healthCarePractitioner.email, 
          firstFamilyName: activeSession.healthCarePractitioner.firstFamilyName, 
          firstGivenName: activeSession.healthCarePractitioner.firstGivenName, 
          nextGivenNames: activeSession.healthCarePractitioner.nextGivenNames, 
          preferredIdentifierCode: activeSession.healthCarePractitioner.preferredIdentifierCode, 
          secondFamilyName: activeSession.healthCarePractitioner.secondFamilyName,
          timestamp: activeSession.healthCarePractitioner.timestamp
        }));
      const newUser = yield call(() => usersTable.get(userId));
      const updatedActiveSession = yield call(() => activeSessionTable.put({id: 1, sessionId: newSession.id}));
      const objects = {sessions: {}, users: {}, facilities: {}, roles: {}};
      objects.sessions[newSession.id] = newSession;
      objects.users[newUser.id] = newUser;
      objects.facilities[newFacility.id] = newFacility;
      objects.roles[newRole.id] = newRole;
      yield put(confirmRoleSuccess(newSession, objects));
      yield put(push('/encounters'));
    } else {
      yield put(confirmRoleFail('Usted no tiene permiso para entrar'));
    }
  });
}
function* forgetSession() {
  yield takeLatest(FORGET_SESSION, function* (action) {
    const sessionId = action.sessionId;
    let activeSessionPointerId = null;
    const sessionsTable = sessionsDB.sessions;
    const usersTable = sessionsDB.users;
    const activeSessionTable = sessionsDB.activeSession;
    const facilitiesTable = sessionsDB.facilities;
    const rolesTable = sessionsDB.roles;
    const activeSessionPointer = yield call(() => activeSessionTable.get(1));
    let activeSessionId = activeSessionPointer ? activeSessionPointer.sessionId : null;
    if (activeSessionId === sessionId) {
      activeSessionTable.delete(1);
      activeSessionId = null;
    }
    const session = yield call(() => sessionsTable.get(sessionId));
    let facilityId = session.facilityId;
    let roleId = session.roleId;
    sessionsTable.delete(sessionId);
    const facilitiesCount = yield call(() => sessionsTable.where({facilityId: facilityId}).count());
    const rolesCount = yield call(() => sessionsTable.where({roleId: roleId}).count());
    if (facilitiesCount === 0) {
      facilitiesTable.delete(facilityId);
    }
    else {
      facilityId = null;
    }
    if (rolesCount === 0) {
      rolesTable.delete(roleId);
    }
    else {
      roleId = null;
    }
    yield put(forgetSessionSuccess(sessionId, activeSessionId, facilityId, roleId));
  });
}

function* resumeSession() {
  yield takeLatest(RESUME_SESSION, function* (action) {
    const sessionId = action.sessionId;
    const activeSessionTable = sessionsDB.activeSession;
    const updatedActiveSession = yield call(() => activeSessionTable.put({id: 1, sessionId: sessionId}));
    yield put(resumeSessionSuccess(sessionId));
    yield put(push('/encounters'));
  });
}
function* saga() {
  const forks = yield [
    fork(login),
    fork(confirmRole),
    fork(resumeSession),
    fork(changePassword),
    fork(forgetSession)

  ];
  yield take(LOCATION_CHANGE);
  yield forks.map((f) => cancel(f));
}

export default [saga];
