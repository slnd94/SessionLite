const app = require('../../src/app');

describe('\'emailsSendinblue\' service', () => {
  it('registered the service', () => {
    const service = app.service('emails-sendinblue');
    expect(service).toBeTruthy();
  });
});
