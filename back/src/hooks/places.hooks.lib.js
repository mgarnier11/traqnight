const { BadRequest } = require('@feathersjs/errors');
const skip = require('@feathersjs/feathers').SKIP;
const validator = require('validator');

const placeErrors = {
  validType: 'Invalid type',
  validAddress: 'Invalid address',
  validName: 'Invalid name',
  validUrl: 'Invalid url'
};

function beforeCreateOrUpdateHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};

    newDatas.rating = input.rating;
    newDatas.priceLevel = input.priceLevel;
    newDatas.location = input.location;

    if (validator.isEmpty(input.name))
      throw new BadRequest(placeErrors.validName);
    newDatas.name = input.name;

    if (validator.isEmpty(input.url))
      throw new BadRequest(placeErrors.validUrl);
    newDatas.url = input.url;

    if (validator.isEmpty(input.address))
      throw new BadRequest(placeErrors.validAddress);
    newDatas.address = input.address;

    if (typeof input.type !== 'object')
      throw new BadRequest(placeErrors.validType);
    newDatas.typeId = input.type._id;

    newDatas.id = input.id;
    if (context.method === 'create') {
      newDatas.creationDate = Date.now();
    }
    newDatas.updateDate = Date.now();

    let oldDatas = await context.app
      .service('places')
      .find({ query: { id: newDatas.id } });

    if (oldDatas.length > 0) {
      let oldPlace = oldDatas[0];

      let d = new Date();
      let d2 = new Date(d.getFullYear() - 1, d.getMonth(), d.getDay());

      if (oldPlace.updateDate < d2) {
        newDatas.creationDate = oldDatas.creationDate;
      } else {
        throw new BadRequest('Place already up to date');
      }
    }

    context.data = newDatas;

    return context;
  };
}

function afterAllHook(options = {}) {
  return async context => {
    let places = context.method === 'find' ? context.result : [context.result];

    for (let place of places) {
      place.type = await context.app.service('types').get(place.typeId);
    }

    return context;
  };
}

module.exports = {
  beforeCreateOrUpdateHook: beforeCreateOrUpdateHook,
  afterAllHook: afterAllHook
};
