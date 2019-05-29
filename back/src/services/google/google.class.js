const {
  MethodNotAllowed,
  BadRequest,
  GeneralError
} = require('@feathersjs/errors');
const myutils = require('../utils');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCkiT6O5Me25yx4JV9ZT3iGYYCdsgzqv9w',
  Promise: Promise
});

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    try {
      let location = null;
      let type = params.query.type.type;
      let keyword = params.query.type.name;
      let radius =
        params.query.radius === undefined ? 1000 : params.query.radius;

      if (params.query.location.lat && params.query.location.lng) {
        location = params.query.location;
      } else {
        let townName = params.query.location;

        if (!townName) throw new BadRequest('Ville invalide');

        let placeIdResponse = await googleMapsClient
          .findPlace({
            input: townName + ', France',
            inputtype: 'textquery'
          })
          .asPromise();

        if (placeIdResponse.status !== 200)
          throw new BadRequest('Ville invalide');
        if (placeIdResponse.json.status !== 'OK')
          throw new BadRequest('Ville invalide');
        if (placeIdResponse.json.candidates.length === 0)
          throw new BadRequest('Ville invalide');

        let placeId = placeIdResponse.json.candidates[0].place_id;

        let placeResponse = await googleMapsClient
          .place({
            placeid: placeId
          })
          .asPromise();

        if (placeResponse.status !== 200)
          throw new BadRequest('Ville invalide');
        if (placeResponse.json.status !== 'OK')
          throw new BadRequest('Ville invalide');

        let place = placeResponse.json.result;

        location = place.geometry.location;
      }

      async function getResults(pageToken) {
        let resultsResponse;
        let goodResults = [];

        if (!pageToken)
          resultsResponse = await googleMapsClient
            .placesNearby({
              location: location,
              type: type,
              rankby: 'distance'
            })
            .asPromise();
        else
          resultsResponse = await googleMapsClient
            .placesNearby({
              pagetoken: pageToken
            })
            .asPromise();

        if (resultsResponse.status !== 200)
          throw new BadRequest('Ville invalide');
        if (
          resultsResponse.json.status !== 'OK' &&
          resultsResponse.json.status !== 'ZERO_RESULTS'
        )
          throw new BadRequest('Ville invalide');

        let results = resultsResponse.json.results;

        for (let result of results) {
          let distance = myutils.distanceInMBetweenEarthCoordinates(
            result.geometry.location.lat,
            result.geometry.location.lng,
            location.lat,
            location.lng
          );
          result.distance = distance;

          result.isOpened = result.opening_hours
            ? result.opening_hours.open_now
            : null;
          result.type = params.query.type;
          if (result.distance < radius) {
            goodResults.push(result);
          }
          //goodResults.push(result);
        }

        if (goodResults.length == 20 && resultsResponse.json.next_page_token) {
          var p = new Promise(async (res, rej) => {
            setTimeout(async () => {
              res(
                goodResults.concat(
                  await getResults(resultsResponse.json.next_page_token)
                )
              );
            }, 2000);
          });

          return await p;
        } else {
          return goodResults;
        }
      }

      let inParam = location.lat + ',' + location.lng + ';r=' + radius;
      let location2 = myutils.calcPoint(location, radius * Math.sqrt(2), 45);
      inParam =
        location.lng +
        ',' +
        location.lat +
        ',' +
        location2.lng +
        ',' +
        location2.lat;

      let res = {
        origin: location,
        results: await myutils.hereSearchRequest({
          q: keyword,
          in: inParam,
          size: 100
        })
      };

      res.results = res.results.items;

      for (let result of res.results) {
        result.geometry = {
          location: {
            lat: result.position[0],
            lng: result.position[1]
          }
        };
        result.name = result.title;
        result.type = params.query.type;
      }
      console.log('google request is ok');
      return res;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequest) throw error;
      else throw new GeneralError('Google API error');
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
