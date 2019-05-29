const {
  MethodNotAllowed,
  BadRequest,
  GeneralError
} = require('@feathersjs/errors');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCkiT6O5Me25yx4JV9ZT3iGYYCdsgzqv9w',
  Promise: Promise
});
const myutils = require('../utils');

/*
let p1 = { lat: 47.2167, lng: -1.555 };
let p2 = myutils.calcPoint(p1, 1414, 45);
let p3 = myutils.calcPoint(p1, 1414, 135);
let p4 = myutils.calcPoint(p1, 1414, 225);
let p5 = myutils.calcPoint(p1, 1414, 315);

console.log(p1);
console.log(p2);
console.log(p3);
console.log(p4);
console.log(p5);
*/
/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    /*
    
    let res = await hereSearchRequest({
      q: 'bars',
      in: '47.2167,-1.555;r=1000',
      size: 100
    });

    return res;
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

      let res = {
        origin: location,
        results: await hereSearchRequest({
          q: keyword,
          in: location.lat + ',' + location.lng + ';r=' + radius,
          size: 100
        })
      };
      console.log('google request is ok');
      return res;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequest) throw error;
      else throw new GeneralError('Google API error');
    }
    */
    return true;
  }

  async get(id, params) {
    throw new MethodNotAllowed(
      "Get method is not allowed in the Here's service"
    );
  }

  async create(data, params) {
    throw new MethodNotAllowed(
      "Create method is not allowed in the Here's service"
    );
  }

  async update(id, data, params) {
    throw new MethodNotAllowed(
      "Update method is not allowed in the Here's service"
    );
  }

  async patch(id, data, params) {
    throw new MethodNotAllowed(
      "Patch method is not allowed in the Here's service"
    );
  }

  async remove(id, params) {
    throw new MethodNotAllowed(
      "Remove method is not allowed in the Here's service"
    );
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
