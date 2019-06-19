import { createStore } from 'redux';
import reducer from './reducers';

const store = createStore(
  reducer,
  {
    maxPrice: 4,
    minRate: 0,
    types: [{ id: 0, name: 'test' }, { id: 1, name: 'test2' }],
    places: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => console.log('Redux state changed'));

export default store;
