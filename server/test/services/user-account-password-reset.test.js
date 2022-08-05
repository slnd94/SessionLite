const app = require('../../src/app');

describe('\'userAccountPasswordReset\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-account-password-reset');
    expect(service).toBeTruthy();
  });
});
