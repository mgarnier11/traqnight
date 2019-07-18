const { BadRequest } = require('@feathersjs/errors');
const validator = require('validator');
const googlePlacesTypes = require('../../../front/src/json/googleplaces.json');
const fontAwesomeIcons = require('../../../front/src/json/fontawesome.json');
const hereCategories = require('../../../front/src/json/hereCategories.json');
const Type = require('../../../classes/type-class');

const typeErrors = {
  validName: 'Please enter a valid name',
  validPlaceType: 'Please enter a valid Google API type',
  validHereCategorie: 'Please enter a valid Here categorie',
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

    if (validator.isEmpty(input.googleType))
      throw new BadRequest(typeErrors.validPlaceType);
    if (!googlePlacesTypes.includes(input.googleType))
      throw new BadRequest(typeErrors.validPlaceType);
    newDatas.googleType = input.googleType;

    if (validator.isEmpty(input.hereCategorie))
      throw new BadRequest(typeErrors.validHereCategorie);
    if (hereCategories.find(c => c.id === input.hereCategorie) === undefined)
      throw new BadRequest(typeErrors.validHereCategorie);
    newDatas.hereCategorie = input.hereCategorie;

    if (validator.isEmpty(input.fontAwesomeIcon))
      throw new BadRequest(typeErrors.validIcon);
    if (!fontAwesomeIcons.includes(input.fontAwesomeIcon))
      throw new BadRequest(typeErrors.validIcon);
    newDatas.fontAwesomeIcon = input.fontAwesomeIcon;

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

    if (input.googleType !== undefined) {
      if (validator.isEmpty(input.googleType))
        throw new BadRequest(typeErrors.validPlaceType);
      if (!googlePlacesTypes.includes(input.googleType))
        throw new BadRequest(typeErrors.validPlaceType);
      newDatas.googleType = input.googleType;
    }

    if (input.hereCategorie !== undefined) {
      if (validator.isEmpty(input.hereCategorie))
        throw new BadRequest(typeErrors.validHereCategorie);
      if (hereCategories.find(c => c.id === input.hereCategorie) === undefined)
        throw new BadRequest(typeErrors.validHereCategorie);
      newDatas.hereCategorie = input.hereCategorie;
    }

    if (input.fontAwesomeIcon !== undefined) {
      if (validator.isEmpty(input.fontAwesomeIcon))
        throw new BadRequest(typeErrors.validIcon);
      if (!fontAwesomeIcons.includes(input.fontAwesomeIcon))
        throw new BadRequest(typeErrors.validIcon);
      newDatas.fontAwesomeIcon = input.fontAwesomeIcon;
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
