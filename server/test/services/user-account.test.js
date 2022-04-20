const app = require('../../src/app');

describe('\'userAccount\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-account');
    expect(service).toBeTruthy();
  });
});
