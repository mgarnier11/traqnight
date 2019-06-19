import {
  GET_PLACES_STARTED,
  GET_PLACES_SUCCESS,
  GET_PLACES_ERROR,
  ADD_ERROR
} from '../constants';
import apiHandler from '../../api/apiHandler';

export function getTypes(params) {
  return function(dispatch) {
    dispatch({ type: GET_PLACES_STARTED });
    return apiHandler
      .findPlaces(params)
      .then(response => {
        dispatch({ type: GET_PLACES_SUCCESS, data: response });
      })
      .catch(error => {
        dispatch({ type: GET_PLACES_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
