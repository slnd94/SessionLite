const app = require('../../src/app');

describe('\'userInvites\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-invites');
    expect(service).toBeTruthy();
  });
});
