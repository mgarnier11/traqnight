const { BadRequest } = require('@feathersjs/errors');
const validator = require('validator');
const User = require('../../../classes/user-class');

const userErrors = {
  validEmail: 'Please enter a valid email',
  inUseEmail: 'This email is already in use',
  validPassword: 'Please enter a valid password',
  confirmPassword: 'Passwords does not match',
  validName: 'Please enter a valid name',
  inUseName: 'This name is already in use'
};

function beforeCreateOrUpdateHook(options = {}) {
  return async context => {
    let input = context.data;

    let newDatas = {};

    if (validator.isEmpty(input.email))
      throw new BadRequest(userErrors.validEmail);
    if (!validator.isEmail(input.email))
      throw new BadRequest(userErrors.validEmail);
    let userDatas = await context.service.find({
      query: { email: input.email }
    });
    if (userDatas.data.length)
      if (userDatas.data[0]._id.toString() !== context.id)
        throw new BadRequest(userErrors.inUseEmail);
    newDatas.email = input.email;

    if (validator.isEmpty(input.name)) throw new BadRequest(userErrors.name);
    userDatas = await context.service.find({ query: { name: input.name } });
    if (userDatas.data.length)
      if (userDatas.data[0]._id.toString() !== context.id)
        throw new BadRequest(userErrors.inUseName);
    newDatas.name = input.name;

    if (validator.isEmpty(input.password))
      throw new BadRequest(userErrors.validPassword);
    if (input.password !== input.confirmPassword)
      throw new BadRequest(userErrors.confirmPassword);
    newDatas.password = input.password;

    newDatas.admin = input.admin ? true : false;

    context.data = newDatas;

    return context;
  };
}

function beforePatchHook(options = {}) {
  return async context => {
    let input = context.data;
    let newDatas = {};

    if (input.email !== undefined) {
      if (validator.isEmpty(input.email))
        throw new BadRequest(userErrors.validEmail);
      if (!validator.isEmail(input.email))
        throw new BadRequest(userErrors.validEmail);
      let userDatas = await context.service.find({
        query: { email: input.email }
      });
      if (userDatas.data.length)
        if (userDatas.data[0]._id.toString() !== context.id)
          throw new BadRequest(userErrors.inUseEmail);
      newDatas.email = input.email;
    }

    if (input.name !== undefined) {
      if (validator.isEmpty(input.name)) throw new BadRequest(userErrors.name);
      let userDatas = await context.service.find({
        query: { name: input.name }
      });
      if (userDatas.data.length)
        if (userDatas.data[0]._id.toString() !== context.id)
          throw new BadRequest(userErrors.inUseName);
      newDatas.name = input.name;
    }

    if (input.password !== undefined && input.confirmPassword !== undefined) {
      if (validator.isEmpty(input.password))
        throw new BadRequest(userErrors.validPassword);
      if (input.password !== input.confirmPassword)
        throw new BadRequest(userErrors.confirmPassword);
      newDatas.password = input.password;
    }

    if (input.admin !== undefined) {
      newDatas.admin = input.admin;
    }

    context.data = newDatas;

    return context;
  };
}

function afterAllHook(options = {}) {
  return async context => {
    /*
    if (context.method === 'find') {
      let newResults = [];

      for (let user of context.result) {
        newResults.push(new User(user));
      }

      context.result = newResults;
    } else {
      context.result = new User(context.result);
    }
    */
    return context;
  };
}

module.exports = {
  beforeCreateOrUpdateHook: beforeCreateOrUpdateHook,
  beforePatchHook: beforePatchHook,
  afterAllHook: afterAllHook
};
