// Initializes the `paymentEvents` service on path `/payment-events`
const { StripePaymentEvents } = require('./stripe-payment-events.class');
const hooks = require('./stripe-payment-events.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/stripe-payment-events', new StripePaymentEvents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('stripe-payment-events');

  service.hooks(hooks);
};
