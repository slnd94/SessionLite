const app = require('../../src/app');

describe('\'clientDetails\' service', () => {
  it('registered the service', () => {
    const service = app.service('client-details');
    expect(service).toBeTruthy();
  });
});
