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
    const query = params.query;

    try {
      let placesIds = [];
      //we check if the user clicked on "more resutls"
      if (query.nextPlacesToken) {
        //get the token from db
        let nextPlacesToken = await this.app
          .service('next-places-tokens')
          .get(query.nextPlacesToken);

        //set the next toekn that will be sent to us if the user clicks on "more results" again
        query.nextPlacesToken = nextPlacesToken.nextPlacesToken;

        //get only the placesIds we want for this request
        placesIds = nextPlacesToken.request.placesIds.slice(
          nextPlacesToken.startPosition,
          nextPlacesToken.endPosition
        );
      } else {
        let location = query.location;
        let keyword = query.type.googleType;
        let radius = query.radius;

        //check if the request has been done before
        if (query.isNewRequest) {
          //if not get the first and fastest results we can find
          let herePlaces = await apiUtils.getFirstResults(
            location,
            radius,
            query.type
          );
          let returnPlaces = [];
          console.log('first results are ok');

          console.log(herePlaces);

          //give them good datas, save them and check if they are nt permanently closed
          for (let herePlace of herePlaces) {
            herePlace.keyword = keyword;
            herePlace.type = query.type;

            let newPlace = await this.app.service('places').create(herePlace);
            if (newPlace.state !== 'permanently_closed')
              if (
                returnPlaces.find(
                  p => p._id.toString() === newPlace._id.toString()
                ) === undefined
              )
                returnPlaces.push(newPlace);
          }
          //here all first results should be in return palces

          console.log('all first results have google datas');

          let queueParams = {
            app: this.app,
            requestsQuery: query.requestsQuery,
            apiParams: { location, radius, keyword, type: query.type }
          };
          //get more results for this request
          //and save the requests for ultra fast resutls next time an user does it
          queueHandler.processRequestsQuery(queueParams);

          return returnPlaces;
        } else {
          //the request has been done beofre just set the plces ids we want to return
          placesIds = query.request.placesIds.slice(0, 25);
          // and set the nextplacestoekn for when the user will click on "more result"
          params.query.nextPlacesToken = query.request.nextPlacesToken;
        }
      }
      //the placesids will be mappped into places in the afterFindHook
      return placesIds;
    } catch (error) {
      console.log(error);
      //error throwed by me
      if (error instanceof BadRequest) throw error;
      //every other error
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
