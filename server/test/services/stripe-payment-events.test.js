const app = require('../../src/app');

describe('\'paymentWebhooks\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-webhooks');
    expect(service).toBeTruthy();
  });
});
