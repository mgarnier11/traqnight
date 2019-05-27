const { MethodNotAllowed, BadRequest, GeneralError } = require('@feathersjs/errors');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDRSLqNh7shuCn-bFK930HdFGTAMjI3Q7E',
  Promise: Promise
});

const types = [
  'bar',
  'night_club'
]

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
}

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    try {

      let location = null;
      let type = types[params.query.type];
      let radius = (params.query.radius === undefined ? 1000 : params.query.radius);

      if (params.query.location.lat && params.query.location.lng) {
        location = params.query.location;
      } else {
        let townName = params.query.location;

        if (!townName) throw new BadRequest('Ville invalide');

        let placeIdResponse = await googleMapsClient.findPlace({
          input: townName,
          inputtype: 'textquery'
        }).asPromise();

        if (placeIdResponse.status !== 200) throw new BadRequest('Ville invalide');
        if (placeIdResponse.json.status !== 'OK') throw new BadRequest('Ville invalide');
        if (placeIdResponse.json.candidates.length === 0) throw new BadRequest('Ville invalide');

        let placeId = placeIdResponse.json.candidates[0].place_id;

        let placeResponse = await googleMapsClient.place({
          placeid: placeId
        }).asPromise();

        if (placeResponse.status !== 200) throw new BadRequest('Ville invalide');
        if (placeResponse.json.status !== 'OK') throw new BadRequest('Ville invalide');

        let place = placeResponse.json.result;

        location = place.geometry.location;
      }



      async function getResults(pageToken) {
        let resultsResponse;
        let goodResults = [];


        if (!pageToken) resultsResponse = await googleMapsClient.places({
          query: type,
          location: location,
          radius: radius,
          type: type
        }).asPromise();
        else resultsResponse = await googleMapsClient.places({
          query: '',
          pagetoken: pageToken
        }).asPromise();

        if (resultsResponse.status !== 200) throw new BadRequest('Ville invalide');
        if (resultsResponse.json.status !== 'OK') throw new BadRequest('Ville invalide');

        let results = resultsResponse.json.results;


        for (let result of results) {
          let distance = distanceInMBetweenEarthCoordinates(
            result.geometry.location.lat,
            result.geometry.location.lng,
            location.lat,
            location.lng
          );
          result.distance = distance;


          result.isOpened = (result.opening_hours ? result.opening_hours.open_now : null);
          if (result.distance < radius) {
            goodResults.push(result);
          }
        }


        if (goodResults.length == 20 && resultsResponse.json.next_page_token) {

          var p = new Promise(async (res, rej) => {
            setTimeout(async () => {
              res(goodResults.concat(await getResults(resultsResponse.json.next_page_token)))
            }, 2000);
          });



          return await p;
        } else {
          return goodResults;
        }
      }




      let res = {
        origin: location,
        results: await getResults()
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
    throw new MethodNotAllowed('Get method is not allowed in the google\'s service');
  }

  async create(data, params) {
    throw new MethodNotAllowed('Create method is not allowed in the google\'s service');
  }

  async update(id, data, params) {
    throw new MethodNotAllowed('Update method is not allowed in the google\'s service');
  }

  async patch(id, data, params) {
    throw new MethodNotAllowed('Patch method is not allowed in the google\'s service');
  }

  async remove(id, params) {
    throw new MethodNotAllowed('Remove method is not allowed in the google\'s service');
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
