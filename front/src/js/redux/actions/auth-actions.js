import {
  AUTH_STARTED,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_ERROR,
  AUTH_LOGOUT,
  ADD_ERROR
} from '../constants';
import apiHandler from '../../api/apiHandler';

export function login(params) {
  if (params === undefined) params = {};
  return function(dispatch) {
    dispatch({ type: AUTH_STARTED });
    return apiHandler
      .login(params.credentials)
      .then(user => {
        if (user) {
          dispatch({
            type: AUTH_SUCCESS,
            user: user
          });
        } else {
          dispatch({ type: AUTH_FAILURE });
        }
      })
      .catch(error => {
        dispatch({ type: AUTH_FAILURE });
        dispatch({ type: AUTH_ERROR });
        if (params.errors) dispatch({ type: ADD_ERROR, error: error });
      });
  };
}

export function logout() {
  return function(dispatch) {
    return apiHandler
      .logout()
      .then(() => {
        dispatch({ type: AUTH_LOGOUT });
      })
      .catch(error => {
        dispatch({ type: AUTH_LOGOUT });
        dispatch({ type: AUTH_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
