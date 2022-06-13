const app = require('../../src/app');

describe('\'clientRegistration\' service', () => {
  it('registered the service', () => {
    const service = app.service('client-registration');
    expect(service).toBeTruthy();
  });
});
