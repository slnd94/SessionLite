const app = require('../../src/app');

describe('\'tenantStaff\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-staff');
    expect(service).toBeTruthy();
  });
});
