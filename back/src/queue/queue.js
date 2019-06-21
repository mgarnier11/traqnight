const apiUtils = require('../services/apiUtils');

class Queue {
  constructor() {
    this.requestsQueryProcessing = [];
  }

  async processRequestsQuery(params) {
    const app = params.app;
    const requestsQuery = params.requestsQuery;
    const apiParams = params.apiParams;

    if (this.requestsQueryProcessing.includes(requestsQuery))
      throw new Error('Request query is already in processing');

    this.requestsQueryProcessing.push(requestsQuery);

    let herePlaces = await apiUtils.getHereResults(
      apiParams.location,
      apiParams.radius,
      apiParams.keyword
    );

    let places = [];

    for (let herePlace of herePlaces) {
      let googlePlace = await apiUtils.getPlaceFromGoogle(
        herePlace.title,
        herePlace.vicinity
      );

      if (googlePlace && !googlePlace.permanently_closed) {
        /*
        newResult.rating = googlePlace.rating;
        newResult.priceLevel = googlePlace.price_level;
        newResult.location = {
          lat: herePlace.position[0],
          lng: herePlace.position[1]
        };
        newResult.name = herePlace.title;
        newResult.url = herePlace.href;
        newResult.address = herePlace.vicinity;
        newResult.type = query.type;
        newResult.id = herePlace.id;
        newResult = await placeSrv.create(newResult);

        newResults.push(newResult);*/

        places.push(await app.services('places').create());
      }
    }

    let request = new Request();

    request.town = requestsQuery.town;
    request.radius = requestsQuery.radius;
    request.typeId = requestsQuery.typeId;

    request.placesIds = places.map(place => place._id);

    app.services('requests').create(request);
  }
}

const queue = new Queue();

module.exports = queue;
