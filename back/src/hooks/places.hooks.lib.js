const Place = require('../../../classes/place-class');
const apiUtils = require('../services/apiUtils');
const utils = require('../services/utils');

function beforeCreateHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};
    let googleDatas = {};

    //search an already saved place with hereId
    let oldPlaces = await context.app
      .service('places')
      .find({ query: { hereId: input.placeId } });

    if (oldPlaces.length === 0) {
      //if no results search an already saved place with an address
      oldPlaces = await context.app.service('places').find({
        query: {
          address: input.location ? input.location.address.text : undefined
        }
      });
    }

    if (oldPlaces.length === 0) {
      //if no results get google datas for this address
      googleDatas = await apiUtils.getPlaceFromGoogle(
        `${input.keyword} ${input.name} ${
          input.location
            ? `${input.location.address.city} ${input.location.address.country}`
            : ''
        }`
      );

      if (googleDatas && googleDatas.place_id) {
        //if google responded anything search an already saved place with google placeId
        oldPlaces = await context.app
          .service('places')
          .find({ query: { placeId: googleDatas.place_id } });
      }
    }

    if (oldPlaces.length === 0) {
      //if no results check google datas
      if (googleDatas && !googleDatas.permanently_closed) {
        //if we have google datas create a new place to be savd in db
        newDatas.hereId = input.placeId;
        newDatas.placeId = googleDatas.place_id;

        newDatas.rating = googleDatas.rating;
        newDatas.priceLevel = googleDatas.price_level;
        newDatas.name =
          utils.similarity(
            googleDatas.name,
            input.location.address.house + ' ' + input.location.address.street
          ) < 0.75
            ? googleDatas.name
            : input.name;
        newDatas.address = input.location.address.text;
        newDatas.location = {
          lat: input.location.position[0],
          lng: input.location.position[1]
        };

        newDatas.updateDate = new Date();
        newDatas.creationDate = new Date();
        newDatas.typeIds = [input.type._id];

        //context.data are the datas taht wil be saved in db
        context.data = newDatas;
      } else {
        //if context.result is defined nothing will be saved in db
        context.result = { state: 'permanently_closed' };
      }
    } else {
      //if an already saved place has been foud try to update it
      await updateOldPlace(oldPlaces[0]);
    }

    async function updateOldPlace(oldPlace) {
      //get last year date
      let d = new Date();
      let d2 = new Date(d.getFullYear() - 1, d.getMonth(), d.getDay());

      let t = oldPlace.typeIds.find(
        tId => tId.toString() === input.type._id.toString()
      );

      if (t === undefined) {
        //if the type is not found add it to the place
        oldPlace.typeIds.push(input.type._id);

        //independently update the place
        oldPlace = await context.app
          .service('places')
          .patch(oldPlace._id, { typeIds: oldPlace.typeIds });
      }

      if (oldPlace.updateDate < d2) {
        //if the last update date of the oldplace is further than 1 year from now
        if (!googleDatas)
          //if the googl datas are not already defined get them
          googleDatas = await apiUtils.getPlaceFromGoogle(
            input.keyword + ' ' + input.vicinity
          );

        newDatas.placeId = googleDatas.place_id;
        newDatas.rating = googleDatas.rating;
        newDatas.priceLevel = googleDatas.price_level;
        newDatas.name = googleDatas.name || input.title;

        newDatas.hereId = input.id;
        newDatas.address = input.vicinity;
        newDatas.location = { lat: input.position[0], lng: input.position[1] };

        newDatas.updateDate = new Date();

        if (!googleDatas.permanently_closed) {
          //if the place is not permanently closed update it
          context.result = await context.app
            .service('places')
            .update(oldPlace._id, newDatas);
        } else {
          //else delete the place from the db
          context.result = await context.app
            .service('places')
            .remove(oldPlace._id);
        }
      }

      context.result = oldPlace;
    }
    return context;
  };
}

function afterAllHook(options = {}) {
  return async context => {
    let places = context.method === 'find' ? context.result : [context.result];

    for (let place of places) {
      if (place.state !== 'permanently_closed') {
        //place.state will not be defined if the db beforecreate hook went fine

        place.types = [];
        for (let typeId of place.typeIds) {
          place.types.push(await context.app.service('types').get(typeId));
        }
      }
    }
    /*
    if (context.method === 'find') {
      let newResults = [];

      for (let place of context.result) {
        if (place.state !== 'permanently_closed')
          newResults.push(new Place(place));
      }

      context.result = newResults;
    } else {
      if (context.result.state !== 'permanently_closed')
        context.result = new Place(context.result);
    }
*/
    return context;
  };
}

module.exports = {
  beforeCreateHook: beforeCreateHook,
  afterAllHook: afterAllHook
};
