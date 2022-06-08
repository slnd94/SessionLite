// Initializes the `clientRegistration` service on path `/client-registration`
const { ClientRegistration } = require('./client-registration.class');
const hooks = require('./client-registration.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/client-registration', new ClientRegistration(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('client-registration');

  service.hooks(hooks);
};
