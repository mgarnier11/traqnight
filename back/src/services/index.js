const users = require('./users/users.service.js');
const google = require('./google/google.service.js');
const types = require('./types/types.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(google);
  app.configure(types);
};
