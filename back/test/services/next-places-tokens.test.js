const assert = require('assert');
const app = require('../../back/src/app');

describe('\'nextPlacesTokens\' service', () => {
  it('registered the service', () => {
    const service = app.service('next-places-tokens');

    assert.ok(service, 'Registered the service');
  });
});
