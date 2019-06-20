import { ADD_ERROR, HANDLE_ERROR } from '../constants';

export function addError(error) {
  return { type: ADD_ERROR, error };
}

export function handleError() {
  return { type: HANDLE_ERROR };
}
