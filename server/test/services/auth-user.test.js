const app = require('../../src/app');

describe('\'authUser\' service', () => {
  it('registered the service', () => {
    const service = app.service('auth-user');
    expect(service).toBeTruthy();
  });
});
