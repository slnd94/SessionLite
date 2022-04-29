const app = require('../../src/app');

describe('\'userAccountVerification\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-account-verification');
    expect(service).toBeTruthy();
  });
});
