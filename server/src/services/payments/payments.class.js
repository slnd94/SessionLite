/* eslint-disable no-unused-vars */
exports.payments = class Payments {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
    this.stripe = require('stripe')(this.app.get('stripeSecretKey'));
  }

  async create (data, params) {
    // get the user's cart
    const userCart = await this.app.service('user-carts').get(params.user._id, {});
    const userCartTotal = userCart.total;    

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: userCartTotal.figure * 100,
      currency: userCartTotal.currencyCode,
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
    });

    return { clientSecret: paymentIntent.client_secret };
  }
};
