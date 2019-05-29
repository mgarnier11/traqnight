// Initializes the `here` service on path `/here`
const createService = require('./here.class.js');
const hooks = require('./here.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/here', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('here');

  service.hooks(hooks);
};
