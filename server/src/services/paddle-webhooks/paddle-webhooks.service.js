// Initializes the `paddleWebhooks` service on path `/paddle-webhooks`
const { PaddleWebhooks } = require("./paddle-webhooks.class");
const hooks = require("./paddle-webhooks.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/paddle-webhooks",
    new PaddleWebhooks(options, app),
    function (req, res, next) {
      // paddle event emitter expects a 200 response for success, where our "create" endpoint sends a 201 by default
      // force a 200 response code instead of 201
      if (res.statusCode === 201) {
        res.status(200);
      }
      next();
    }
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("paddle-webhooks");

  service.hooks(hooks);
};
