// Initializes the `types` service on path `/types`
const createService = require('feathers-mongodb');
const hooks = require('./types.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('types');

  mongoClient.then(db => {
    service.Model = db.collection('types');
  });

  service.hooks(hooks);
};
