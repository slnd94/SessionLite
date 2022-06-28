const app = require('../../src/app');

describe('\'planWebhooks\' service', () => {
  it('registered the service', () => {
    const service = app.service('plan-webhooks');
    expect(service).toBeTruthy();
  });
});
