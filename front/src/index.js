import React from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';

import App from './js/componentsv2/App/App';
import { getTypes } from './js/redux/actions/type-actions';
import * as serviceWorker from './serviceWorker';
import ErrorComponent from './js/componentsv2/ErrorHandler';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';
import './images/buildings1-min-compressor.jpg';

import store from './js/redux/store';

toast.configure();

store.dispatch(getTypes());

ReactDOM.render(
  <Provider store={store}>
    <App />
    <ErrorComponent />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
