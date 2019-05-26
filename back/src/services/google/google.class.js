const { MethodNotAllowed, BadRequest } = require('@feathersjs/errors');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDRSLqNh7shuCn-bFK930HdFGTAMjI3Q7E',
  Promise: Promise
});

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

      let townName = 'savenay';
      let type = 'bar';
      let radius = 1000;


      //if (!townName) throw new BadRequest("Invalid town");

      let placeIdResponse = await googleMapsClient.findPlace({
        input: townName,
        inputtype: 'textquery'
      }).asPromise();

      if (placeIdResponse.status !== 200) throw new BadRequest('Invalid town');
      if (placeIdResponse.json.status !== 'OK') throw new BadRequest('Invalid town');
      if (placeIdResponse.json.candidates.length === 0) throw new BadRequest('Invalid town');

      let placeId = placeIdResponse.json.candidates[0].place_id;

      let placeResponse = await googleMapsClient.place({
        placeid: placeId
      }).asPromise();

      if (placeResponse.status !== 200) throw new BadRequest('Invalid town');
      if (placeResponse.json.status !== 'OK') throw new BadRequest('Invalid town');

      let place = placeResponse.json.result;

      let resultsResponse = await googleMapsClient.places({
        query: type,
        location: place.geometry.location,
        radius: radius,
        type: type
      }).asPromise();

      if (resultsResponse.status !== 200) throw new BadRequest('Invalid town');
      if (resultsResponse.json.status !== 'OK') throw new BadRequest('Invalid town');

      let results = resultsResponse.json.results;

      let goodResults = [];

      for (let result of results) {
        let distance = distanceInMBetweenEarthCoordinates(
          result.geometry.location.lat,
          result.geometry.location.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );
        result.distance = distance;
        result.isOpened = result.opening_hours.open_now;
        if (result.distance < radius) {
          goodResults.push(result);
        }
      }




      console.log(goodResults);
    } catch (error) {
      console.log(error);
    }




    return true;
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
