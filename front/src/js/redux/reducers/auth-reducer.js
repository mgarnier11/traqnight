import {
  AUTH_ACTION_STARTED,
  AUTH_ERROR,
  AUTH_ACTION_FAILURE,
  AUTH_ACTION_SUCCESS,
  AUTH_LOGOUT,
  INITIAL_STATE,
  AUTH_CREATE,
  AUTH_REMOVE,
  AUTH_UPDATE
} from '../constants';

export function auth(auth = INITIAL_STATE.auth, action) {
  switch (action.type) {
    case AUTH_ACTION_STARTED:
      return Object.assign({}, auth, {
        loading: true
      });
    case AUTH_ACTION_SUCCESS:
      return Object.assign({}, auth, { loading: false, user: action.user });
    case AUTH_ACTION_FAILURE:
      return Object.assign({}, auth, { loading: false, user: undefined });
    case AUTH_LOGOUT:
      return Object.assign({}, auth, { loading: false, user: undefined });
    case AUTH_ERROR:
      return Object.assign({}, auth, { loading: false, user: undefined });
    case AUTH_CREATE:
      return Object.assign({}, auth, {
        loading: false,
        user: action.createdUser
      });
    case AUTH_REMOVE:
      return Object.assign({}, auth, { loading: false, user: undefined });
    case AUTH_UPDATE:
      return Object.assign({}, auth, {
        loading: false,
        user: action.updatedUser
      });
    default:
      return auth;
  }
}
