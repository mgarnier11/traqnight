// Initializes the `places` service on path `/places`
const createService = require('feathers-mongodb');
const hooks = require('./places.hooks');

module.exports = function(app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use(
    '/places',
    createService({
      paginate: false
    })
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('places');

  mongoClient.then(db => {
    service.Model = db.collection('places');
  });

  service.hooks(hooks);
};
