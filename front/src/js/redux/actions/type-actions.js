import {
  GET_TYPES_STARTED,
  GET_TYPES_SUCCESS,
  GET_TYPES_ERROR,
  ADD_ERROR
} from '../constants';
import apiHandler from '../../api/apiHandler';

export function getTypes() {
  return function(dispatch) {
    dispatch({ type: GET_TYPES_STARTED });
    return apiHandler.typeService
      .find({
        query: {
          $sort: {
            name: -1
          }
        }
      })
      .then(response => {
        dispatch({ type: GET_TYPES_SUCCESS, data: response });
      })
      .catch(error => {
        dispatch({ type: GET_TYPES_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
