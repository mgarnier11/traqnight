import {
  GET_FIRST_PLACES_STARTED,
  GET_NEXT_PLACES_STARTED,
  GET_PLACES_SUCCESS,
  GET_PLACES_ERROR,
  ADD_ERROR
} from '../constants';
import apiHandler from '../../api/apiHandler';

export function getPlaces(params) {
  return function(dispatch) {
    if (!params.nextPlacesToken) dispatch({ type: GET_FIRST_PLACES_STARTED });
    else dispatch({ type: GET_NEXT_PLACES_STARTED });
    return apiHandler
      .performRequest(params)
      .then(response => {
        dispatch({ type: GET_PLACES_SUCCESS, data: response });
      })
      .catch(error => {
        dispatch({ type: GET_PLACES_ERROR });
        dispatch({ type: ADD_ERROR, error: error });
      });
  };
}
