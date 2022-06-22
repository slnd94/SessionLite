// Initializes the `plans` service on path `/plans`
const { Plans } = require('./plans.class');
const createModel = require('../../models/plans.model');
const hooks = require('./plans.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/plans', new Plans(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('plans');

  service.hooks(hooks);
};
