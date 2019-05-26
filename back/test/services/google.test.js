const assert = require('assert');
const app = require('../../back/src/app');

describe('\'google\' service', () => {
  it('registered the service', () => {
    const service = app.service('google');

    assert.ok(service, 'Registered the service');
  });
});
