const app = require('../../src/app');

describe('\'tenantTemplates\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-templates');
    expect(service).toBeTruthy();
  });
});
