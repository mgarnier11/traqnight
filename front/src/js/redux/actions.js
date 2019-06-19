import apiHandler from '../api/apiHandler';

/*
 * action types
 */

export const SET_MAXPRICE = 'SET_MAXPRICE';
export const SET_MINRATE = 'SET_MINRATE';
export const DELETE_TYPE = 'DELETE_TYPE';
export const DELETE_PLACE = 'DELETE_PLACE';
export const GET_TYPES_STARTED = 'GET_TYPES_STARTED';
export const GET_TYPES_SUCCESS = 'GET_TYPES_SUCCESS';
export const GET_TYPES_ERROR = 'GET_TYPES_ERROR';
export const GET_PLACES_STARTED = 'GET_PLACES_STARTED';
export const GET_PLACES_SUCCESS = 'GET_PLACES_SUCCESS';
export const GET_PLACES_ERROR = 'GET_PLACES_ERROR';

/*
 * action creators
 */

export function setPriceFilter(maxPrice) {
  return { type: SET_MAXPRICE, maxPrice };
}

export function setRatingFilter(minRate) {
  return { type: SET_MINRATE, minRate };
}

export function deleteType(typeId) {
  return { type: DELETE_TYPE, typeId };
}

export function deletePlace(placeId) {
  return { type: DELETE_PLACE, placeId };
}

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
      .then(results => {
        dispatch({ type: GET_TYPES_SUCCESS, data: results });
      })
      .catch(error => {
        dispatch({ type: GET_TYPES_ERROR, error: error });
      });
  };
}

export function getPlaces(params) {
  return function(dispatch) {
    dispatch({ type: GET_PLACES_STARTED });
    return apiHandler
      .findPlaces(params)
      .then(results => {
        dispatch({ type: GET_PLACES_SUCCESS, data: results.results });
      })
      .catch(error => {
        dispatch({ type: GET_PLACES_ERROR, error: error });
      });
  };
}
