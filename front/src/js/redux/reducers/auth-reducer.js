import {
  AUTH_STARTED,
  AUTH_ERROR,
  AUTH_FAILURE,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  INITIAL_STATE
} from '../constants';

export function auth(auth = INITIAL_STATE.auth, action) {
  switch (action.type) {
    case AUTH_STARTED:
      return Object.assign({}, auth, { loading: true, user: undefined });
    case AUTH_SUCCESS:
      return Object.assign({}, auth, { loading: false, user: action.user });
    case AUTH_FAILURE:
      return Object.assign({}, auth, { loading: false, user: undefined });
    case AUTH_LOGOUT:
      return Object.assign({}, auth, { loading: false, user: undefined });
    case AUTH_ERROR:
      return Object.assign({}, auth, { loading: false, user: undefined });
    default:
      return auth;
  }
}
