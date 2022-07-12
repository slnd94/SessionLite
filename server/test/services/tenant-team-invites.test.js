const app = require('../../src/app');

describe('\'tenantTeamInvites\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-team-invites');
    expect(service).toBeTruthy();
  });
});
