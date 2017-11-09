import * as Models from '../../models/index.js';
import { createSelector } from 'reselect';
import { Environment } from 'model-environment';

const selectObjects = (state) => state.getIn(['objects', 'objects']);
// function selectObjects(state) {
//   return state.get('objects');
// }
const reselectObjects = () => createSelector(selectObjects, (objects) => {
  return new Environment({ objects: objects.toJS() }, Models).parseDB().objects;
});

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  makeSelectLocationState,
  reselectObjects
};
