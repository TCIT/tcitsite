import Dexie from 'dexie';

const dbServices = new Dexie('services');
dbServices.version(1).stores({
  services: 'name, tid, length, path'
});

export default dbServices;
