const app = require('../../src/app');

describe('\'tenantUsers\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-users');
    expect(service).toBeTruthy();
  });
});
