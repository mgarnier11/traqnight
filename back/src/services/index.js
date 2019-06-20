const users = require('./users/users.service.js');
const types = require('./types/types.service.js');
const places = require('./places/places.service.js');
const requests = require('./requests/requests.service.js');
const externalApi = require('./external-api/external-api.service.js');
const nextPlacesTokens = require('./next-places-tokens/next-places-tokens.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(types);
  app.configure(places);
  app.configure(requests);
  app.configure(externalApi);
  app.configure(nextPlacesTokens);
};