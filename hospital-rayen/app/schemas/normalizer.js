import { normalize } from 'normalizr';
export default (...args) => { 
	const {result, entities} = normalize(args[0], args[1]);
  return { result, objects: entities };
}