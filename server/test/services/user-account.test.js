const app = require('../../src/app');

describe('\'userAccounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-accounts');
    expect(service).toBeTruthy();
  });
});
