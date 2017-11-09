// "use strict";



// import regeneratorRuntime from "regenerator-runtime";
// import { delay } from 'redux-saga';
// import { all, call, put, select } from 'redux-saga/effects';
// import Dexie from 'dexie';
// import _ from 'lodash';

// import request from './utils/requests';

// // global Object with indexes from services
// export const servicesIndex = {};

// export default function* initService() {

//   // Dispatch cache loading
//   yield put({type: 'FETCH_CACHE_LOADING'});

//   // Cache loaders must be grouped for parallelism
//   const [diagnosis, drugs] = yield [
//     call(loadService, { name: "diagnosis", path: "diagnosis.json", tidName: "timeTable" }),
//     call(loadService, { name: "drugs", path: "farmacos.json", tidName: "TID" }),
//   ]

//   // Dispatch cache success
//   yield put({type: 'FETCH_CACHE_SUCCESS'});
// }

// function loadService(cache, preFetch) {
//   // check if services index exists, then get last TID
//   let hasIndex, dbExists;
//   Dexie.exists("services").then(function(indexExists) {
//     if (indexExists) {
//       hasIndex = indexExists;
//       const db = new Dexie("services");
//       db.open().then(function() {
//         console.log("Service index exists. Getting last TID");
//         db.table("services")
//           .where('name')
//           .equals(cache.name)
//           .first()
//           .then(function(index) {
//             Dexie.exists(cache.name).then(function(hasTable) {
//               if (hasTable && index) {
//                 // update service with last TID
//                 const tid = index.tid ? index.tid : 0;
//                 updateService(cache, preFetch, tid);
//               } else {
//                 console.log("Service " + cache.name + " doesn't exist. So we must create a new one");
//                 createService(cache, preFetch);
//               }
//             }).catch(function (error) {
//               dispatchError(error);
//               console.error("Oops, an error occurred when trying to check service " + cache.name + " existance", error);
//             });
//           });
//       })
//     } else {
//       createService(cache, preFetch);
//     }
//   })
// }

// function createService(cache, preFetch) {
//   console.log("=> Fetching service: ", cache);
//   let data;

//   // get the data from API
//   request.get(cache.path, {tid: 0})
//     // check and parse the response
//     .then(checkStatus)
//     // just get data from fetch
//     .then(dataApi => { data = dataApi; return data; })
//     // create the db for first time and save the promise
//     .then(data => createVersionSchema(cache, data))
//     // just save the db in parent for further using
//     .then(db => {
//       populateService(cache, data, db)
//     })
//     // add service to index table
//     .catch(function(error) {
//       dispatchError(error);
//       console.log('request failed', cache, error);
//     })

// }

// function updateService(cache, preFetch, lastTID) {
//   // check if index is in store
//   let tid = servicesIndex[cache.name] ? servicesIndex[cache.name].tid : lastTID;
//   let data;
//   openVersionSchema(cache.name).then(function(db) {
//     console.log("=> Updating service: "+ cache.name);
//     request.get(cache.path, {tid: tid})
//       // check and parse the response
//       .then(checkStatus)
//       .then(dataApi => { data = dataApi; return data; })
//       // verify if schema is consistent
//       .then(data => verifySchema(cache, data, db))
//       .then(function(equal) {
//         if (equal) {
//           populateService(cache, data, db)
//         } else {
//           recreateService(cache, data, db)
//         }
//       })
//       .catch(function(error) {
//         dispatchError(error);
//         console.log('request failed', cache, error);
//       })
//   });

// }

// function openVersionSchema(name) {
//   const db = new Dexie(name);
//   return db.open().then(function(db) {
//     return db;
//   })
// }

// function createVersionSchema(cache, data) {
//   // opening new database
//   const db = new Dexie(cache.name);
//   // check if there is any data
//   if (data && data.length > 0) {
//     // creating the table schema
//     const tableSchema = Object.keys(data[0]).toString();
//     let newSchema = {};
//     newSchema[cache.name] = tableSchema;

//     // closing, setting a version, and reopening indexedDB (weird ha?)
//     db.version(1).stores(newSchema);
//     console.log("=> Create " + cache.name + " schema number: "+ db.verno);
//     return db.open().then(function(db) {
//       return db;
//     })
//   }
// }

// function populateService(cache, data, db) {
//   if (db && data) {
//     // finding the table cache
//     let table = db.table(cache.name);
//     // bulk adding the response from the server
//     table.bulkAdd(data).then(function(lastKey) {
//       console.log("=> Last " + cache.name + " cache id was: " + lastKey);
//       loadServiceIndex(cache, data, db);
//     }).catch(Dexie.BulkError, function (e) {
//       dispatchError(e);
//     });
//     return data;
//   }
// }

// function verifySchema(cache, data, db) {

//   // se chequea que exista data
//   if (db && data && data.length > 0) {
//     db.open().then(function() {
//       // obtengo tabla segun su nombre
//       const table = db.table(cache.name);
//       // esquema nuevo en base a data[0], se filta primKey
//       const newSchema = Object.keys(data[0]).filter(item => item !== table.schema.primKey.name);
//       // esquema actual por nombre
//       const currentSchema = _.map(table.schema.indexes, 'name');
//       // comparar esquemas por sus valores en el array
//       if(newSchema.sort().join(',') === currentSchema.sort().join(',')) {
//         console.log("Schemas in " + cache.name + " are equal")
//         return true
//       } else {
//         console.log("Schemas in " + cache.name + " are different")
//         return false
//       }
//     })

//   }
// }

// function getLastTid(cache, data) {
//   if (data) {
//     if (cache.tidName === "TID") {
//       // if have data get the maximun value based on TID column
//       let lastTID = Math.max.apply(Math,data.map(function(o){return o.TID;}));
//       return lastTID;
//     } else if (cache.tidName === "timeStamp") {
//       // if have data get the maximun value based on TID column
//       let lastTID = Object.values(data).sort((prev, next) => next - prev)[0].timeStamp
//       return lastTID;
//     }
//   } else {
//     // if no data just return 0
//     return 0;
//   }
// }

// let serviceVersion = 1;
// function loadServiceIndex(cache, data, dbService) {

//   // services index database
//   const db = new Dexie("services");
//   const serviceLastTid = getLastTid(cache, data);

//   // upgrading service index version
//   serviceVersion++;

//   // count of database is a promise
//   dbService.table(cache.name).count().then(function(serviceLength) {
//     // index object
//     let serviceIndex = {
//       name: cache.name,
//       tid: serviceLastTid,
//       length: serviceLength,
//       path: cache.path
//     }
//     console.log("=> Last TID from service " + cache.name + "["+ serviceVersion +"] is " + serviceLastTid + ". Total length: " + serviceLength);

//       // check if services db exist, otherwise create and populate
//     Dexie.exists("services").then(function(exists) {
//       if (exists) {
//         // opening new database
//         db.open()
//           .then(function() {
//             db.services.put(serviceIndex);
//           })
//           .catch(function(error) {
//             dispatchError(error);
//           })
//           .finally(function() {
//             console.log("======updated " + cache.name + " service added to index=======")
//             // assign service to a global object with all indexes
//             servicesIndex[serviceIndex.name] = serviceIndex
//             console.log(servicesIndex)
//           });
//       } else {
//         db.close();
//         db.version(1).stores({
//           services: 'name, tid, length, path'
//         });
//         // Open the database
//         db.open()
//           .then(function() {
//               db.services.put(serviceIndex);
//           })
//           .catch(function(error) {
//             dispatchError(error);
//           })
//           .finally(function() {
//             console.log("======new " + cache.name + " service added to index=======")
//             // assign service to a global object with all indexes
//             servicesIndex[serviceIndex.name] = serviceIndex
//           });
//       }
//     }).catch(function (error) {
//       dispatchError(error);
//       console.error("Oops, an error occurred when trying to check services index", error);
//     });
//   })
//   return data;
// }



// function recreateService(cache, data, dbService) {
//   // const db = new Dexie("services");
//   dbService.delete().then(() => {
//     console.log("Service " + cache.name + "  " + cache.name+ " has been deleted. Recreating it from 0");
//     loadService(cache);
//   }).catch((err) => {
//     console.error("Could not delete " + cache.name + ".");
//   })

// }

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response.json();
//   }
//   else {
//     const contentType = response.headers.get('content-type');

//     if(contentType && contentType.indexOf('json') !== -1) { // Si responde con contenido json
//       return response.json().then( data => {  //Ojo .json() devuelve una promesa
//         let error = new Error(response.statusText)
//         error.jsonData = data
//         error.response = response
//         dispatchError(error.response);
//         throw error
//       })
//     }
//     else { // Si no responde con contenido json
//       let error = new Error(response.statusText)
//       error.response = response
//       dispatchError(error.response);
//       throw error
//     }
//   }
// }


// function dispatchError(errorMsg) {
//   put({
//     type: 'FETCH_CACHE_FAIL',
//     payload: errorMsg
//   });
// }



