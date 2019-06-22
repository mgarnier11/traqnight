const { BadRequest } = require('@feathersjs/errors');
const skip = require('@feathersjs/feathers').SKIP;
const validator = require('validator');
const Place = require('../../../classes/place-class');
const apiUtils = require('../services/apiUtils');

const placeErrors = {
  validType: 'Invalid type',
  validAddress: 'Invalid address',
  validName: 'Invalid name',
  validUrl: 'Invalid url'
};

function beforeCreateHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};
    let googleDatas = {};

    let oldPlaces = await context.app
      .service('places')
      .find({ query: { hereId: input.id } });

    if (oldPlaces.length === 0) {
      oldPlaces = await context.app
        .service('places')
        .find({ query: { address: input.vicinity } });
    }

    if (oldPlaces.length === 0) {
      googleDatas = await apiUtils.getPlaceFromGoogle(
        input.keyword + ' ' + input.vicinity
      );

      oldPlaces = await context.app
        .service('places')
        .find({ query: { placeId: googleDatas.place_id } });
    }

    if (oldPlaces.length === 0) {
      //create new
      newDatas.creationDate = new Date();
      setDatas();

      context.data = newDatas;
    } else {
      await updateOldPlace(oldPlaces[0]);
    }

    async function updateOldPlace(oldPlace) {
      let d = new Date();
      let d2 = new Date(d.getFullYear() - 1, d.getMonth(), d.getDay());
      if (oldPlace.updateDate < d2) {
        if (!googleDatas)
          googleDatas = await apiUtils.getPlaceFromGoogle(
            input.keyword + ' ' + input.vicinity
          );
        setDatas();

        //update old place with newdatas the skip

        context.result = await context.app
          .service('places')
          .update(oldPlace._id, newDatas);
      }

      context.result = oldPlace;
    }

    function setDatas() {
      newDatas.placeId = googleDatas.place_id;
      newDatas.rating = googleDatas.rating;
      newDatas.priceLevel = googleDatas.price_level;
      newDatas.name = googleDatas.name || input.title;

      newDatas.hereId = input.id;
      newDatas.address = input.vicinity;
      newDatas.location = { lat: input.position[0], lng: input.position[1] };

      newDatas.updateDate = new Date();

      newDatas.typeId = input.type._id;
    }
    return context;
  };
}

function afterAllHook(options = {}) {
  return async context => {
    let places = context.method === 'find' ? context.result : [context.result];

    for (let place of places) {
      place.type = await context.app.service('types').get(place.typeId);
    }
    /*

    if (context.method === 'find') {
      let newResults = [];

      for (let place of context.result) {
        newResults.push(new Place(place));
      }

      context.result = newResults;
    } else {
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
