import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';
import Modal from 'react-modal';

import App from './js/components/App/App';
import { getTypes } from './js/redux/actions/type-actions';
import * as serviceWorker from './serviceWorker';
import ErrorComponent from './js/components/ErrorHandler';

import './index.css';
import './index.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';
import './images/buildings1-min-compressor.jpg';

import store from './js/redux/store';

toast.configure();

store.dispatch(getTypes());

Modal.setAppElement('#root');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ErrorComponent />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
