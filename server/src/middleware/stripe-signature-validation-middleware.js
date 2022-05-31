const bodyParser = require("body-parser");

  // We need to do this in middleware in order to parse the raw body (which is required by Stripe)
  // this middleware does not closely follow standard feathers middleware structure but is a valid structured express middleware
  // Solution (workaround) was sourced from: https://github.com/feathersjs/feathers/issues/1771

module.exports = function stripeSignatureValidationMiddleware(stripe, route) {
  return function() {
    const app = this;
    const bodyParserRaw = bodyParser.raw({ type: "*/*" });
    const endpointSecret = app.get("stripePaymentConfirmationWebhookSecret");

    app.post(route, bodyParserRaw, (req, res, next) => {
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        res.status(400).end();
        return;
      }
      let event;
      try {
        console.log('options', {
          body: req.body,
          signature,
          endpointSecret
        })

        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
        req.body = event;
      } catch (err) {
        res.status(400).end();
        return;
      }
      next();
    });
  };
};
