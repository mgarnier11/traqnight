const { BadRequest } = require('@feathersjs/errors');
const validator = require('validator');
const googlePlacesTypes = require('../../../front/src/json/googleplaces.json');
const fontAwesomeIcons = require('../../../front/src/json/fontawesome.json');
const Type = require('../../../classes/type-class');

const typeErrors = {
  validName: 'Please enter a valid name',
  validPlaceType: 'Please enter a valid Google API type',
  validIcon: 'Please enter a valid icon'
};

function beforeCreateOrUpdateHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};

    //check and validtae all datas befoe we create or update the type

    if (validator.isEmpty(input.name))
      throw new BadRequest(typeErrors.validName);
    newDatas.name = input.name;

    if (validator.isEmpty(input.type))
      throw new BadRequest(typeErrors.validPlaceType);
    if (!googlePlacesTypes.includes(input.type))
      throw new BadRequest(typeErrors.validPlaceType);
    newDatas.type = input.type;

    if (validator.isEmpty(input.icon))
      throw new BadRequest(typeErrors.validIcon);
    if (!fontAwesomeIcons.includes(input.icon))
      throw new BadRequest(typeErrors.validIcon);
    newDatas.icon = input.icon;

    if (context.method === 'create') {
      newDatas.creationUserId = context.params.user._id;
      newDatas.creationDate = Date.now();
    }
    newDatas.updateUserId = context.params.user._id;
    newDatas.updateDate = Date.now();

    context.data = newDatas;

    return context;
  };
}

function beforePatchHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};
    //check and validtae all datas befoe we patch the type

    if (input.name !== undefined) {
      if (validator.isEmpty(input.name))
        throw new BadRequest(typeErrors.validName);
      newDatas.name = input.name;
    }

    if (input.type !== undefined) {
      if (validator.isEmpty(input.type))
        throw new BadRequest(typeErrors.validPlaceType);
      if (!googlePlacesTypes.includes(input.type))
        throw new BadRequest(typeErrors.validPlaceType);
      newDatas.type = input.type;
    }

    if (input.icon !== undefined) {
      if (validator.isEmpty(input.icon))
        throw new BadRequest(typeErrors.validIcon);
      if (!fontAwesomeIcons.includes(input.icon))
        throw new BadRequest(typeErrors.validIcon);
      newDatas.icon = input.icon;
    }

    newDatas.updateUserId = context.params.user._id;
    newDatas.updateDate = Date.now();

    context.data = newDatas;

    return context;
  };
}

function afterAllHook(options = {}) {
  return async context => {
    let types = context.method === 'find' ? context.result : [context.result];

    for (let type of types) {
      type.creationUser = await context.app
        .service('users')
        .get(type.creationUserId);
      type.updateUser = await context.app
        .service('users')
        .get(type.updateUserId);
    }

    if (context.method === 'find') {
      let newResults = [];

      for (let type of context.result) {
        newResults.push(new Type(type));
      }

      context.result = newResults;
    } else {
      context.result = new Type(context.result);
    }

    return context;
  };
}

module.exports = {
  beforeCreateOrUpdateHook: beforeCreateOrUpdateHook,
  beforePatchHook: beforePatchHook,
  afterAllHook: afterAllHook
};
