const externalApiHooksLib = require('../../hooks/external-api.hooks.lib');

module.exports = {
  before: {
    all: [],
    find: [externalApiHooksLib.beforeFindHook()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [externalApiHooksLib.afterFindHook()],
    get: [],
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
