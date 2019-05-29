const earthRadiusKm = 6371;
const axios = require('axios').default;

const hereURL = 'https://places.api.here.com';
const placeEndpoint = '/places/v1';
const searchEndpoint = '/discover/search';

const appId = 'oRM589ApFBNyrtBwfkgH';
const appCode = '3nHtQC18lMGYn-6zTZXfXw';

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

function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
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

module.exports = {
  calcPoint: calcPoint,
  distanceInMBetweenEarthCoordinates: distanceInMBetweenEarthCoordinates,
  degreesToRadians: degreesToRadians,
  radiansToDegrees: radiansToDegrees,
  hereSearchRequest: hereSearchRequest
};
