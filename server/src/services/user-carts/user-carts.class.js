/* eslint-disable no-unused-vars */

const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');

const userCurrencyCode = 'CAD';
const userTaxes = require('../../utils/currencies')[userCurrencyCode].taxes;

exports.UserCarts = class UserCarts {
  constructor (options) {
    this.options = options || {};
  }
  
  setup(app) {
    this.app = app;
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

    const subtotal = {
      cents: user.cart.reduce((a, b) => +a + +b.product.prices[userCurrencyCode], 0),
      currencyCode: userCurrencyCode
    };
    const taxes = userTaxes.map(tax => 
      ({
        ...tax,
        amount: {
          cents: Math.ceil(subtotal.cents * tax.rate),
          currencyCode: userCurrencyCode
        }
      })
    );
    const total = {
      cents: subtotal.cents + taxes.reduce((a, b) => +a + +b.amount.cents, 0),
      currencyCode: userCurrencyCode
    };

    return {
      subtotal: subtotal,
      taxes: taxes,
      total: total,
      items: user.cart.sort((a, b) => a.product.name > b.product.name)
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

      if (!product.prices[userCurrencyCode]) {
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
            cents: product.prices[userCurrencyCode],
            currencyCode: userCurrencyCode
          }}}
        });

      return true;
    }

    if (data.removeProduct) {
      ////////////////
      // remove product from user's cart
      ////////////////
      await this.app.service('users')
        .patch(id, {
          $pull: {cart: { product: data.removeProduct }}
        });
      return true;
    }
  }
};
