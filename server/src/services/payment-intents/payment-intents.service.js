// Initializes the `paymentIntents` service on path `/payment-intents`
const { PaymentIntents } = require('./payment-intents.class');
const createModel = require('../../models/payment-intents.model');
const hooks = require('./payment-intents.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment-intents', new PaymentIntents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-intents');

  service.hooks(hooks);
};
