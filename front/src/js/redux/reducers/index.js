import { combineReducers } from 'redux';

import { types } from './type-reducer';
import { places } from './place-reducer';
import { errors } from './error-reducer';

const combinedReducers = combineReducers({
  typesRequest: types,
  placesRequest: places,
  errors: errors
});

export default combinedReducers;
