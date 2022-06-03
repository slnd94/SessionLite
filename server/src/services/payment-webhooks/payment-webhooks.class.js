/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const errorMessages = require('../../utils/errorMessages');
exports.PaymentWebhooks = class PaymentWebhooks {
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
        
        try {
          // get the associated payment intent
          const paymentIntentMatch = await this.app.service('payment-intents')
          .find({
            query: {
              stripePaymentIntentId: data.data.object.payment_intent
            }
          }); 

          if (paymentIntentMatch.total !== 1) {
            // couldn't find a unique paymentIntent.  Return bad request
            return Promise.reject(new errors.BadRequest("could not find a unique matching payment intent"));
          } else {
            const paymentIntent = paymentIntentMatch.data[0];
            console.log("🚀 ~ file: payment-webhooks.class.js ~ line 41 ~ PaymentWebhooks ~ create ~ paymentIntent", paymentIntent)
            // Create the sale
            const sale = await this.app.service('sales').create({
              user: paymentIntent.userId,
              pricePaid: { 
                subtotal: paymentIntent.subtotal,
                taxes: paymentIntent.taxes,
                total: paymentIntent.total
              },
              saleProducts: paymentIntent.orderItems.map(item => ({
                product: item.product,
                pricePaid: item.price
              })),
              stripePaymentIntentId: paymentIntent.stripePaymentIntentId
            });

            if(!sale._id) {
              // couldn't create the sale.  Return bad request
              return Promise.reject(new errors.BadRequest("could not create the sale"));
            } else {
              // the sale was created.  Update interested entities
              const results = await Promise.all([
                // Add products to user's purchased products
                this.app.service('users')
                  .patch(paymentIntent.userId, {
                    $push: { purchasedProducts: { $each: paymentIntent.orderItems.map(item => item.product) } }
                  }),
                // empty the user's cart
                this.app.service('users')
                  .patch(paymentIntent.userId, {
                    cart: []
                  }),
                // delete all outstanding paymentintents for the user
                this.app.service('payment-intents')
                  .remove(null, {
                    query: { userId: paymentIntent.userId }
                  })

                // send order confirmation email to user
                // this.app.service('emails')
                //   .create({
                //     template: 'WeebleOrderConfirmation',
                //     destination: user.email,
                //     data: {                  
                //       user: {
                //         name: user.name
                //       },
                //       saleItems: user.cart.map(item => ({
                //         imageUrl: `${this.app.get('stripeSecretKey')}${item.product.images.thumbnail}`,
                //         title: item.product.title,
                //         creator: item.product.creators[0],
                //         pricePaid: getAmountString(item.product.price)
                //       })),
                //       pricePaid: { 
                //         subtotal: getAmountString({
                //           cents: cartSubtotal,
                //           currencyCode: userCurrencyCode
                //         }),
                //         taxes: cartTaxes.map(tax => ({
                //           description: getTaxDescriptionString(tax),
                //           amount: getAmountString(tax.amount)
                //         })),
                //         total: getAmountString({
                //           cents: cartTotal,
                //           currencyCode: userCurrencyCode
                //         })
                //       }
                //     }
                //   })
              ]);
            }
          }          
        }
        catch (err) {
          console.log('err', err.message)
        }
        break;
      default:
        console.log(`Unhandled event type ${data.type}`);
    }

    return { success: true };
  }
};
