// Initializes the `nextPlacesTokens` service on path `/next-places-tokens`
const createService = require('feathers-mongodb');
const hooks = require('./next-places-tokens.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/next-places-tokens', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('next-places-tokens');

  mongoClient.then(db => {
    service.Model = db.collection('next-places-tokens');
  });

  service.hooks(hooks);
};
