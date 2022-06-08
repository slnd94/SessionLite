const app = require('../../src/app');

describe('\'clientRooms\' service', () => {
  it('registered the service', () => {
    const service = app.service('client-rooms');
    expect(service).toBeTruthy();
  });
});
