export const ADD_ERROR = 'ADD_ERROR';
export const HANDLE_ERROR = 'HANDLE_ERROR';

export const TYPE_ACTION_STARTED = 'TYPE_ACTION_STARTED';
export const TYPE_ACTION_ERROR = 'TYPE_ACTION_ERROR';
export const TYPE_GET_ALL = 'TYPE_GET_ALL';
export const TYPE_UPDATE = 'TYPE_UPDATE';
export const TYPE_CREATE = 'TYPE_CREATE';
export const TYPE_REMOVE = 'TYPE_REMOVE';

export const GET_FIRST_PLACES_STARTED = 'GET_FIRST_PLACES_STARTED';
export const GET_NEXT_PLACES_STARTED = 'GET_NEXT_PLACES_STARTED';
export const GET_PLACES_SUCCESS = 'GET_PLACES_SUCCESS';
export const GET_PLACES_ERROR = 'GET_PLACES_ERROR';

export const AUTH_ACTION_STARTED = 'AUTH_ACTION_STARTED';
export const AUTH_ACTION_SUCCESS = 'AUTH_ACTION_SUCCESS';
export const AUTH_ACTION_FAILURE = 'AUTH_ACTION_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_CREATE = 'AUTH_CREATE';
export const AUTH_UPDATE = 'AUTH_UPDATE';
export const AUTH_REMOVE = 'AUTH_REMOVE';

export const INITIAL_STATE = {
  typesRequest: {
    loading: false,
    types: []
  },
  placesRequest: {
    loading: false,
    originLocation: { lat: 47.218371, lng: -1.553621 },
    nextPlacesToken: '',
    places: []
  },
  auth: {
    loading: false,
    user: undefined
  },
  errors: []
};
