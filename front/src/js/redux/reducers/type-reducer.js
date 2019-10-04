import {
  TYPE_ACTION_STARTED,
  TYPE_ACTION_ERROR,
  INITIAL_STATE,
  TYPE_GET_ALL,
  TYPE_CREATE,
  TYPE_UPDATE,
  TYPE_REMOVE
} from '../constants';

export function types(typesRequest = INITIAL_STATE.typesRequest, action) {
  switch (action.type) {
    case TYPE_ACTION_STARTED:
      return Object.assign({}, typesRequest, { loading: true });
    case TYPE_GET_ALL:
      return Object.assign({}, typesRequest, {
        loading: false,
        types: action.data
      });
    case TYPE_CREATE:
      return Object.assign({}, typesRequest, {
        loading: false,
        types: typesRequest.types.concat(action.createdType)
      });
    case TYPE_UPDATE:
      return Object.assign({}, typesRequest, {
        loading: false,
        types: typesRequest.types.map(type =>
          type._id.toString() === action.updatedType._id.toString()
            ? action.updatedType
            : type
        )
      });

    case TYPE_REMOVE:
      return Object.assign({}, typesRequest, {
        loading: false,
        types: typesRequest.types.filter(
          type => type._id.toString() !== action.removedType._id.toString()
        )
      });
    case TYPE_ACTION_ERROR:
      return Object.assign({}, typesRequest, {
        loading: false
      });

    default:
      return typesRequest;
  }
}
