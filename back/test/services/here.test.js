const assert = require('assert');
const app = require('../../back/src/app');

describe('\'here\' service', () => {
  it('registered the service', () => {
    const service = app.service('here');

    assert.ok(service, 'Registered the service');
  });
});
