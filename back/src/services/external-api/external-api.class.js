const {
  MethodNotAllowed,
  BadRequest,
  GeneralError
} = require('@feathersjs/errors');
const apiUtils = require('../apiUtils');
const queueHandler = require('../../queue/queue');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.app = options.app;
  }

  async find(params) {
    try {
      let placesIds = [];

      if (params.query.nextPlacesToken) {
        let nextPlacesToken = await this.app
          .service('next-places-tokens')
          .get(params.query.nextPlacesToken);

        params.query.nextPlacesToken = nextPlacesToken.nextPlacesToken;

        let request = await this.app
          .service('requests')
          .get(nextPlacesToken.requestId);
        placesIds = request.placesIds.slice(
          nextPlacesToken.startPosition,
          nextPlacesToken.endPosition
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
          let returnPlaces = [];
          console.log('first results are ok');

          for (let herePlace of herePlaces) {
            herePlace.keyword = keyword;
            herePlace.type = params.query.type;
            let newPlace = await this.app.service('places').create(herePlace);
            if (newPlace.state !== 'permanently_closed')
              if (
                returnPlaces.find(
                  p => p._id.toString() === newPlace._id.toString()
                ) === undefined
              )
                returnPlaces.push(newPlace);
          }

          console.log('all first results have google datas');

          let queueParams = {
            app: this.app,
            requestsQuery: params.query.requestsQuery,
            apiParams: { location, radius, keyword }
          };

          queueHandler.processRequestsQuery(queueParams);

          return returnPlaces;
        } else {
          placesIds = params.query.request.placesIds.slice(0, 25);

          params.query.nextPlacesToken = params.query.request.nextPlacesToken;
        }
      }
      return placesIds;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequest) throw error;
      else throw new GeneralError('API error');
    }
  }

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
