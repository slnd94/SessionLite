const app = require('../../src/app');

describe('\'tenantTeam\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-team');
    expect(service).toBeTruthy();
  });
});
