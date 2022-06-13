// Initializes the `clientDetails` service on path `/client-details`
const { ClientDetails } = require('./client-details.class');
const hooks = require('./client-details.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/client-details', new ClientDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('client-details');

  service.hooks(hooks);
};
