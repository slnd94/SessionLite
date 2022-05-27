// Initializes the `paymentEvents` service on path `/payment-events`
const { PaymentEvents } = require('./payment-events.class');
const hooks = require('./payment-events.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payment-events', new PaymentEvents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payment-events');

  service.hooks(hooks);
};
