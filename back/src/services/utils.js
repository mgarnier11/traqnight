const {
  MethodNotAllowed,
  BadRequest,
  GeneralError
} = require('@feathersjs/errors');
const axios = require('axios').default;

const hereURL = 'https://places.api.here.com';
const placeEndpoint = '/places/v1';
const searchEndpoint = '/discover/search';

const appId = process.env.HERE_APP_ID;
const appCode = process.env.HERE_APP_CODE;

const earthRadiusKm = 6371;

async function hereSearchRequest(params) {
  let url = hereURL + placeEndpoint + searchEndpoint;

  let paramStr = '?';

  for (let param in params) {
    paramStr += '&' + param + '=' + params[param];
  }

  let requestUrl = url + paramStr + '&app_id=' + appId + '&app_code=' + appCode;

  try {
    let res = await axios.get(requestUrl, {
      headers: {
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6'
      }
    });

    return res.data.results;
  } catch (error) {
    console.log(error.message);

    if (error.response && error.response.data) {
      console.log(error.response.data.message);
    }

    return error;
  }
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

function distanceInMBetweenEarthCoordinates(point1, point2) {
  checkPoint(point1);
  checkPoint(point2);

  let lat1 = point1.lat;
  let lat2 = point2.lat;
  let lon1 = point1.lng;
  let lon2 = point2.lng;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
}

function calcPoint(origin, distance, bearing) {
  checkPoint(origin);

  bearing = degreesToRadians(bearing);
  distance = distance / 1000;

  let lat1 = degreesToRadians(origin.lat);
  let lon1 = degreesToRadians(origin.lng);

  let lat2 =
    Math.asin(Math.sin(lat1) * Math.cos(distance / earthRadiusKm)) +
    Math.cos(lat1) * Math.sin(distance / earthRadiusKm) * Math.cos(bearing);

  let lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance / earthRadiusKm) * Math.cos(lat1),
      Math.cos(distance / earthRadiusKm) - Math.sin(lat1) * Math.sin(lat2)
    );

  return { lat: radiansToDegrees(lat2), lng: radiansToDegrees(lon2) };
}

function middlePoint(point1, point2) {
  checkPoint(point1);
  checkPoint(point2);

  //-- Longitude difference
  var dLng = degreesToRadians(point2.lng - point1.lng);

  //-- Convert to radians
  let lat1 = degreesToRadians(point1.lat);
  let lat2 = degreesToRadians(point2.lat);
  let lng1 = degreesToRadians(point1.lng);

  var bX = Math.cos(lat2) * Math.cos(dLng);
  var bY = Math.cos(lat2) * Math.sin(dLng);
  var lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
  );
  var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  //-- Return result
  return { lat: radiansToDegrees(lat3), lng: radiansToDegrees(lng3) };
}

function checkPoint(p) {
  if (!p) throw new BadRequest('Point is not defined');
  else {
    if (!p.lat || typeof p.lat != 'number')
      throw new BadRequest('Point latitude is wrong');
    if (!p.lng || typeof p.lng != 'number')
      throw new BadRequest('Point longitude is wrong');
  }
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = [];
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

module.exports = {
  calcPoint: calcPoint,
  similarity: similarity,
  distanceInMBetweenEarthCoordinates: distanceInMBetweenEarthCoordinates,
  degreesToRadians: degreesToRadians,
  radiansToDegrees: radiansToDegrees,
  hereSearchRequest: hereSearchRequest,
  middlePoint: middlePoint
};
