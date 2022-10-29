const app = require('../../src/app');

describe('\'userSessions\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-sessions');
    expect(service).toBeTruthy();
  });
});
