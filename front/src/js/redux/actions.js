/*
 * action types
 */

export const SET_MAXPRICE = 'SET_MAXPRICE';
export const SET_MINRATE = 'SET_MINRATE';
export const DELETE_TYPE = 'DELETE_TYPE';
export const DELETE_PLACE = 'DELETE_PLACE';

/*
 * action creators
 */

export function setPriceFilter(maxPrice) {
  return { type: SET_MAXPRICE, maxPrice };
}

export function setRatingFilter(minRate) {
  return { type: SET_MINRATE, minRate };
}

export function deleteType(typeId) {
  return { type: DELETE_TYPE, typeId };
}

export function deletePlace(placeId) {
  return { type: DELETE_PLACE, placeId };
}
