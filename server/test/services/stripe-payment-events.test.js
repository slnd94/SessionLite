const app = require('../../src/app');

describe('\'stripePaymentEvents\' service', () => {
  it('registered the service', () => {
    const service = app.service('stripe-payment-events');
    expect(service).toBeTruthy();
  });
});
