import {
  AUTH_ACTION_STARTED,
  AUTH_ACTION_SUCCESS,
  AUTH_ACTION_FAILURE,
  AUTH_ERROR,
  AUTH_LOGOUT,
  ADD_ERROR,
  AUTH_CREATE,
  AUTH_UPDATE,
  AUTH_REMOVE
} from '../constants';
import apiHandler from '../../api/apiHandler';
import store from '../store';

export function login(params) {
  if (params === undefined) params = {};
  return function(dispatch) {
    dispatch({ type: AUTH_ACTION_STARTED, user: undefined });
    return apiHandler
      .login(params.credentials)
      .then(user => {
        if (user) {
          dispatch({
            type: AUTH_ACTION_SUCCESS,
            user: user
          });
        } else {
          dispatch({ type: AUTH_ACTION_FAILURE });
        }
      })
      .catch(error => {
        dispatch({ type: AUTH_ACTION_FAILURE });
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

export function createUser(userDatas) {
  return function(dispatch) {
    dispatch({ type: AUTH_ACTION_STARTED, user: undefined });
    return apiHandler.userService
      .create(userDatas)
      .then(createdUser => {
        dispatch({ type: AUTH_CREATE, createdUser });
      })
      .catch(error => {
        dispatch({ type: AUTH_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}

export function updateUser(id, userDatas) {
  return function(dispatch) {
    dispatch({ type: AUTH_ACTION_STARTED, user: store.getState().auth.user });
    return apiHandler.userService
      .patch(id, userDatas)
      .then(updatedUser => {
        dispatch({ type: AUTH_UPDATE, updatedUser });
      })
      .catch(error => {
        dispatch({ type: AUTH_ACTION_FAILURE });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}

export function removeUser(id) {
  return function(dispatch) {
    dispatch({ type: AUTH_ACTION_STARTED, user: store.getState().auth.user });
    return apiHandler.userService
      .remove(id)
      .then(removedUser => {
        dispatch({ type: AUTH_REMOVE, removedUser });
      })
      .catch(error => {
        dispatch({ type: AUTH_ACTION_FAILURE });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
