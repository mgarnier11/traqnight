// Initializes the `externalApi` service on path `/external-api`
const createService = require('./external-api.class.js');
const hooks = require('./external-api.hooks');

module.exports = function(app) {
  const options = {
    app
  };

  // Initialize our service with any options it requires
  app.use('/external-api', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('external-api');

  service.hooks(hooks);
};
