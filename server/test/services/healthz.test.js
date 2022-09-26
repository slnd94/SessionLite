const app = require('../../src/app');

describe('\'healthz\' service', () => {
  it('registered the service', () => {
    const service = app.service('healthz');
    expect(service).toBeTruthy();
  });
});
