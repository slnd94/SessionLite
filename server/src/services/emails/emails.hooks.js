const { authenticate } = require('@feathersjs/authentication').hooks;

const authorizeInternalCall = require('../../hooks/authorize-internal-call');

module.exports = {
  before: {
    all: [authenticate('jwt'), authorizeInternalCall()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
