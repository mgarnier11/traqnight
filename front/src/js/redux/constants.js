export const ADD_ERROR = 'ADD_ERROR';
export const HANDLE_ERROR = 'HANDLE_ERROR';

export const GET_TYPES_STARTED = 'GET_TYPES_STARTED';
export const GET_TYPES_SUCCESS = 'GET_TYPES_SUCCESS';
export const GET_TYPES_ERROR = 'GET_TYPES_ERROR';

export const GET_FIRST_PLACES_STARTED = 'GET_FIRST_PLACES_STARTED';
export const GET_NEXT_PLACES_STARTED = 'GET_NEXT_PLACES_STARTED';
export const GET_PLACES_SUCCESS = 'GET_PLACES_SUCCESS';
export const GET_PLACES_ERROR = 'GET_PLACES_ERROR';

export const AUTH_STARTED = 'AUTH_STARTED';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_ERROR = 'AUTH_ERROR';

export const INITIAL_STATE = {
  typesRequest: {
    loading: false,
    types: []
  },
  placesRequest: {
    loading: false,
    originLocation: { lat: 47.35885200000001, lng: -1.944482 },
    nextPlacesToken: '',
    places: []
  },
  auth: {
    loading: false,
    user: undefined
  },
  errors: []
};
