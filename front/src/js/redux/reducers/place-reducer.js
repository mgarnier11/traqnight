import {
  GET_FIRST_PLACES_STARTED,
  GET_NEXT_PLACES_STARTED,
  GET_PLACES_SUCCESS,
  GET_PLACES_ERROR,
  INITIAL_STATE
} from '../constants';

export function places(placesRequest = INITIAL_STATE.placesRequest, action) {
  switch (action.type) {
    case GET_FIRST_PLACES_STARTED:
      return Object.assign({}, placesRequest, { loading: true, places: [] });
    case GET_NEXT_PLACES_STARTED:
      return Object.assign({}, placesRequest, { loading: true });
    case GET_PLACES_SUCCESS:
      return Object.assign({}, placesRequest, {
        loading: false,
        nextPlacesToken: action.data.nextPlacesToken,
        originLocation:
          action.data.origin !== undefined
            ? action.data.origin
            : placesRequest.originLocation,
        places: placesRequest.places.concat(action.data.places)
      });
    case GET_PLACES_ERROR:
      return Object.assign({}, placesRequest, {
        loading: false
      });
    default:
      return placesRequest;
  }
}
