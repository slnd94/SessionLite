const app = require('../../src/app');

describe('\'plans\' service', () => {
  it('registered the service', () => {
    const service = app.service('plans');
    expect(service).toBeTruthy();
  });
});
