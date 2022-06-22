const app = require('../../src/app');

describe('\'tenants\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenants');
    expect(service).toBeTruthy();
  });
});
