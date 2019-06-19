import { combineReducers } from 'redux';
import {
  SET_MAXPRICE,
  SET_MINRATE,
  DELETE_TYPE,
  GET_TYPES_STARTED,
  GET_TYPES_SUCCESS,
  GET_TYPES_ERROR,
  DELETE_PLACE,
  GET_PLACES_STARTED,
  GET_PLACES_SUCCESS,
  GET_PLACES_ERROR
} from './actions';

function setPrice(maxPrice = 4, action) {
  switch (action.type) {
    case SET_MAXPRICE:
      return action.maxPrice;
    default:
      return maxPrice;
  }
}

function setRate(minRate = 0, action) {
  switch (action.type) {
    case SET_MINRATE:
      return action.minRate;
    default:
      return minRate;
  }
}

function types(types = [], action) {
  switch (action.type) {
    case DELETE_TYPE:
      return types.filter(type => type.id !== action.typeId);
    case GET_TYPES_STARTED:
      return types;
    case GET_TYPES_SUCCESS:
      return action.data;
    case GET_TYPES_ERROR:
      return types;
    default:
      return types;
  }
}

function places(places = [], action) {
  switch (action.type) {
    case DELETE_PLACE:
      return places.filter(place => place.id !== action.placeId);
    case GET_PLACES_STARTED:
      return places;
    case GET_PLACES_SUCCESS:
      return action.data;
    case GET_PLACES_ERROR:
      return places;
    default:
      return places;
  }
}

const app = combineReducers({
  maxPrice: setPrice,
  minRate: setRate,
  types,
  places
});

export default app;
