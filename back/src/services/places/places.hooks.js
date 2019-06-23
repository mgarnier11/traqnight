const placeHooksLib = require('../../hooks/places.hooks.lib');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [placeHooksLib.beforeCreateHook()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [placeHooksLib.afterAllHook()],
    find: [],
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
