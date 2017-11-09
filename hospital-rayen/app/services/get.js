import regeneratorRuntime from "regenerator-runtime";
import { delay } from 'redux-saga';
import { all, call, put, take } from 'redux-saga/effects';
import Dexie from 'dexie';
import _ from 'lodash';
import dbServices from './index';
import { SHOW_MESSAGE } from 'containers/NotificationCenter/constants';
// import request from 'utils/requests';
import get from '../services/apiFetch';
import { getObjectsHash } from '../services/getObjectsFromResponse';
import getCacheRoutes from './cacheRoutes';
import { getActiveSession } from './getSessionToken';

// global Object with indexes from services
export const servicesIndex = {};
/* loadServices will be retried for 2 times, with a delay of 5 seconds in between.
After the 2th failure, the exception thrown will get caught by the parent saga initService,
which will dispatch the UPDATE_ERROR action.
Based on https://redux-saga.js.org/docs/recipes/index.html */
export default function* loadServices() {
  for(let i = 0; i < 3; i++) {
    try {
      // Cache loaders must be grouped for parallelism
      const activeSession = yield call(getActiveSession);
      const services = yield all(getCacheRoutes(activeSession).map(cacheRoute => call(loadService, cacheRoute)));
      const serviceTables = yield all(services.map(service => 
        service.db.table(service.cache.name).toArray()
        .then(serviceArray => ({name: service.cache.name, hash: getObjectsHash(serviceArray)}))
      ));
      const objects = {};
      serviceTables.forEach(serviceTable => objects[serviceTable.name] = serviceTable.hash);
      return objects;
    } catch(err) {
      if(i < 3) {
        yield call(delay, 5000);
      }
    }
  }
  // attempts failed after 2 attempts
  dispatchError('API request failed');
}

function loadService(cache, preFetch) {
  return dbServices.open().then(() => {
    return dbServices.table("services")
      .where('name')
      .equals(cache.name)
      .first()
      .then(function(index) {
        return Dexie.exists(cache.name).then((hasTable) => {
          if (hasTable) {
            // update service with last TID
            const tid = index.tid ? index.tid : 0;;
            return updateService(cache, tid);
          } else {
            return createService(cache);
          }
        })
        .catch(function (error) {
          dispatchError(error);
          createService(cache);
          console.error("Oops, an error occurred when trying to check service " + cache.name + " existance", error);
        });
    });
  });
}

function createService(cache) {
  // get the data from API
  return get(cache.path, {tid: 0})
    // create the db for first time and save the promise
    .then((data) => createVersionSchema(cache, data))
    // just save the db in parent for further using
    .then(({cache, data, db}) => populateService(cache, data, db))
    // add service to index table
    .catch((error) => {
      dispatchError(error);
      return { cache, data: null, db: null };
    })
}

function updateService(cache, lastTID) {
  // check if index is in store
  let tid = servicesIndex[cache.name] ? servicesIndex[cache.name].tid : lastTID;
  // open a schema as a promise
  return openVersionSchema(cache.name).then((db) => {
    // request service with fetch
    return get(cache.path, {tid})
      .then(data => verifyLength(cache, data, db))
      .then(({ cache, data, db, lengthOk }) => {
        const schemaOk = verifySchema(cache, data, db);
        if (data.length > 0 && lengthOk) {
          if (schemaOk) {
            populateService(cache, data, db);
          } else {
            recreateService(cache, data, db);
          }
        }
        return { cache, data, db };
      })
      .catch(function(error) {
        dispatchError(error);
        return { cache, data: null, db };
      })
  });

}

function openVersionSchema(name) {
  const db = new Dexie(name);
  return db.open();
}

function createVersionSchema(cache, dataParam) {
  // opening new database
  const db = new Dexie(cache.name);
  const data = dataParam;
  // check if there is any data
  
    // creating the table schema
    const tableSchema = Object.keys(data[0]).toString();
    let newSchema = {};
    newSchema[cache.name] = tableSchema;
    // setting a version, and reopening indexedDB
    db.version(1).stores(newSchema);
    return db.open().then((db) => {
      return { cache, data, db };
    });
}

function populateService(cache, data, db) {
    console.log("<= populating " + cache.name + " with " + data.length + " elements")
    // finding the table cache
    let table = db.table(cache.name);
    // bulkPut response from the server. bulkPut will throw an error
    // if they have the keys are equal (no need to check length)
    return table.bulkPut(data).then((lastKey) => {
      console.log("* Done. Last " + cache.name + " cache id was: " + lastKey);
      return loadServiceIndex(cache, data, db);
    }).catch(Dexie.BulkError, (e) => {
      dispatchError(e);
      return { cache, data, db };
    });

}

function verifySchema(cache, data, db) {
  let schemaOk = { cache, data, db };
    // se chequea que exista data
    if (db && data && data.length > 0) {
      // obtengo tabla segun su nombre
      const table = db.table(cache.name);
      // esquema nuevo en base a data[0], se filta primKey
      const newSchema = Object.keys(data[0]).filter(item => item !== table.schema.primKey.name);
      // esquema actual por nombre
      const currentSchema = _.map(table.schema.indexes, 'name');
      // comparar esquemas por sus valores en el array
      if(newSchema.sort().join(',') !== currentSchema.sort().join(',')) {
        console.log("Schema in " + cache.name + " are different")
        schemaOk = false;
      }
    }
    return schemaOk;
}

function verifyLength(cache, dataParam, dbParam) {
  const data = dataParam;
  const db = dbParam;
  const preChecksOk = db && data;
  let lengthOk = false;
  return db.table(cache.name).count().then((currentLength) => {
    return dbServices.open().then(() => {
      return dbServices.table("services")
        .where('name')
        .equals(cache.name)
        .first()
        .then((index) => {
          if (index.length === currentLength && preChecksOk) {
            lengthOk = true;
          } else {
            console.log("Lengths in " + cache.name + " are different");
          }
          return { cache, data, db, lengthOk };
        });
      }).catch(() => {
        return { cache, data, db, lengthOk };
      });
  });

}

function convertIntToHex(number) {
  const hexString = number.toString(16);
  const padHex = String("0000000000000000" + hexString).slice(-16).toUpperCase();
  return padHex;
}

function convertHexToInt(hexString) {
  const number = parseInt(hexString, 16);
  return number;
}

function getLastTid(cache, data) {
  // this will be deprecated after migrate all caches to azure
  let toReturn = "0"
  if (cache.tidLabel === "timeStamp" || cache.tidLabel === "timestamp") {
      // if have data get the maximun value based on TID column
      let lastTID = data ? Math.max.apply(Math,data.map(function(o){return convertHexToInt(o[cache.tidLabel]);})) : 0;
      toReturn = convertIntToHex(lastTID);
    }
    console.log('ERROR:el nombre del tid de retorno no es timestamp');
    return toReturn;
}

function loadServiceIndex(cache, data, db) {
  // services index database
  const serviceLastTid = getLastTid(cache, data);

  // count of database is a promise
  return db.table(cache.name).count().then(serviceLength => {
    // index object
    let serviceIndex = {
      name: cache.name,
      tid: serviceLastTid,
      length: serviceLength,
      path: cache.path
    }
    dbServices.services.put(serviceIndex).then(() => {
        console.log('%c✓ Service ' + serviceIndex.name + ' added to servicesIndex with last tid: ' + serviceIndex.tid, 'color: green');
        servicesIndex[serviceIndex.name] = serviceIndex;
        return { cache, data, db };
      }).catch(function(error) {
        dispatchError(error);
        return { cache, data, db };
      });
    }).catch(function (error) {
      dispatchError(error);
      return { cache, data, db };
    });
  // })
  
}

function recreateService(cache, data, db) {
  // const dbServices = new Dexie("services");
  return db.delete().then(() => {
    return loadService(cache);
  }).catch((err) => {
    dispatchError(err);
    return { cache, data, db };
  })

}

// just throw an error and show it in the snackbar
function* dispatchError(errorMsg) {
  throw new Error(errorMsg);
  yield put({
    type: SHOW_MESSAGE,
    text: errorMsg
  });
}



