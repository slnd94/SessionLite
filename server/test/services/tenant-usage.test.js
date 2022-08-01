const app = require('../../src/app');

describe('\'UserCounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-usage');
    expect(service).toBeTruthy();
  });
});
