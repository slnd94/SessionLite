// Initializes the `healthz` service on path `/healthz`
const { Healthz } = require('./healthz.class');
const hooks = require('./healthz.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/healthz', new Healthz(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('healthz');

  service.hooks(hooks);
};
