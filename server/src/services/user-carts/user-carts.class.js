/* eslint-disable no-unused-vars */

const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');
const currencies = require('../../utils/currencies');

exports.UserCarts = class UserCarts {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
    this.userCurrencyCode = this.app.get('defaultCurrency');
    console.log("🚀 ~ file: user-carts.class.js ~ line 15 ~ UserCarts ~ setup ~ this.userCurrencyCode", this.userCurrencyCode)
    this.userTaxes = currencies[this.userCurrencyCode].taxes;
  }

  async get (id, params) {
    ////////////////
    // get the user's cart
    ////////////////

    const user = await this.app.service('users')
      .get(id, {
        query: {
          $select: {
            cart: 1,
          },
          $populate: [
            {
              path: 'cart.product',
              select: 'name description features prices'
            }
          ]
        }
      });

    const cart = user.cart || [];

    const subtotal = {
      figure: cart.reduce((a, b) => +a + +b.product.prices[this.userCurrencyCode], 0),
      currencyCode: this.userCurrencyCode
    };
    const taxes = this.userTaxes.map(tax => 
      ({
        ...tax,
        amount: {
          figure: Math.ceil(subtotal.figure * tax.rate),
          currencyCode: this.userCurrencyCode
        }
      })
    );
    const total = {
      figure: subtotal.figure + taxes.reduce((a, b) => +a + +b.amount.figure, 0),
      currencyCode: this.userCurrencyCode
    };

    return {
      subtotal,
      taxes,
      total,
      items: cart.sort((a, b) => a.product.name > b.product.name)
    };
  }

  async patch (id, data, params) {
    if (!data.addProduct && !data.removeProduct) {
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }
    if (!!data.addProduct && !!data.removeProduct) {
      return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
    }

    if (data.addProduct) {
      ////////////////
      // add product to user's cart
      ////////////////

      // First check to see if the product is eligible to be added

      const product = await this.app.service('products')
        .get(data.addProduct, {
          $select: {
            prices: 1,
            releaseStatus: 1
          }
        });

      if (!product.prices[this.userCurrencyCode]) {
        // product is not eligible because there is no price available
        return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
      }
      if (product.releaseStatus != 2) {
        // product is not eligible because it is not available for purchase
        return Promise.reject(new errors.BadRequest(errorMessages.badRequest));
      }
      await this.app.service('users')
        .patch(id, {
          $push: {cart: { product: data.addProduct, priceWhenAdded: {
            figure: product.prices[this.userCurrencyCode],
            currencyCode: this.userCurrencyCode
          }}}
        });

      return { success: true };
    }

    if (data.removeProduct) {
      ////////////////
      // remove product from user's cart
      ////////////////
      await this.app.service('users')
        .patch(id, {
          $pull: {cart: { product: data.removeProduct }}
        });

      return { success: true };
    }
  }
};
