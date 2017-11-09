import {
  ASYNC_REQUEST
} from './constants';

export function asyncCall() {
  return {
    type: ASYNC_REQUEST,
  };
}
