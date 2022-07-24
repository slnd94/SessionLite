const app = require('../../src/app');

describe('\'tenantUsage\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-usage');
    expect(service).toBeTruthy();
  });
});
