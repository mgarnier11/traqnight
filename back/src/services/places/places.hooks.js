const placesHooksLib = require('../../hooks/places.hooks.lib');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [placesHooksLib.beforeCreateOrUpdateHook()],
    update: [placesHooksLib.beforeCreateOrUpdateHook()],
    patch: [],
    remove: []
  },

  after: {
    all: [placesHooksLib.afterAllHook()],
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
