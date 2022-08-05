const { authenticate } = require('@feathersjs/authentication').hooks;
const authenticateUserStanding = require('../../hooks/authenticate-user-standing');

module.exports = {
  before: {
    all: [  ],
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
