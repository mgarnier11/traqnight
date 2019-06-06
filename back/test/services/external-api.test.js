const assert = require('assert');
const app = require('../../back/src/app');

describe('\'externalApi\' service', () => {
  it('registered the service', () => {
    const service = app.service('external-api');

    assert.ok(service, 'Registered the service');
  });
});
