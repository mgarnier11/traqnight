import {
  GET_TYPES_STARTED,
  GET_TYPES_SUCCESS,
  GET_TYPES_ERROR,
  INITIAL_STATE
} from '../constants';

function types(typesRequest = INITIAL_STATE.typesRequest, action) {
  switch (action.type) {
    case GET_TYPES_STARTED:
      return Object.assign({}, typesRequest, { loading: true });
    case GET_TYPES_SUCCESS:
      return Object.assign({}, typesRequest, {
        loading: false,
        types: action.data
      });
    case GET_TYPES_ERROR:
      return Object.assign({}, typesRequest, {
        loading: false,
        types: []
      });
    default:
      return typesRequest;
  }
}
