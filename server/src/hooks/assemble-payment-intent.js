// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    // get the user's cart
    const cart = await context.app.service('user-carts').get(context.params.user._id, {});
    
    const stripe = require('stripe')(context.app.get('stripeSecretKey'));

    // create the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(cart.total.figure * 100),
      currency: cart.total.currencyCode,
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
    });

    // assemble the payment intent record for our DB
    context.data = {
      userId: context.params.user._id,
      orderItems: cart.items.map(item => ({
        product: item.product._id,
        price: item.price,
        priceWhenAdded: item.priceWhenAdded
      })),
      stripePaymentIntentId: paymentIntent.id
    }

    context.params.paymentIntentClientSecret = paymentIntent.client_secret;

    return context;
  };
};
