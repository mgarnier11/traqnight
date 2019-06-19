import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  {
    maxPrice: 4,
    minRate: 0,
    types: [],
    places: [{ id: 0, name: 'test' }, { id: 1, name: 'test2' }]
  },
  storeEnhancers(applyMiddleware(thunk))
);
store.subscribe(() => console.log('Redux state changed'));

export default store;
