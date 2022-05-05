const app = require('../../src/app');

describe('\'userCarts\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-carts');
    expect(service).toBeTruthy();
  });
});
