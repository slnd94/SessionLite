// Initializes the `paymentWebhooks` service on path `/payment-webhooks`
const { PaymentWebhooks } = require('./payment-webhooks.class');
const hooks = require('./payment-webhooks.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment-webhooks', new PaymentWebhooks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-webhooks');

  service.hooks(hooks);
};
