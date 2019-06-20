import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/index';
import { INITIAL_STATE } from './constants';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  INITIAL_STATE,
  storeEnhancers(applyMiddleware(thunk))
);

export default store;
