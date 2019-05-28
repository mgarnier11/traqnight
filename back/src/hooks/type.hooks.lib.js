const { BadRequest } = require('@feathersjs/errors');
const validator = require('validator');

const typeErrors = {
  validName: 'Please enter a valid name'
};

function beforeCreateOrUpdateHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};

    if (validator.isEmpty(input.name)) throw new BadRequest(typeErrors.validName);
    newDatas.name = input.name;

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

    if (input.name !== undefined) {
      if (validator.isEmpty(input.name)) throw new BadRequest(typeErrors.validName);
      newDatas.name = input.name;
    }

    newDatas.updateUserId = context.params.user._id;
    newDatas.updateDate = Date.now();

    context.data = newDatas;

    return context;
  };
}

function afterAllHook(options = {}) {
  return async context => {
    let types = (context.method === 'find' ? context.result : [context.result]);


    for (let type of types) {
      type.creationUser = await context.app.service('users').get(type.creationUserId);
      type.updateUser = await context.app.service('users').get(type.updateUserId);
    }

    return context;
  };
}

module.exports = {
  beforeCreateOrUpdateHook: beforeCreateOrUpdateHook,
  beforePatchHook: beforePatchHook,
  afterAllHook: afterAllHook
};