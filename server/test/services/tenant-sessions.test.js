const app = require('../../src/app');

describe('\'tenantSessions\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-sessions');
    expect(service).toBeTruthy();
  });
});
