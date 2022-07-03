const app = require('../../src/app');

describe('\'paddleWebhooks\' service', () => {
  it('registered the service', () => {
    const service = app.service('paddle-webhooks');
    expect(service).toBeTruthy();
  });
});
