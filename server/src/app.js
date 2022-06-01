const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');



const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongoose = require('./mongoose');

const stripe = require("stripe");
const stripeSignatureValidationMiddleware = require("./middleware/stripe-signature-validation-middleware");

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());


// IMPORTANT: Define stripe middleware before json body parser
// Stripe webhook Verification is done in our express middleware "stripe-signature-validation-middleware"
// We need to do this in the middleware in order to parse the raw body (which is required by Stripe)
// Hence why this needs to be placed before the json body parser.
// Middleware is at:
// /src/middleware/stripe-signature-validation-middleware.js
// this middleware does not closely follow standard feathers middleware structure but is a valid structured express middleware
// Solution (workaround) was sourced from: https://github.com/feathersjs/feathers/issues/1771
app.stripe = stripe(app.get("stripeSecretKey"));
app.configure(
  stripeSignatureValidationMiddleware(app.stripe, "/payment-webhooks")
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());


app.configure(mongoose);


// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
