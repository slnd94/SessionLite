const { authenticate } = require('@feathersjs/authentication').hooks;

const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');

const assemblePaymentIntent = require('../../hooks/assemble-payment-intent');

module.exports = {
  before: {
    all: [],
    find: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt')
    ],
    get: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt')
    ],
    create: [authenticate('jwt'), assemblePaymentIntent()],
    update: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt')
    ],
    patch: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt')
    ],
    remove: [
      iff(isProvider('external'), disallow()),
      authenticate('jwt')
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
