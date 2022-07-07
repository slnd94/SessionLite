// Initializes the `emailsSendinblue` service on path `/emails-sendinblue`
const { EmailsSendinblue } = require('./emails-sendinblue.class');
const hooks = require('./emails-sendinblue.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/emails-sendinblue', new EmailsSendinblue(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('emails-sendinblue');

  service.hooks(hooks);
};
