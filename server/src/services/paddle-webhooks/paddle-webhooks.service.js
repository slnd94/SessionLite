// Initializes the `paddleWebhooks` service on path `/paddle-webhooks`
const { PaddleWebhooks } = require('./paddle-webhooks.class');
const hooks = require('./paddle-webhooks.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/paddle-webhooks', new PaddleWebhooks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('paddle-webhooks');

  service.hooks(hooks);
};
