import { combineReducers } from 'redux';

import { types } from './type-reducer';
import { places } from './place-reducer';
import { errors } from './error-reducer';
import { auth } from './auth-reducer';

const combinedReducers = combineReducers({
  typesRequest: types,
  placesRequest: places,
  auth: auth,
  errors: errors
});

export default combinedReducers;
