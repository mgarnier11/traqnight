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

      let lstRequests = requestsSrv.find({ query: newQuery.requestsQuery });

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

      returnValue.places = placesIds.map(async placeId => {
        return await placesSrv.get(placeId);
      });
    }

    context.result = returnValue;

    return context;

    /*

    let newResults = [];

    if (query.api === 'google') {
      newResults = data;
    } else {
      if (query.newRequest) {
        if (data.results.length > 0) {
          console.log(data.results.length + ' Places found');
          for (let result of data.results) {
            let newResult = {};

            let googleRes = await apiUtils.getPlaceFromGoogle(
              result.title,
              result.vicinity
            );
            if (googleRes && !googleRes.permanently_closed) {
              newResult.rating = googleRes.rating;
              newResult.priceLevel = googleRes.price_level;
              newResult.location = {
                lat: result.position[0],
                lng: result.position[1]
              };
              newResult.name = result.title;
              newResult.url = result.href;
              newResult.address = result.vicinity;
              newResult.type = query.type;
              newResult.id = result.id;
              newResult = await placeSrv.create(newResult);

              newResults.push(newResult);
            }
          }

          let newRequest = query.query;

          newRequest.results = newResults.map(r => r._id);

          requestSrv.create(newRequest);
        }
      } else {
        let request = query.request;

        for (let resultId of request.results) {
          newResults.push(await placeSrv.get(resultId));
        }
      }
    }

    context.result = newResults;

    return context;*/
  };
}

module.exports = {
  beforeFindHook: beforeFindHook,
  afterFindHook: afterFindHook
};
