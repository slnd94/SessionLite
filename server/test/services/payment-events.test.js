const app = require('../../src/app');

describe('\'paymentEvents\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-events');
    expect(service).toBeTruthy();
  });
});
