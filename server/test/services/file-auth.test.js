const app = require('../../src/app');

describe('\'fileAuth\' service', () => {
  it('registered the service', () => {
    const service = app.service('file-auth');
    expect(service).toBeTruthy();
  });
});
