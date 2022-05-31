const app = require('../../src/app');

describe('\'sales\' service', () => {
  it('registered the service', () => {
    const service = app.service('sales');
    expect(service).toBeTruthy();
  });
});
