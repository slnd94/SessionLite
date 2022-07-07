const { authenticate } = require('@feathersjs/authentication').hooks;

const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');

const assemblePaymentIntent = require('../../hooks/assemble-payment-intent');

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    get: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    create: [authenticate('jwt'), authenticateUserStanding(), assemblePaymentIntent()],
    update: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    patch: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ],
    remove: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt'), authenticateUserStanding()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      (context) => {
        context.result = { clientSecret: context.params.paymentIntentClientSecret };
      }, 
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
