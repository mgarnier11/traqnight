const {
  MethodNotAllowed,
  BadRequest,
  GeneralError
} = require('@feathersjs/errors');
const apiUtils = require('../apiUtils');
const Place = require('../../../../classes/place');

/* eslint-disable no-unused-vars */
class Service {
  constructor(app) {
    this.app = app;
  }

  async find(params) {
    try {
      let placesIds;

      if (params.query.nextPlacesToken) {
        let nextPlacesToken = await this.app
          .services('next-places-token')
          .get(params.query.nextPlacesToken);

        params.query.nextPlacesToken = nextPlacesToken.nextPlacesToken;

        placesIds = await this.app
          .services('requests')
          .get(nextPlacesToken.requestId)
          .placesIds.slice(
            nextPlacesToken.startPosition,
            nextPlacesToken.startPosition + 100
          );
      } else {
        let location = params.query.location;
        let keyword = params.query.type.name;
        let radius = params.query.radius;

        if (params.query.isNewRequest) {
          let herePlaces = await apiUtils.getFirstResults(
            location,
            radius,
            keyword
          );

          apiUtils.storeAllResults(
            this.app,
            params.query.requestsQuery,
            location,
            radius,
            keyword
          );

          return herePlaces;
        } else {
          placesIds = params.query.request.placesIds.slice(0, 100);

          params.query.nextPlacesToken = params.query.request.nextPlacesToken;
        }
        return placesIds;
      }
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequest) throw error;
      else throw new GeneralError('API error');
    }
  }
  /*
  async findOld(params) {
    try {
      let location = params.query.location;
      let keyword = params.query.type.name;
      let type = params.query.type;
      let radius = params.query.radius;
      let returnVal = { origin: location, results: [] };
      let results;

      if (params.query.api === 'google') {
        results = await apiUtils.getGoogleResults(location, type, radius);
      } else {
        if (params.query.newRequest) {
          results = await apiUtils.getHereResults(location, radius, keyword);
        }
      }

      const lookupObj = {};

      returnVal.results = results.filter(x => {
        let ret = !lookupObj[x.id];
        lookupObj[x.id] = true;
        return ret;
      });

      if (params.query.api === 'google') {
        returnVal.results = returnVal.results.map(result => {
          return new Place().setValuesFromGoogle(result);
        });
      } else {
        returnVal.results = returnVal.results.map(result => {
          return new Place().setValuesFromDb(result);
        });
      }

      return returnVal;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequest) throw error;
      else throw new GeneralError('API error');
    }
  }*/

  async get(id, params) {
    throw new MethodNotAllowed(
      "Get method is not allowed in the google's service"
    );
  }

  async create(data, params) {
    throw new MethodNotAllowed(
      "Create method is not allowed in the google's service"
    );
  }

  async update(id, data, params) {
    throw new MethodNotAllowed(
      "Update method is not allowed in the google's service"
    );
  }

  async patch(id, data, params) {
    throw new MethodNotAllowed(
      "Patch method is not allowed in the google's service"
    );
  }

  async remove(id, params) {
    throw new MethodNotAllowed(
      "Remove method is not allowed in the google's service"
    );
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
