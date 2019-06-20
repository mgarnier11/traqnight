import { ADD_ERROR, HANDLE_ERROR, INITIAL_STATE } from '../constants';

let ids = 0;

export function errors(errors = INITIAL_STATE.errors, action) {
  switch (action.type) {
    case ADD_ERROR:
      return errors.concat(
        Object.assign(
          {},
          {
            id: ids++,
            date: Date.now(),
            message: action.error.message,
            code: action.error.code,
            handled: false
          }
        )
      );
    case HANDLE_ERROR:
      return errors.map((error, i) => {
        return i === errors.length - 1 ? { ...error, handled: true } : error;
      });
    default:
      return errors;
  }
}
