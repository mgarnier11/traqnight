import {
  TYPE_ACTION_STARTED,
  TYPE_ACTION_ERROR,
  ADD_ERROR,
  TYPE_GET_ALL,
  TYPE_CREATE,
  TYPE_UPDATE,
  TYPE_REMOVE
} from '../constants';
import apiHandler from '../../api/apiHandler';

export function getTypes() {
  return function(dispatch) {
    dispatch({ type: TYPE_ACTION_STARTED });
    return apiHandler.typeService
      .find({
        query: {
          $sort: {
            name: -1
          }
        }
      })
      .then(response => {
        dispatch({ type: TYPE_GET_ALL, data: response });
      })
      .catch(error => {
        dispatch({ type: TYPE_ACTION_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}

export function createType(typeDatas) {
  return function(dispatch) {
    dispatch({ type: TYPE_ACTION_STARTED });
    return apiHandler.typeService
      .create(typeDatas)
      .then(createdType => {
        dispatch({ type: TYPE_CREATE, createdType });
      })
      .catch(error => {
        dispatch({ type: TYPE_ACTION_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}

export function updateType(id, typeDatas) {
  return function(dispatch) {
    dispatch({ type: TYPE_ACTION_STARTED });
    return apiHandler.typeService
      .patch(id, typeDatas)
      .then(updatedType => {
        console.log(updatedType);
        dispatch({ type: TYPE_UPDATE, updatedType });
      })
      .catch(error => {
        dispatch({ type: TYPE_ACTION_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}

export function removeType(id) {
  return function(dispatch) {
    dispatch({ type: TYPE_ACTION_STARTED });
    return apiHandler.typeService
      .remove(id)
      .then(removedType => {
        dispatch({ type: TYPE_REMOVE, removedType });
      })
      .catch(error => {
        dispatch({ type: TYPE_ACTION_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
