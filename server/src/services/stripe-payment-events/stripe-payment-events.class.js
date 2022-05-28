/* eslint-disable no-unused-vars */
exports.StripePaymentEvents = class StripePaymentEvents {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
    console.log("🚀 ~ file: payment-events.class.js ~ line 12 ~ StripePaymentEvents ~ create ~ data", data)
    console.log("🚀 ~ file: payment-events.class.js ~ line 12 ~ StripePaymentEvents ~ create ~ params", params)
    return { success: true };
  }
};
