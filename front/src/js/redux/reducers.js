import { combineReducers } from 'redux';
import {
  SET_MAXPRICE,
  SET_MINRATE,
  DELETE_TYPE,
  DELETE_PLACE
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
    default:
      return types;
  }
}

function places(places = [], action) {
  switch (action.type) {
    case DELETE_PLACE:
      return places.filter(place => place.id !== action.placeId);
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
