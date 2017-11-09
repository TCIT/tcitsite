import pluralize from 'pluralize';
export function getObjectsFromSingleResponse(response, singularObjectClassName) {
  const objectClassName = pluralize(singularObjectClassName);
  console.log("VERRRRRRR")
  console.log(pluralize('status'))
  return {[objectClassName]: getObjectsHash([response])};
}

export function getObjectsHash(objects) {
  const objectsHash = {}
  objects.forEach(object => {
    objectsHash[object.id] = object
  })
  return objectsHash;
}