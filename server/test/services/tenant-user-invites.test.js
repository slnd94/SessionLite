const app = require('../../src/app');

describe('\'tenantUserInvites\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-user-invites');
    expect(service).toBeTruthy();
  });
});
