const { authenticate } = require('@feathersjs/authentication').hooks;
const typeHooksLib = require('../../hooks/type.hooks.lib');
const hookUtils = require('../../hooks/utils.hooks.lib.js');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), hookUtils.checkAdmin(), typeHooksLib.beforeCreateOrUpdateHook()],
    update: [authenticate('jwt'), hookUtils.checkAdmin(), typeHooksLib.beforeCreateOrUpdateHook()],
    patch: [authenticate('jwt'), hookUtils.checkAdmin(), typeHooksLib.beforePatchHook()],
    remove: [authenticate('jwt'), hookUtils.checkAdmin()]
  },

  after: {
    all: [],
    find: [typeHooksLib.afterAllHook()],
    get: [typeHooksLib.afterAllHook()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
