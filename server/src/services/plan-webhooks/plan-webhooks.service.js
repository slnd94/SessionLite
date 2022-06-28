// Initializes the `planWebhooks` service on path `/plan-webhooks`
const { PlanWebhooks } = require('./plan-webhooks.class');
const hooks = require('./plan-webhooks.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/plan-webhooks', new PlanWebhooks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('plan-webhooks');

  service.hooks(hooks);
};
