import {
  AUTH_STARTED,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_ERROR,
  ADD_ERROR
} from '../constants';
import apiHandler from '../../api/apiHandler';

export function login(credentials) {
  return function(dispatch) {
    dispatch({ type: AUTH_STARTED });
    return apiHandler
      .login(credentials)
      .then(response => {
        if (response) {
          dispatch({
            type: AUTH_SUCCESS,
            user: apiHandler.feathers.get('user')
          });
        } else {
          dispatch({ type: AUTH_FAILURE });
        }
      })
      .catch(error => {
        dispatch({ type: AUTH_FAILURE });
        dispatch({ type: AUTH_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
