const app = require('../../src/app');

describe('\'tenantRegistration\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-registration');
    expect(service).toBeTruthy();
  });
});
