const app = require('../../src/app');

describe('\'tenantPlans\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-plans');
    expect(service).toBeTruthy();
  });
});
