const apiUtils = require('../services/apiUtils');
const { BadRequest } = require('@feathersjs/errors');

const apiErrors = {
  validType: 'Please enter a valid type',
  validRadius: 'Please enter a valid radius',
  validLocation: 'Please enter a valid location'
};

function beforeFindHook(options = {}) {
  return async context => {
    const typesSrv = context.app.service('types');
    const requestsSrv = context.app.service('requests');
    //const nextPlacesTokensSrv = context.app.service('next-places-tokens');
    const query = context.params.query;

    if (!query.nextPlacesToken) {
      let newQuery = {};

      /**Fix Type */
      if (typeof query.typeId !== 'string')
        throw new BadRequest(apiErrors.validType);
      newQuery.type = await typesSrv.get(query.typeId);

      /**Fix Radius */
      if (query.radius <= 1750) {
        newQuery.radius = 1000;
      } else if (query.radius > 1750 && query.radius <= 3750) {
        newQuery.radius = 2500;
      } else {
        newQuery.radius = 5000;
      }

      /**Fix Location */
      if (typeof query.location !== 'string')
        throw new BadRequest(apiErrors.validLocation);

      let town = await apiUtils.getTown(query.location);

      newQuery.location = {
        lat: town.geometry.location.lat,
        lng: town.geometry.location.lng
      };

      newQuery.requestsQuery = {
        town: town.name,
        radius: newQuery.radius,
        typeId: newQuery.type._id
      };

      let lstRequests = await requestsSrv.find({
        query: newQuery.requestsQuery
      });

      if (lstRequests.length > 0) {
        newQuery.isNewRequest = false;

        newQuery.request = lstRequests[0];
      } else {
        newQuery.isNewRequest = true;
      }

      context.params.query = newQuery;
    }

    return context;
  };
}

function afterFindHook(options = {}) {
  return async context => {
    const query = context.params.query;
    const placesSrv = context.app.service('places');

    let returnValue = {
      nextPlacesToken: query.nextPlacesToken,
      origin: query.location,
      places: []
    };

    if (query.isNewRequest) {
      returnValue.places = context.result;
    } else {
      let placesIds = context.result;

      for (let placeId of placesIds) {
        returnValue.places.push(await placesSrv.get(placeId));
      }
    }

    context.result = returnValue;

    return context;
  };
}

module.exports = {
  beforeFindHook: beforeFindHook,
  afterFindHook: afterFindHook
};
