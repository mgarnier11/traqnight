const earthRadiusKm = 6371;

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
  radiansToDegrees: radiansToDegrees
};
