const apiUtils = require('../services/apiUtils');
const { BadRequest } = require('@feathersjs/errors');

const apiErrors = {
  validType: 'Please enter a valid type',
  validRadius: 'Please enter a valid radius',
  validLocation: 'Please enter a valid location'
};

function beforeFindHook(options = {}) {
  return async context => {
    const requestSrv = context.app.service('requests');
    const query = context.params.query;

    let newQuery = {};

    newQuery.api = query.api;

    if (typeof query.type !== 'string')
      throw new BadRequest(apiErrors.validType);
    newQuery.type = await context.app.service('types').get(query.type);

    if (typeof query.radius !== 'number')
      throw new BadRequest(apiErrors.validRadius);

    if (query.radius <= 1750) {
      newQuery.radius = 1000;
    } else if (query.radius > 1750 && query.radius <= 3750) {
      newQuery.radius = 2500;
    } else {
      newQuery.radius = 5000;
    }

    if (typeof query.location === 'string') {
      let town = await apiUtils.getTown(query.location);

      newQuery.location = {
        lat: town.geometry.location.lat,
        lng: town.geometry.location.lng
      };

      newQuery.query = {
        town: town.name,
        radius: newQuery.radius,
        type: newQuery.type._id
      };

      let requests = await requestSrv.find({
        query: newQuery.query
      });

      if (requests.length > 0) {
        newQuery.newRequest = false;
        newQuery.request = requests[0];
      } else {
        newQuery.newRequest = true;
      }
    } else if (typeof query.location === 'object') {
      if (typeof query.location.lat !== 'number')
        throw new BadRequest(apiErrors.validLocation);
      if (typeof query.location.lng !== 'number')
        throw new BadRequest(apiErrors.validLocation);

      newQuery.location = {
        lat: query.location.lat,
        lng: query.location.lng
      };
      newQuery.newRequest = true;
    } else {
      throw new BadRequest(apiErrors.validLocation);
    }

    context.params.query = newQuery;

    return context;
  };
}

function afterFindHook(options = {}) {
  return async context => {
    const requestSrv = context.app.service('requests');
    const placeSrv = context.app.service('places');
    const query = context.params.query;
    const data = context.result;

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

    return context;
  };
}

module.exports = {
  beforeFindHook: beforeFindHook,
  afterFindHook: afterFindHook
};
