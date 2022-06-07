const { authenticate } = require('@feathersjs/authentication').hooks;
const { iff, isProvider, keep, disallow } = require('feathers-hooks-common');

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
