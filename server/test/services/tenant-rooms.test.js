const app = require('../../src/app');

describe('\'tenantRooms\' service', () => {
  it('registered the service', () => {
    const service = app.service('tenant-rooms');
    expect(service).toBeTruthy();
  });
});
