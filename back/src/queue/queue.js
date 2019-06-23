const apiUtils = require('../services/apiUtils');
const ObjectID = require('mongodb').ObjectID;

class Queue {
  constructor() {
    this.requestsQueryProcessing = [];
  }

  async processRequestsQuery(params) {
    const app = params.app;
    const requestsQuery = params.requestsQuery;
    const apiParams = params.apiParams;

    const findQ = q =>
      q.town === requestsQuery.town &&
      q.radius === requestsQuery.radius &&
      q.typeId.toString() === requestsQuery.typeId.toString();

    if (this.requestsQueryProcessing.find(findQ) !== undefined) {
      console.log('request already processing');
      return null;
    }
    this.requestsQueryProcessing.push(requestsQuery);

    let herePlaces = await apiUtils.getHereResults(
      apiParams.location,
      apiParams.radius,
      apiParams.keyword
    );

    console.log('processing ' + herePlaces.length + ' places');
    let n = 0;

    let places = [];

    let request = {
      town: requestsQuery.town,
      radius: requestsQuery.radius,
      typeId: requestsQuery.typeId
    };

    let requestsQuerys = [];

    for (let herePlace of herePlaces) {
      herePlace.keyword = apiParams.keyword;
      herePlace.type = { _id: requestsQuery.typeId };

      let place = await app.service('places').create(herePlace);

      if (
        place.state !== 'permanently_closed' &&
        !places.find(p => p._id.toString() === place._id.toString())
      ) {
        places.push(place);
        if (places.length % 25 === 0) {
          request.placesIds = places.map(place => place._id);

          if (!request._id) {
            request = await app.service('requests').create(request);
          } else {
            request = await app
              .service('requests')
              .update(request._id, request);
          }

          let requestsQuery = {
            _id:
              requestsQuerys[requestsQuerys.length - 1] !== undefined
                ? requestsQuerys[requestsQuerys.length - 1].nextPlacesToken
                : new ObjectID(),
            requestId: request._id,
            startPosition: places.length,
            endPosition: places.length + 25,
            nextPlacesToken: new ObjectID()
          };

          requestsQuerys.push(
            await app.service('next-places-tokens').create(requestsQuery)
          );

          if (requestsQuerys.length === 1) {
            request.nextPlacesToken = requestsQuery._id;
            request = await app
              .service('requests')
              .update(request._id, request);
          }
        }
      }
      console.log('place ' + n++ + '/' + herePlaces.length + ' done');
    }

    if (!request._id) {
      request.placesIds = places.map(place => place._id);

      request = await app.service('requests').create(request);
    }

    if (requestsQuerys.length > 0) {
      let requestsQuery = requestsQuerys[requestsQuerys.length - 1];

      requestsQuery.endPosition = undefined;
      requestsQuery.nextPlacesToken = undefined;

      await app
        .service('next-places-tokens')
        .update(requestsQuery._id, requestsQuery);
    }
    /*
    if (request.placesIds.length > 25) {
      let requestsQuerys = [];

      for (let i = 25; i < request.placesIds.length; i += 25) {
        try {
          let requestsQuery = {
            _id:
              requestsQuerys[requestsQuerys.length - 1] !== undefined
                ? requestsQuerys[requestsQuerys.length - 1].nextPlacesToken
                : new ObjectID(),
            requestId: request._id,
            startPosition: i,
            endPosition: i + 25,
            nextPlacesToken:
              i + 25 < request.placesIds.length ? new ObjectID() : undefined
          };

          requestsQuerys.push(
            await app.service('next-places-tokens').create(requestsQuery)
          );
        } catch (error) {
          console.log(error);
        }
      }

      request.nextPlacesToken = requestsQuerys[0]._id;

      request = await app.service('requests').update(request._id, request);
    }
    */
    let i = this.requestsQueryProcessing.findIndex(findQ);

    if (i > -1) this.requestsQueryProcessing.splice(i, 1);
  }
}

const queue = new Queue();

module.exports = queue;
