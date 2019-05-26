// Initializes the `google` service on path `/google`
const createService = require('./google.class.js');
const hooks = require('./google.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/google', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('google');

  service.hooks(hooks);
};
