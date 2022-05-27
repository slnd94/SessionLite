/* eslint-disable no-unused-vars */
exports.PaymentEvents = class PaymentEvents {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
  }

  async create (data, params) {
    console.log("🚀 ~ file: payment-events.class.js ~ line 12 ~ PaymentEvents ~ create ~ data", data)
    console.log("🚀 ~ file: payment-events.class.js ~ line 12 ~ PaymentEvents ~ create ~ params", params)
    
  }
};
