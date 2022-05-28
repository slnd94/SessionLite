const app = require('../../src/app');

describe('\'paymentIntents\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-intents');
    expect(service).toBeTruthy();
  });
});
