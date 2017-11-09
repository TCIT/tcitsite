import sessionsDB from '../databases/sessions';

export default function getSessionToken() {
  return getActiveSession().then(activeSession => activeSession ? activeSession.token : null);
}

export function getActiveSession() {
  return sessionsDB.activeSession.get(1).then((activeSessionRecord) => {
    const activeSessionId = activeSessionRecord ? activeSessionRecord.sessionId : null;
    let activeSession = null;
    if (activeSessionId) {
      activeSession = sessionsDB.sessions.get(activeSessionId).then((session) => {
        return session;
      });
    }
    return activeSession;
  });
}