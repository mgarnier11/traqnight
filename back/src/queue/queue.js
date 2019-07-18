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
    //check if the request is already in processing
    if (this.requestsQueryProcessing.find(findQ) !== undefined) {
      console.log('request already processing');
      return null;
    }
    this.requestsQueryProcessing.push(requestsQuery);
    //get all herePlaces
    let herePlaces = await apiUtils.getHereResults(
      apiParams.location,
      apiParams.radius,
      apiParams.type
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
      //try to create the new place
      let place = await app.service('places').create(herePlace);

      if (
        place.state !== 'permanently_closed' &&
        !places.find(p => p._id.toString() === place._id.toString())
      ) {
        places.push(place);
        if (places.length % 25 === 0) {
          //every 25 places we update the request in db to add all placesids we have
          request.placesIds = places.map(place => place._id);

          if (!request._id) {
            request = await app.service('requests').create(request);
          } else {
            request = await app
              .service('requests')
              .update(request._id, request);
          }
          //and we create a requestquery objetc that will contain a nextplacetoken
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
          //create it
          requestsQuerys.push(
            await app.service('next-places-tokens').create(requestsQuery)
          );

          if (requestsQuerys.length === 1) {
            //update the request with the first nextplacestoken
            request.nextPlacesToken = requestsQuery._id;
            request = await app
              .service('requests')
              .update(request._id, request);
          }
        }
      }
      console.log('place ' + n++ + '/' + herePlaces.length + ' done');
    }
    //if there is less than 25 places just create a request with no nextplacestoken
    if (!request._id) {
      request.placesIds = places.map(place => place._id);

      request = await app.service('requests').create(request);
    }

    //update the last requestquery to disable it nextplacestoken
    if (requestsQuerys.length > 0) {
      let requestsQuery = requestsQuerys[requestsQuerys.length - 1];

      requestsQuery.endPosition = undefined;
      requestsQuery.nextPlacesToken = undefined;

      await app
        .service('next-places-tokens')
        .update(requestsQuery._id, requestsQuery);
    }
    let i = this.requestsQueryProcessing.findIndex(findQ);
    //remove the request from processing so we can it again if we want !
    if (i > -1) this.requestsQueryProcessing.splice(i, 1);
  }
}

const queue = new Queue();

module.exports = queue;
