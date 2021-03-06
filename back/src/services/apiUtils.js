const { BadRequest } = require('@feathersjs/errors');
const myutils = require('./utils');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  Promise: Promise
});
const axios = require('axios').default;

const googleErrors = {
  invalidTown: 'Ville invalide',
  invalidRequest: 'Requete invalide'
};

async function getGoogleResults(
  location = undefined,
  type = undefined,
  radius = undefined,
  pageToken = undefined
) {
  let resultsResponse;
  let goodResults = [];

  if (!pageToken && location && type && radius)
    resultsResponse = await googleMapsClient
      .placesNearby({
        location: location,
        type: type.type,
        radius: radius,
        rankby: 'prominence'
      })
      .asPromise();
  else if (pageToken)
    resultsResponse = await googleMapsClient
      .placesNearby({
        pagetoken: pageToken
      })
      .asPromise();
  else throw new BadRequest('Bad call to get google Result');

  if (resultsResponse.status !== 200) throw new BadRequest('Ville invalide');
  if (
    resultsResponse.json.status !== 'OK' &&
    resultsResponse.json.status !== 'ZERO_RESULTS'
  )
    throw new BadRequest('Ville invalide');

  let results = resultsResponse.json.results;

  for (let result of results) {
    let distance = myutils.distanceInMBetweenEarthCoordinates(
      result.geometry.location,
      location
    );
    result.distance = distance;

    result.isOpened = result.opening_hours
      ? result.opening_hours.open_now
      : null;
    result.type = type;
    result.location = result.geometry.location;
    if (result.distance < radius) {
      goodResults.push(result);
    }
  }

  if (goodResults.length == 20 && resultsResponse.json.next_page_token) {
    var p = new Promise(async (res, rej) => {
      setTimeout(async () => {
        res(
          goodResults.concat(
            await getGoogleResults(
              location,
              type,
              radius,
              resultsResponse.json.next_page_token
            )
          )
        );
      }, 2000);
    });

    return await p;
  } else {
    return goodResults;
  }
}

async function getPlaceFromGoogle(input) {
  console.log('call to google api');
  let resultsResponse = await googleMapsClient
    .findPlace({
      input: input,
      inputtype: 'textquery',
      fields: [
        'name',
        'place_id',
        'price_level',
        'rating',
        'permanently_closed'
      ]
    })
    .asPromise();

  if (resultsResponse.status !== 200)
    throw new BadRequest(googleErrors.invalidRequest);
  if (
    resultsResponse.json.status !== 'OK' &&
    resultsResponse.json.status !== 'ZERO_RESULTS'
  )
    throw new BadRequest(googleErrors.invalidRequest);

  return resultsResponse.json.candidates[0];
}

async function getFirstResults(origin, radius, type) {
  let inParam = origin.lat + ',' + origin.lng + ';r=' + radius;
  //user here api to get the firsts result around a point
  try {
    let results = await myutils.hereSearchRequest({
      q: type.googleType,
      in: inParam,
      size: 25
    });
    if (results.items.length === 25)
      return await getFirstResults(origin, radius / 4, type);
    return results.items;
  } catch (error) {
    console.log(error);
  }
}

async function getFirstResultsBetter(origin, radius, type) {
  let allResults = await getFirstResults(origin, radius, type);

  let returnValues = await Promise.all(
    allResults.map(r => {
      if (r.href)
        return axios.get(r.href, {
          headers: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6'
          }
        });
      else return null;
    })
  );

  returnValues = returnValues
    .map(result => {
      try {
        let cat = result.data.categories.find(c => c.id === type.hereCategorie);
        if (cat) return result.data;
        else return null;
      } catch (error) {
        return null;
      }
    })
    .filter(r => r !== null);
  /*

  returnValues = [];

  for (let result of allResults) {
    if (result.href) {
      let response = await axios.get(result.href, {
        headers: {
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6'
        }
      });

      try {
        let cat = response.data.categories.find(
          c => c.id === type.hereCategorie
        );
        if (cat) returnValues.push(response.data);
      } catch (error) {}
    }
  }*/

  return returnValues;
}

async function getHereResultsBetter(origin, radius, type) {
  let allResults = await getHereResults(origin, radius, type);

  let returnValues = [];

  for (let result of allResults) {
    if (
      result.href /*&&
      result.category &&
      result.category.id === type.hereCategorie*/
    ) {
      let response = await axios.get(result.href, {
        headers: {
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6'
        }
      });

      try {
        let cat = response.data.categories.find(
          c => c.id === type.hereCategorie
        );
        if (cat) returnValues.push(response.data);
      } catch (error) {}
    }
  }

  return returnValues;
}

async function getHereResults(origin, radius, type) {
  //radius = radius / 2;
  let corners = [];
  corners.push(myutils.calcPoint(origin, radius * Math.sqrt(2), 45));
  corners.push(myutils.calcPoint(origin, radius * Math.sqrt(2), 135));
  corners.push(myutils.calcPoint(origin, radius * Math.sqrt(2), 225));
  corners.push(myutils.calcPoint(origin, radius * Math.sqrt(2), 315));

  let allResults = [];

  for (let corner of corners) {
    let wlng = origin.lng < corner.lng ? origin.lng : corner.lng;
    let slat = origin.lat < corner.lat ? origin.lat : corner.lat;
    let elng = origin.lng > corner.lng ? origin.lng : corner.lng;
    let nlat = origin.lat > corner.lat ? origin.lat : corner.lat;

    let inParam = wlng + ',' + slat + ',' + elng + ',' + nlat;
    try {
      let results = await myutils.hereSearchRequest({
        q: type.googleType,
        in: inParam,
        size: 100
      });

      if (results.items.length === 100) {
        allResults = allResults.concat(
          await getHereResults(
            myutils.middlePoint(origin, corner),
            radius / 2,
            type
          )
        );
      } else {
        allResults = allResults.concat(results.items);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return [...new Set(allResults)];
}

async function getTown(townName) {
  if (!townName) throw new BadRequest(googleErrors.invalidTown);

  let placeIdResponse = await googleMapsClient
    .findPlace({
      input: townName + ', France',
      inputtype: 'textquery'
    })
    .asPromise();

  if (placeIdResponse.status !== 200)
    throw new BadRequest(googleErrors.invalidTown);
  if (placeIdResponse.json.status !== 'OK')
    throw new BadRequest(googleErrors.invalidTown);
  if (placeIdResponse.json.candidates.length === 0)
    throw new BadRequest(googleErrors.invalidTown);

  let placeId = placeIdResponse.json.candidates[0].place_id;

  let placeResponse = await googleMapsClient
    .place({
      placeid: placeId
    })
    .asPromise();

  if (placeResponse.status !== 200)
    throw new BadRequest(googleErrors.invalidTown);
  if (placeResponse.json.status !== 'OK')
    throw new BadRequest(googleErrors.invalidTown);

  let place = placeResponse.json.result;

  return place;
}

module.exports = {
  getTown: getTown,
  getPlaceFromGoogle: getPlaceFromGoogle,
  getFirstResults: getFirstResultsBetter,
  getHereResults: getHereResultsBetter,
  getGoogleResults: getGoogleResults
};
