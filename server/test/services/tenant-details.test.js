const app = require('../../src/app');

describe('\'tenantDetails\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-details');
    expect(service).toBeTruthy();
  });
});
