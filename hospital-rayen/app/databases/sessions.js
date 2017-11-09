import Dexie from 'dexie';
const sessionsDB = new Dexie('sessions');
sessionsDB.version(1).stores({
  sessions: '++id, userId, token, userData, password, facilityId, roleId, tokenExpirationDate, claims'
});
sessionsDB.version(1).stores({
  users: '++id, administrativeSexId, birthdate, email, firstFamilyName, firstGivenName, nextGivenNames, preferredIdentifierCode, secondFamilyName, timestamp'
});
sessionsDB.version(1).stores({
  activeSession: 'id, sessionId'
});
sessionsDB.version(1).stores({
  facilities: '++id, name, timeZone'
});
sessionsDB.version(1).stores({
  roles: '++id, name'
});
export default sessionsDB;