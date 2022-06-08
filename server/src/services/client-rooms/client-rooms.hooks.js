const { authenticate } = require('@feathersjs/authentication').hooks;
const authorizeClientUser = require('../../hooks/authorize-client-user');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [authorizeClientUser()],
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
