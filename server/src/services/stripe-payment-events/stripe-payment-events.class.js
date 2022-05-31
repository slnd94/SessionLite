/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');
exports.StripePaymentEvents = class StripePaymentEvents {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
    // We should have already verified the event using Stripe webhook signature verification
    // Verification is done in our express middleware "stripe-signature-validation-middleware"
    // We needed to do this in the middleware in order to parse the raw body (which is required by Stripe)
    // /src/middleware/stripe-signature-validation-middleware.js
    // this middleware does not follow standard feathers middleware structure
    // Solution (workaround) was sourced from: https://github.com/feathersjs/feathers/issues/1771

    // Handle the event
    switch (data.type) {
      case 'charge.succeeded':
        // the charge has been confirmed successful
        // process the purchase
        const charge = data.data.object;
        console.log('Charge was successful!');
        break;
      default:
        console.log(`Unhandled event type ${data.type}`);
    }

    return { success: true };
  }
};
